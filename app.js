import members from './members.json' with { type: 'json' };
import skills from './skills.json' with { type: 'json' };
import { firebaseConfig, organizerUids, adminUid } from './cloud-config.js';

const STORAGE_KEY = 'asdn-team-picker-v1';
const $ = (selector) => document.querySelector(selector);
const MODES = ['cqb', 'outdoor'];
const CRITERIA = [['attack', 'Tấn công'], ['team', 'Phối hợp'], ['exp', 'Kinh nghiệm'], ['defense', 'Phòng thủ'], ['solo', 'Solo'], ['stamina', 'Thể lực']];
const STYLES = { push: 'Đẩy mục tiêu', hold: 'Giữ vị trí', mobile: 'Cơ động' };
const initial = { selected: [], guests: [], teamCount: 2, mode: 'cqb', assignments: {}, lockedPlayers: [], lockedTeams: [], ratings: { cqb: {}, outdoor: {} }, styles: { cqb: {}, outdoor: {} }, stats: {} };
const cloudEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
let state = cloudEnabled ? structuredClone(initial) : loadState();
let canEdit = !cloudEnabled;
let cloudReady = !cloudEnabled;
let cloudAuth, cloudSignIn, cloudSignOut, cloudProvider, cloudSession, cloudAttributes, cloudDb, cloudFs;
let live = null, joinLinkHandled = false;
const ready = { session: false, attributes: false };
const writeQueue = { session: Promise.resolve(), attributes: Promise.resolve() };
const pendingWrites = { session: 0, attributes: 0 };
let authBusy = false;
let search = '';
let toastTimer;

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch { return structuredClone(initial); }
}

function normalizeState(saved) {
  try {
    const guests = Array.isArray(saved.guests) ? saved.guests.filter(g => typeof g?.id === 'string' && typeof g?.name === 'string') : [];
    const ids = new Set([...members, ...guests].map(m => m.id));
    const selected = Array.isArray(saved.selected) ? [...new Set(saved.selected.filter(id => ids.has(id)))] : [];
    const teamCount = Number.isInteger(saved.teamCount) && saved.teamCount >= 2 && saved.teamCount <= 6 ? saved.teamCount : 2;
    const assignments = {};
    if (saved.assignments && typeof saved.assignments === 'object') {
      for (const id of selected) {
        const team = saved.assignments[id];
        if (Number.isInteger(team) && team >= 0 && team < teamCount) assignments[id] = team;
      }
    }
    const lockedPlayers = Array.isArray(saved.lockedPlayers) ? [...new Set(saved.lockedPlayers.filter(id => Number.isInteger(assignments[id])))] : [];
    const lockedTeams = Array.isArray(saved.lockedTeams) && Object.keys(assignments).length ? [...new Set(saved.lockedTeams.filter(t => Number.isInteger(t) && t >= 0 && t < teamCount))] : [];
    const mode = MODES.includes(saved.mode) ? saved.mode : 'cqb';
    const ratings = { cqb: {}, outdoor: {} }, styles = { cqb: {}, outdoor: {} };
    for (const currentMode of MODES) {
      const sourceRatings = saved.ratings?.[currentMode] || (currentMode === 'cqb' ? saved.ratings : {});
      if (sourceRatings && typeof sourceRatings === 'object') {
        for (const [id, value] of Object.entries(sourceRatings)) {
          if (ids.has(id) && Number.isInteger(value) && value >= 1 && value <= 5) ratings[currentMode][id] = value;
        }
      }
      const sourceStyles = saved.styles?.[currentMode];
      if (sourceStyles && typeof sourceStyles === 'object') {
        for (const [id, value] of Object.entries(sourceStyles)) {
          if (ids.has(id) && STYLES[value]) styles[currentMode][id] = value;
        }
      }
    }
    const stats = {};
    if (saved.stats && typeof saved.stats === 'object') {
      for (const [id, detail] of Object.entries(saved.stats)) {
        if (!ids.has(id) || !detail || typeof detail !== 'object') continue;
        const clean = {};
        for (const [key] of CRITERIA) if (Number.isInteger(detail[key]) && detail[key] >= 1 && detail[key] <= 5) clean[key] = detail[key];
        if (Object.keys(clean).length) stats[id] = clean;
      }
    }
    const splitKind = ['balanced', 'random'].includes(saved.splitMode) ? saved.splitMode : undefined;
    return { selected, guests, teamCount, mode, assignments, lockedPlayers, lockedTeams, ratings, styles, stats, ...(splitKind && { splitMode: splitKind }) };
  } catch { return structuredClone(initial); }
}

function setSyncStatus(message, error = false) {
  const status = $('#sync-status');
  status.textContent = message;
  status.classList.toggle('sync-error', error);
}

function save(kind = 'session', auditChanges = null) {
  if (!cloudEnabled) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return; }
  if (!cloudReady || !canEdit) return;
  const snapshot = kind === 'attributes'
    ? { ratings: structuredClone(state.ratings), styles: structuredClone(state.styles), stats: structuredClone(state.stats) }
    : { selected: [...state.selected], guests: structuredClone(state.guests), teamCount: state.teamCount, mode: state.mode, assignments: structuredClone(state.assignments), lockedPlayers: [...state.lockedPlayers], lockedTeams: [...state.lockedTeams], ...(state.splitMode && { splitMode: state.splitMode }) };
  pendingWrites[kind]++;
  setSyncStatus('Đang lưu…');
  // Lịch sử chỉ ghi khi khóa đội (auditChanges do nơi gọi dựng); mọi lần lưu khác không ghi log.
  const changes = auditChanges || [];
  writeQueue[kind] = writeQueue[kind].catch(() => {}).then(() => {
    const { doc, writeBatch, collection, serverTimestamp } = cloudFs;
    const batch = writeBatch(cloudDb);
    batch.set(kind === 'attributes' ? cloudAttributes : cloudSession, snapshot);
    if (changes.length) {
      const user = cloudAuth.currentUser;
      batch.set(doc(collection(cloudDb, 'auditLog')), { uid: user.uid, email: user.email || '', doc: kind === 'attributes' ? 'attributes' : 'current', changes: changes.slice(0, 300), at: serverTimestamp() });
    }
    return batch.commit();
  });
  writeQueue[kind].then(() => {
    pendingWrites[kind]--;
    if (!pendingWrites.session && !pendingWrites.attributes) setSyncStatus('Đã đồng bộ');
  }).catch(error => {
    pendingWrites[kind]--;
    setSyncStatus('Lưu thất bại', true);
    showToast(`Không lưu được: ${error.message}`);
  });
}

async function initCloud() {
  if (!cloudEnabled) {
    setSyncStatus('Bản demo trên thiết bị này');
    $('#auth-button').hidden = true;
    return;
  }
  try {
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged }, { initializeFirestore, doc, onSnapshot, writeBatch, collection, serverTimestamp, query, orderBy, limit, getDocs, getDoc, setDoc, deleteDoc }, liveModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js'),
      import('./live.js?v=mob17').catch(error => { console.error('live.js', error); return null; }),
    ]);
    const app = initializeApp(firebaseConfig);
    cloudAuth = getAuth(app);
    cloudSignIn = signInWithPopup;
    cloudSignOut = signOut;
    cloudProvider = new GoogleAuthProvider();
    const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
    cloudDb = db;
    cloudFs = { doc, writeBatch, collection, serverTimestamp, query, orderBy, limit, getDocs, getDoc, setDoc, deleteDoc, onSnapshot };
    live = liveModule?.initLive({ auth: cloudAuth, db, fs: cloudFs, signInAnonymously, getState: () => state, findMember, makeAvatar, isOrganizer: () => canEdit, toast: showToast, teamColors: TEAM_COLORS });
    if (live) live.onMapChange = renderMapPick;
    cloudSession = doc(db, 'public', 'current');
    cloudAttributes = doc(db, 'public', 'attributes');
    onAuthStateChanged(cloudAuth, user => {
      canEdit = Boolean(user && !user.isAnonymous && organizerUids.includes(user.uid));
      const button = $('#auth-button');
      button.hidden = false;
      const signedInGoogle = Boolean(user && !user.isAnonymous);
      button.textContent = signedInGoogle ? (canEdit ? 'Đăng xuất' : 'Đổi tài khoản') : 'Đăng nhập';
      button.title = user?.uid || '';
      const isAdmin = Boolean(user && user.uid === adminUid);
      $('#audit-button').hidden = !isAdmin;
      if (!isAdmin) $('#audit-panel').hidden = true;
      render();
      live?.onAuth(user);
    });
    const loadTimer = setTimeout(() => {
      if (!cloudReady) setSyncStatus('Chưa kết nối được dữ liệu chung, đang thử lại…', true);
    }, 8000);
    const handleSnapshot = (kind, snapshot) => {
      ready[kind] = true;
      if (!pendingWrites[kind]) {
        const data = snapshot.exists() ? snapshot.data() : {};
        state = normalizeState({ ...state, ...(kind === 'attributes' ? {} : { splitMode: undefined, lockedPlayers: undefined, lockedTeams: undefined }), ...data });
        const key = kind === 'attributes' ? 'attributes' : 'session';
      }
      cloudReady = ready.session && ready.attributes;
      if (cloudReady) clearTimeout(loadTimer);
      render();
      live?.onState();
      if (cloudReady && !joinLinkHandled) { joinLinkHandled = true; live?.consumeJoinLink(); }
      setSyncStatus(pendingWrites.session || pendingWrites.attributes ? 'Đang lưu…' : 'Đã đồng bộ');
    };
    const handleError = error => {
      clearTimeout(loadTimer);
      cloudReady = false;
      setSyncStatus('Không tải được dữ liệu chung', true);
      showToast(error.message);
    };
    onSnapshot(cloudSession, snapshot => handleSnapshot('session', snapshot), handleError);
    onSnapshot(cloudAttributes, snapshot => handleSnapshot('attributes', snapshot), handleError);
  } catch (error) {
    setSyncStatus('Không kết nối được dữ liệu chung', true);
    showToast(error.message);
  }
}
function allMembers() { return [...members, ...state.guests]; }
function findMember(id) { return allMembers().find(m => m.id === id); }
function initials(name) { return [...name.trim()][0]?.toUpperCase() || '?'; }
function styleFor(id) { return state.styles[state.mode][id]; }
function statsFor(id) { return state.stats[id] || skills[id]; }
function detailTotal(id) {
  const detail = statsFor(id);
  if (!detail) return undefined;
  const values = CRITERIA.map(([key]) => detail[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
}
function skill(id) { return detailTotal(id) ?? 3; }
function hasSkill(id) { return detailTotal(id) !== undefined; }
function skillText(id) { return hasSkill(id) ? skill(id).toFixed(1) : '—'; }
const ROLE_LABELS = { admin: 'Ban Quản Trị', elder: 'Người Già', newbie: 'NewBie' };
function makeRoleIcons(member, withLabel = false) {
  const wrap = document.createElement('span'); wrap.className = 'role-icons';
  (member.roles || []).forEach((role) => { if (!ROLE_LABELS[role]) return; const img = document.createElement('img'); img.src = `icons/role-${role}.png`; img.alt = ROLE_LABELS[role]; img.title = ROLE_LABELS[role]; if (!withLabel) { wrap.append(img); return; } const chip = document.createElement('span'); chip.className = 'role-chip'; chip.append(img, ROLE_LABELS[role]); wrap.append(chip); });
  return wrap;
}
function makeAvatar(member, className) {
  if (!member.avatar) {
    const avatar = document.createElement('span');
    avatar.className = `${className} guest-avatar`;
    avatar.textContent = initials(member.name);
    return avatar;
  }
  const avatar = document.createElement('img');
  avatar.className = className;
  avatar.decoding = 'async';
  avatar.src = member.avatar;
  avatar.alt = '';
  avatar.loading = 'lazy';
  return avatar;
}

const expandedCards = new Set();
let rosterTouched = false;
const mobileQuery = window.matchMedia('(max-width: 700px)');
function applyRosterOpen() {
  const viewer = cloudEnabled && !canEdit;
  const open = rosterTouched ? !$('.roster-panel').classList.contains('roster-collapsed') : !(viewer && mobileQuery.matches);
  $('.roster-panel').classList.toggle('roster-collapsed', !open);
  const toggle = $('#roster-toggle');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'THU GỌN DANH SÁCH ▴' : 'MỞ DANH SÁCH ▾';
}

function renderRoster() {
  const container = $('#roster');
  container.replaceChildren();
  const normalized = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi');
  const filtered = allMembers().filter(m => m.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi').includes(normalized));
  for (const member of filtered) {
    const selected = state.selected.includes(member.id);
    const card = document.createElement('article');
    card.className = `member-card${selected ? ' selected' : ''}`;
    const pick = document.createElement('button'); pick.type = 'button'; pick.className = 'card-pick';
    pick.disabled = !cloudReady || !canEdit;
    pick.setAttribute('aria-pressed', String(selected));
    pick.setAttribute('aria-label', `${selected ? 'Bỏ chọn' : 'Chọn'} ${member.name}`);
    const portrait = document.createElement('span'); portrait.className = 'card-portrait';
    portrait.append(makeAvatar(member, 'member-avatar'));
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = member.id.startsWith('guest-') ? 'GUEST' : `#${member.id}`;
    const check = document.createElement('span'); check.className = 'member-check'; check.setAttribute('aria-hidden', 'true'); check.textContent = selected ? '✓' : '+';
    const skillBadge = document.createElement('span'); skillBadge.className = 'card-skill'; skillBadge.textContent = skillText(member.id);
    const skillCaption = document.createElement('span'); skillCaption.textContent = 'SKILL'; skillBadge.append(skillCaption);
    portrait.append(number, check); pick.append(portrait);
    const info = document.createElement('span');
    info.className = 'member-info';
    const name = document.createElement('span'); name.className = 'member-name'; name.textContent = member.name; name.title = member.name;
    const id = document.createElement('span'); id.className = 'member-id'; id.textContent = member.tag || '';
    if (member.tag) id.classList.add('has-tag');
    if (member.roles && member.roles.length) id.prepend(makeRoleIcons(member, true));
    info.append(name, id, skillBadge); pick.append(info);
    pick.addEventListener('click', () => toggleMember(member.id));
    const styleRow = document.createElement('div'); styleRow.className = 'card-footer style-footer';
    const styleLabel = document.createElement('label'); styleLabel.textContent = 'LỐI CHƠI'; styleLabel.htmlFor = `style-${member.id}`;
    const styleSelect = document.createElement('select'); styleSelect.id = `style-${member.id}`; styleSelect.className = 'style-select';
    styleSelect.setAttribute('aria-label', `Lối chơi của ${member.name}`);
    styleSelect.add(new Option('— Chưa chọn', ''));
    for (const [value, label] of Object.entries(STYLES)) styleSelect.add(new Option(label, value));
    styleSelect.value = styleFor(member.id) || '';
    styleSelect.disabled = !canEdit || !cloudReady;
    styleSelect.addEventListener('change', () => {
      if (styleSelect.value) state.styles[state.mode][member.id] = styleSelect.value; else delete state.styles[state.mode][member.id];
      save('attributes'); renderTeams();
    });
    styleRow.append(styleLabel, styleSelect);
    {
      const chart = document.createElement('div'); chart.className = 'card-radar';
      chart.append(radarChart(statsFor(member.id), `Biểu đồ kỹ năng của ${member.name}`));
      const expand = document.createElement('button'); expand.type = 'button'; expand.className = 'card-expand';
      const open = expandedCards.has(member.id);
      card.classList.toggle('expanded', open);
      expand.setAttribute('aria-expanded', String(open));
      expand.innerHTML = '<b></b><span></span>'; expand.firstChild.textContent = skillText(member.id); expand.lastChild.textContent = open ? 'ẨN BIỂU ĐỒ ▴' : 'XEM BIỂU ĐỒ ▾';
      expand.addEventListener('click', () => {
        const next = !expandedCards.has(member.id);
        if (next) expandedCards.add(member.id); else expandedCards.delete(member.id);
        card.classList.toggle('expanded', next);
        expand.setAttribute('aria-expanded', String(next));
        expand.lastChild.textContent = next ? 'ẨN BIỂU ĐỒ ▴' : 'XEM BIỂU ĐỒ ▾';
      });
      if (canEdit && cloudReady) chart.append(statsEditor(member));
      card.append(pick, expand, chart, styleRow);
    }
    if (member.id.startsWith('guest-') && canEdit && cloudReady) {
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'guest-remove';
      remove.textContent = '✕'; remove.setAttribute('aria-label', `Xóa khách mời ${member.name}`); remove.title = 'Xóa khách mời';
      let armed = null;
      remove.addEventListener('click', () => {
        if (armed) { clearTimeout(armed); removeGuest(member.id); return; }
        remove.textContent = 'XÓA?'; remove.classList.add('armed');
        armed = setTimeout(() => { armed = null; remove.textContent = '✕'; remove.classList.remove('armed'); }, 3000);
      });
      card.append(remove);
    }
    container.append(card);
  }
  $('#empty-search').hidden = filtered.length > 0;
}

function statsEditor(member) {
  const wrap = document.createElement('div'); wrap.className = 'stats-edit';
  const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'stats-edit-button'; edit.textContent = '✎ SỬA CHỈ SỐ';
  edit.setAttribute('aria-label', `Sửa chỉ số của ${member.name}`);
  edit.addEventListener('click', () => {
    const form = document.createElement('form'); form.className = 'stats-form';
    const current = statsFor(member.id) || {};
    const inputs = CRITERIA.map(([key, name]) => {
      const label = document.createElement('label'); label.textContent = name;
      const select = document.createElement('select');
      select.add(new Option('—', ''));
      for (let n = 1; n <= 5; n++) select.add(new Option(String(n), String(n)));
      select.value = Number.isFinite(current[key]) ? String(current[key]) : '';
      label.append(select); form.append(label);
      return [key, select];
    });
    const save_ = document.createElement('button'); save_.type = 'submit'; save_.textContent = 'LƯU';
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'HỦY';
    cancel.addEventListener('click', () => wrap.replaceChildren(edit));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const next = {};
      for (const [key, select] of inputs) if (select.value) next[key] = Number(select.value);
      if (Object.keys(next).length) state.stats[member.id] = next; else delete state.stats[member.id];
      save('attributes'); render();
    });
    form.append(save_, cancel); wrap.replaceChildren(form);
  });
  wrap.append(edit);
  return wrap;
}

function removeGuest(id) {
  const guest = state.guests.find(g => g.id === id);
  state.guests = state.guests.filter(g => g.id !== id);
  state.selected = state.selected.filter(value => value !== id);
  delete state.assignments[id]; unlockPlayer(id);
  for (const mode of ['cqb', 'outdoor']) { delete state.ratings[mode][id]; delete state.styles[mode][id]; }
  delete state.stats[id];
  save(); save('attributes'); render();
  if (guest) showToast(`Đã xóa ${guest.name}.`);
}

function toggleMember(id) {
  if (state.selected.includes(id)) {
    state.selected = state.selected.filter(value => value !== id);
    delete state.assignments[id]; unlockPlayer(id);
    delete movedFrom[id];
  } else {
    state.selected.push(id);
    const placed = Object.keys(state.assignments).length > 0;
    if (placed) placeMember(id);
    save('session'); render();
    if (placed) announcePlacement([id]);
    return;
  }
  save(); render();
}

function smallestTeam() {
  const counts = Array(state.teamCount).fill(0);
  Object.values(state.assignments).forEach(index => { if (index < counts.length) counts[index]++; });
  const open = eligibleTeams();
  return open.reduce((best, team) => counts[team] < counts[best] ? team : best, open[0]);
}

// Khóa: một người "cố định" nếu bị khóa riêng hoặc thuộc đội đã khóa. Mọi thao tác tự động chỉ được
// di chuyển người nào isMovable; người cố định vẫn được tính vào quân số/skill của đội.
function isTeamLocked(team) { return state.lockedTeams.includes(team); }
function isPlayerLocked(id) { return state.lockedPlayers.includes(id); }
function isMovable(id) { return !isPlayerLocked(id) && !(Number.isInteger(state.assignments[id]) && isTeamLocked(state.assignments[id])); }
function eligibleTeams() {
  const open = Array.from({ length: state.teamCount }, (_, i) => i).filter(i => !isTeamLocked(i));
  return open.length ? open : Array.from({ length: state.teamCount }, (_, i) => i);
}
function unlockPlayer(id) { state.lockedPlayers = state.lockedPlayers.filter(value => value !== id); }
function clearLocks() { state.lockedPlayers = []; state.lockedTeams = []; }
function lockCount() { return state.lockedPlayers.length + state.lockedTeams.length; }
// Gán người tự do vào đội: lần lượt vào đội ít người nhất trong các đội được phép (hòa thì chọn ngẫu nhiên).
function fillFree(free, fixed, teamCount, teams) {
  const counts = Array(teamCount).fill(0);
  Object.values(fixed).forEach(t => counts[t]++);
  const assignments = { ...fixed };
  for (const id of free) {
    const min = Math.min(...teams.map(t => counts[t]));
    const ties = teams.filter(t => counts[t] === min);
    const team = ties[randomIndex(ties.length)];
    assignments[id] = team; counts[team]++;
  }
  return assignments;
}
// Tách danh sách thành người cố định (kèm đội hiện tại) và người tự do.
function splitFixed(ids) {
  const fixed = {}, free = [];
  for (const id of ids) { if (!isMovable(id) && Number.isInteger(state.assignments[id])) fixed[id] = state.assignments[id]; else free.push(id); }
  return { fixed, free };
}

// Người vừa được chuyển đội (chỉ lưu tạm trên máy này, mất khi chia lại hoặc tải lại trang).
const movedFrom = {};
function resetRebalance() { for (const id of Object.keys(movedFrom)) delete movedFrom[id]; pendingRebalance = null; }
function noteMove(id, from, to) {
  if (movedFrom[id] === undefined) movedFrom[id] = from;
  if (movedFrom[id] === to) delete movedFrom[id];
}
let pendingRebalance = null;

// Xếp người mới vào đội hình đang có mà không đụng đến ai khác. Lineup chia ngẫu nhiên giữ cách đơn giản
// (đội ít người nhất); còn lại luôn chọn đội cho điểm cân bằng tốt nhất.
function placeMember(id) {
  if (state.splitMode === 'random') { state.assignments[id] = smallestTeam(); return; }
  const others = state.selected.filter(other => other !== id && Number.isInteger(state.assignments[other]));
  state.assignments[id] = bestTeamFor(state.assignments, others, state.teamCount, id);
}
function announcePlacement(ids) {
  if (ids.length === 1) showToast(`${findMember(ids[0])?.name || 'Người mới'} → Đội ${state.assignments[ids[0]] + 1}`);
  else showToast(`Đã xếp ${ids.length} người mới vào đội, không đổi người cũ.`);
}

// Các cặp không được ở chung đội (thêm cặp mới bằng cách thêm [idA, idB]).
const SEPARATE_PAIRS = [
  // ['005', '007'], // ví dụ: Hoàng Nguyễn - Hoàng Trung (đang tắt)
];
const SEPARATE_PENALTY = 1000;
// Cân bằng theo skill trung bình mỗi người. Khi số người các đội lệch nhau, TB mỗi người của đội ít người
// phải cao hơn đội đông ít nhất SIZE_GAP_MIN_AVG (thang 1-5): thiếu thì phạt rất nặng (bình phương, trọng số lớn),
// dư thì chỉ kéo nhẹ về gần mức tối thiểu. Nếu không thể đạt được thì chọn phương án gần nhất, không báo lỗi.
const SIZE_GAP_MIN_AVG = 0.2;
const SIZE_GAP_SHORT_WEIGHT = 1000;
const SIZE_GAP_EXCESS_WEIGHT = 1;

// Cân bằng Thể lực / Kinh nghiệm: rải đều người yếu (điểm <= *_LOW_MAX) và người giỏi (>= *_HIGH_MIN)
// giữa các đội; người chưa chấm điểm bị bỏ qua. Trọng số cơ bản 0.65.
const LOW_STAMINA_MAX = 3;
const LOW_EXP_MAX = 2;
const HIGH_EXP_MIN = 4;
const STAMINA_WEIGHT = 0.65;
const STAMINA_AVG_WEIGHT = 0.15;
const EXP_LOW_WEIGHT = 0.65;
const EXP_HIGH_WEIGHT = 0.4;

function rated(id, key) {
  const value = statsFor(id)?.[key];
  return Number.isFinite(value) ? value : undefined;
}

function brokenPairs(assignments) {
  return SEPARATE_PAIRS.filter(([a, b]) => Number.isInteger(assignments[a]) && assignments[a] === assignments[b]);
}

function shuffle(ids) {
  const result = [...ids];
  for (let i = result.length - 1; i > 0; i--) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const j = values[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Phạt skill TB: các đội cùng quân số thì TB càng gần nhau càng tốt; đội ít người so với đội đông hơn
// thì cần chênh >= SIZE_GAP_MIN_AVG. Dùng chung cho scoreLayout.
function skillGapPenalty(totals, counts) {
  const avgs = totals.map((total, i) => total / (counts[i] || 1));
  let penalty = 0;
  for (let i = 0; i < avgs.length; i++) for (let j = i + 1; j < avgs.length; j++) {
    if (counts[i] === counts[j]) { penalty += (avgs[i] - avgs[j]) ** 2; continue; }
    const gap = counts[i] < counts[j] ? avgs[i] - avgs[j] : avgs[j] - avgs[i];
    penalty += gap < SIZE_GAP_MIN_AVG ? SIZE_GAP_SHORT_WEIGHT * (SIZE_GAP_MIN_AVG - gap) ** 2 : SIZE_GAP_EXCESS_WEIGHT * (gap - SIZE_GAP_MIN_AVG) ** 2;
  }
  return penalty;
}

// Chênh TB nhỏ nhất giữa một đội ít người và một đội đông hơn (âm nếu đội ít người thấp hơn).
function minSizeGap(totals, counts) {
  let min = Infinity;
  for (let i = 0; i < counts.length; i++) for (let j = 0; j < counts.length; j++) {
    if (counts[i] < counts[j]) min = Math.min(min, totals[i] / (counts[i] || 1) - totals[j] / counts[j]);
  }
  return min;
}

function scoreLayout(assignments, ids, teamCount) {
  const totals = Array(teamCount).fill(0), counts = Array(teamCount).fill(0);
  for (const id of ids) {
    const team = assignments[id]; totals[team] += skill(id); counts[team]++;
  }
  // Phạt chênh lệch số người "yếu/giỏi" giữa các đội so với kỳ vọng theo quân số.
  const flags = [
    ['stamina', v => v <= LOW_STAMINA_MAX, STAMINA_WEIGHT],
    ['exp', v => v <= LOW_EXP_MAX, EXP_LOW_WEIGHT],
    ['exp', v => v >= HIGH_EXP_MIN, EXP_HIGH_WEIGHT],
  ];
  let attrPenalty = 0;
  for (const [key, test, weight] of flags) {
    const per = Array(teamCount).fill(0); let all = 0;
    for (const id of ids) { const v = rated(id, key); if (v !== undefined && test(v)) { per[assignments[id]]++; all++; } }
    if (all) attrPenalty += weight * per.reduce((sum, c, i) => sum + (c - all * counts[i] / ids.length) ** 2, 0);
  }
  const stam = Array(teamCount).fill(0), stamN = Array(teamCount).fill(0);
  for (const id of ids) { const v = rated(id, 'stamina'); if (v !== undefined) { stam[assignments[id]] += v; stamN[assignments[id]]++; } }
  const stamAll = stamN.reduce((a, b) => a + b, 0);
  if (stamAll) {
    const mean = stam.reduce((a, b) => a + b, 0) / stamAll;
    attrPenalty += STAMINA_AVG_WEIGHT * stam.reduce((sum, t, i) => sum + (stamN[i] ? (t / stamN[i] - mean) ** 2 : 0), 0);
  }
  return skillGapPenalty(totals, counts) + attrPenalty + brokenPairs(assignments).length * SEPARATE_PENALTY;
}

// Khóa đội hình không phụ thuộc thứ tự đội: mỗi đội là tập thành viên đã sắp xếp.
function layoutKey(assignments, ids, teamCount) {
  const teams = Array.from({ length: teamCount }, () => []);
  ids.forEach(id => teams[assignments[id]].push(id));
  return teams.map(team => team.sort().join(',')).sort().join('|');
}

function randomIndex(length) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % length;
}

// ---- Xếp người mới / cân lại tối thiểu (hàm thuần, không đụng vào state) ----
const REBALANCE_MAX_MOVES = 3;
const REBALANCE_BEAM = 150;
const SPREAD_FLAGS = [
  ['stamina', v => v <= LOW_STAMINA_MAX],
  ['exp', v => v <= LOW_EXP_MAX],
  ['exp', v => v >= HIGH_EXP_MIN],
];

// Đánh giá độ cân bằng theo thứ tự ưu tiên: quân số (chênh <= 1), luật +SIZE_GAP_MIN_AVG, rồi chênh lệch
// số người yếu thể lực / ít kinh nghiệm / kinh nghiệm cao giữa các đội (<= 1). ok = không vi phạm gì.
function balanceStatus(assignments, ids, teamCount) {
  const totals = Array(teamCount).fill(0), counts = Array(teamCount).fill(0);
  for (const id of ids) { const team = assignments[id]; totals[team] += skill(id); counts[team]++; }
  const sizeExcess = Math.max(0, Math.max(...counts) - Math.min(...counts) - 1);
  const gap = minSizeGap(totals, counts);
  const gapShort = Number.isFinite(gap) ? Math.max(0, SIZE_GAP_MIN_AVG - gap) : 0;
  let attrExcess = 0;
  for (const [key, test] of SPREAD_FLAGS) {
    const per = Array(teamCount).fill(0);
    for (const id of ids) { const v = rated(id, key); if (v !== undefined && test(v)) per[assignments[id]]++; }
    attrExcess += Math.max(0, Math.max(...per) - Math.min(...per) - 1);
  }
  const ok = sizeExcess === 0 && gapShort < 1e-9 && attrExcess === 0;
  return { counts, totals, gap, sizeExcess, gapShort, attrExcess, ok, score: scoreLayout(assignments, ids, teamCount) };
}

function compareStatus(x, y, withScore = true) {
  if (x.sizeExcess !== y.sizeExcess) return x.sizeExcess - y.sizeExcess;
  if (Math.abs(x.gapShort - y.gapShort) > 1e-6) return x.gapShort - y.gapShort;
  if (x.attrExcess !== y.attrExcess) return x.attrExcess - y.attrExcess;
  return withScore ? x.score - y.score : 0;
}

// Đội tốt nhất cho một người mới: chỉ xét các đội đang ít người nhất (giữ chênh quân số nhỏ nhất),
// chọn đội cho scoreLayout thấp nhất. Không động đến người đã xếp.
function bestTeamFor(assignments, ids, teamCount, id) {
  const counts = Array(teamCount).fill(0);
  for (const other of ids) counts[assignments[other]]++;
  const open = eligibleTeams();
  const low = Math.min(...open.map(team => counts[team]));
  let best = -1, bestScore = Infinity;
  for (const team of open) {
    if (counts[team] !== low) continue;
    const score = scoreLayout({ ...assignments, [id]: team }, [...ids, id], teamCount);
    if (score < bestScore - 1e-9) { best = team; bestScore = score; }
  }
  return best;
}

// Tìm cách cân lại với ít lượt chuyển nhất (<= maxMoves lượt, mỗi lượt là chuyển 1 người hoặc đổi chỗ 2 người).
// Tìm theo từng độ sâu (beam search); dừng ở độ sâu đầu tiên đạt cân bằng hoàn toàn, nếu không thì ở độ sâu
// đầu tiên đạt kết quả tốt nhất tìm được.
function findMinimalRebalance(assignments, ids, teamCount, maxMoves = REBALANCE_MAX_MOVES) {
  const startStatus = balanceStatus(assignments, ids, teamCount);
  const before = { assignments: { ...assignments }, status: startStatus };
  let best = { assignments: before.assignments, status: startStatus, depth: 0 };
  if (startStatus.ok) return { before, after: best, moved: [] };
  const keyOf = a => ids.map(id => a[id]).join('');
  // Người bị khóa (hoặc thuộc đội khóa) đứng yên; không ai được chuyển vào đội khóa.
  const movable = ids.filter(isMovable), open = eligibleTeams();
  const seen = new Set([keyOf(assignments)]);
  let frontier = [{ assignments: { ...assignments }, status: startStatus }];
  for (let depth = 1; depth <= maxMoves; depth++) {
    const next = [];
    const push = a => {
      const key = keyOf(a);
      if (seen.has(key)) return;
      seen.add(key);
      next.push({ assignments: a, status: balanceStatus(a, ids, teamCount) });
    };
    for (const node of frontier) {
      const a = node.assignments;
      for (let i = 0; i < movable.length; i++) {
        for (const team of open) if (team !== a[movable[i]]) push({ ...a, [movable[i]]: team });
        for (let j = i + 1; j < movable.length; j++) if (a[movable[i]] !== a[movable[j]]) push({ ...a, [movable[i]]: a[movable[j]], [movable[j]]: a[movable[i]] });
      }
    }
    if (!next.length) break;
    next.sort((x, y) => compareStatus(x.status, y.status));
    if (compareStatus(next[0].status, best.status, false) < 0) best = { ...next[0], depth };
    if (best.status.ok) break;
    frontier = next.slice(0, REBALANCE_BEAM);
  }
  const moved = ids.filter(id => best.assignments[id] !== assignments[id]).map(id => ({ id, from: assignments[id], to: best.assignments[id] }));
  return { before, after: best, moved };
}

// Số lần chia gần nhất được nhớ để không lặp lại, và độ lệch điểm tối đa so với phương án tốt nhất
// mà một đội hình vẫn được coi là "cân bằng đủ tốt" để chọn ngẫu nhiên.
const RECENT_LAYOUTS = 6;
const NEAR_BEST_TOLERANCE = 0.05;
const recentLayouts = [];

function addCandidate(candidates, assignments, ids, teamCount, score) {
  const key = layoutKey(assignments, ids, teamCount);
  if (!candidates.has(key)) candidates.set(key, { assignments: { ...assignments }, score, key });
}

function balancedAssignments(ids, teamCount, avoid = [], fixed = {}, teams = Array.from({ length: teamCount }, (_, i) => i)) {
  const free = ids.filter(id => !(id in fixed));
  const candidates = new Map();
  for (let attempt = 0; attempt < 64; attempt++) {
    const assignments = fillFree(shuffle(free), fixed, teamCount, teams);
    let current = scoreLayout(assignments, ids, teamCount);
    for (let pass = 0; pass < 12; pass++) {
      let improved = false;
      for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) {
        const first = free[a], second = free[b];
        if (assignments[first] === assignments[second]) continue;
        [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
        const next = scoreLayout(assignments, ids, teamCount);
        if (next + 1e-9 < current) { current = next; improved = true; }
        else [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
      }
      if (!improved) break;
    }
    addCandidate(candidates, assignments, ids, teamCount, current);
    // Các đội hình lân cận (đổi chỗ 1 cặp) của phương án cục bộ tốt cũng là ứng viên "gần tốt nhất".
    for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) {
      const first = free[a], second = free[b];
      if (assignments[first] === assignments[second]) continue;
      [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
      addCandidate(candidates, { ...assignments }, ids, teamCount, scoreLayout(assignments, ids, teamCount));
      [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
    }
  }
  const ranked = [...candidates.values()].sort((x, y) => x.score - y.score);
  const fresh = ranked.filter(c => !avoid.includes(c.key));
  const pool = fresh.length ? fresh : ranked;
  const limit = pool[0].score + Math.max(NEAR_BEST_TOLERANCE, pool[0].score * 0.1);
  const nearBest = pool.filter(c => c.score <= limit);
  const pick = nearBest[randomIndex(nearBest.length)];
  return { assignments: pick.assignments, key: pick.key };
}

function warnSeparatePairs() {
  const broken = brokenPairs(state.assignments);
  if (broken.length) showToast(`Cảnh báo: ${broken.map(pair => pair.map(id => findMember(id)?.name || id).join(' & ')).join(', ')} không nên chung đội.`);
}

function splitTeams() {
  if (state.selected.length < state.teamCount) { showToast(`Cần ít nhất ${state.teamCount} người cho ${state.teamCount} đội.`); return; }
  const currentKey = state.selected.every(id => Number.isInteger(state.assignments[id]))
    ? layoutKey(state.assignments, state.selected, state.teamCount) : null;
  const avoid = [...recentLayouts, currentKey].filter(Boolean);
  const { fixed, free } = splitFixed(state.selected);
  if (lockCount() && !free.length) { showToast('Tất cả đã bị khóa, không còn ai để chia lại.'); return; }
  const { assignments, key } = balancedAssignments(state.selected, state.teamCount, avoid, fixed, eligibleTeams());
  state.assignments = assignments;
  state.splitMode = 'balanced';
  resetRebalance();
  recentLayouts.push(key);
  if (recentLayouts.length > RECENT_LAYOUTS) recentLayouts.shift();
  save('session'); render();
  warnSeparatePairs();
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SPLIT_MODE_KEY = 'asdn-split-mode';
let splitMode = 'balanced';
try { if (localStorage.getItem(SPLIT_MODE_KEY) === 'random') splitMode = 'random'; } catch {}
function updateSplitIcons() {
  document.querySelectorAll('.mode-icon').forEach(icon => { icon.textContent = splitMode === 'random' ? '⚄' : '⚖'; });
}
function runSplit() { return splitMode === 'random' ? splitRandom() : splitTeams(); }

function splitRandom() {
  if (state.selected.length < state.teamCount) { showToast(`Cần ít nhất ${state.teamCount} người cho ${state.teamCount} đội.`); return; }
  const { fixed, free } = splitFixed(state.selected);
  if (lockCount() && !free.length) { showToast('Tất cả đã bị khóa, không còn ai để chia lại.'); return; }
  // Xáo trộn rồi lần lượt đưa vào đội ít người nhất: quân số các đội chênh tối đa 1 (nếu các đội khóa cho phép).
  const assignments = fillFree(shuffle(free), fixed, state.teamCount, eligibleTeams());
  state.assignments = assignments;
  state.splitMode = 'random';
  resetRebalance();
  save('session'); render();
  warnSeparatePairs();
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function rebalanceText(status) {
  const gap = Number.isFinite(status.gap) ? ` · chênh TB ${status.gap >= 0 ? '+' : ''}${status.gap.toFixed(2)}` : '';
  return `${status.counts.join('·')} người${gap} · điểm lệch ${status.score.toFixed(2)}`;
}

function renderRebalance(hasResult) {
  const box = $('#rebalance-box');
  box.replaceChildren();
  const editable = hasResult && cloudReady && canEdit;
  const assignKey = hasResult ? state.selected.map(id => state.assignments[id]).join('') : '';
  if (pendingRebalance && (!editable || pendingRebalance.base !== assignKey)) pendingRebalance = null;
  box.hidden = true;
  if (!editable) return;
  if (pendingRebalance) {
    const { result } = pendingRebalance;
    box.hidden = false;
    const title = document.createElement('strong');
    title.textContent = result.moved.length ? `Gợi ý cân lại: chuyển ${result.moved.length} người` : 'Đã cân bằng, không cần chuyển ai.';
    box.append(title);
    if (result.moved.length) {
      const moves = document.createElement('p'); moves.className = 'rebalance-moves';
      moves.textContent = result.moved.map(({ id, from, to }) => `${findMember(id)?.name || id}: Đội ${from + 1}→${to + 1}`).join(' · ');
      const diff = document.createElement('p'); diff.className = 'rebalance-diff';
      diff.textContent = `Trước: ${rebalanceText(result.before.status)}\nSau: ${rebalanceText(result.after.status)}${result.after.status.ok ? ' ✓' : ''}`;
      box.append(moves, diff);
      if (!result.after.status.ok) {
        const note = document.createElement('p'); note.className = 'rebalance-diff';
        note.textContent = `Với tối đa ${REBALANCE_MAX_MOVES} lượt chưa cân hoàn toàn được; đây là phương án gần nhất.`;
        box.append(note);
      }
    }
    const actions = document.createElement('div'); actions.className = 'rebalance-actions';
    if (result.moved.length) {
      const apply = document.createElement('button'); apply.type = 'button'; apply.className = 'secondary-button'; apply.textContent = 'ÁP DỤNG';
      apply.addEventListener('click', applyRebalance); actions.append(apply);
    }
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'secondary-button'; cancel.textContent = result.moved.length ? 'HỦY' : 'ĐÓNG';
    cancel.addEventListener('click', () => { pendingRebalance = null; renderTeams(); });
    actions.append(cancel); box.append(actions);
    return;
  }
  const status = balanceStatus(state.assignments, state.selected, state.teamCount);
  const gapMatters = state.splitMode !== 'random';
  if (status.sizeExcess > 0 || (gapMatters && status.gapShort > 1e-9)) {
    box.hidden = false;
    const text = document.createElement('span');
    text.textContent = status.sizeExcess > 0
      ? `Đội hình đang lệch quân số (${status.counts.join(' · ')}).`
      : `Đội ít người chưa cao hơn đội đông ${SIZE_GAP_MIN_AVG.toFixed(1)} TB skill.`;
    const suggest = document.createElement('button'); suggest.type = 'button'; suggest.className = 'secondary-button'; suggest.textContent = 'XEM GỢI Ý CÂN LẠI';
    suggest.addEventListener('click', previewRebalance);
    box.append(text, suggest);
  }
}

function previewRebalance() {
  if (!cloudReady || !canEdit) return;
  const hasResult = state.selected.length > 0 && state.selected.every(id => Number.isInteger(state.assignments[id]));
  if (!hasResult) return;
  const result = findMinimalRebalance(state.assignments, state.selected, state.teamCount);
  pendingRebalance = { result, base: state.selected.map(id => state.assignments[id]).join('') };
  renderTeams();
}

function applyRebalance() {
  if (!pendingRebalance) return;
  for (const { id, from, to } of pendingRebalance.result.moved) { noteMove(id, from, to); state.assignments[id] = to; }
  const count = pendingRebalance.result.moved.length;
  pendingRebalance = null;
  save('session'); render();
  warnSeparatePairs();
  showToast(`Đã cân lại: chuyển ${count} người.`);
}

function lockButton(locked, label, text, onClick) {
  const button = document.createElement('button'); button.type = 'button'; button.className = `lock-button${locked ? ' on' : ''}`;
  button.textContent = `${locked ? '🔒' : '🔓'}${text ? ` ${text}` : ''}`;
  button.setAttribute('aria-pressed', String(locked)); button.setAttribute('aria-label', label); button.title = `${label}${locked ? '' : ' (giữ nguyên khi chia lại)'}`;
  button.disabled = !cloudReady || !canEdit;
  button.addEventListener('click', onClick);
  return button;
}
function togglePlayerLock(id) {
  const lock = !isPlayerLocked(id);
  if (lock) state.lockedPlayers.push(id); else unlockPlayer(id);
  save('session'); renderTeams(); updateLockUi();
}
function toggleTeamLock(team) {
  const lock = !isTeamLocked(team);
  state.lockedTeams = lock ? [...state.lockedTeams, team].sort() : state.lockedTeams.filter(t => t !== team);
  save('session', lock ? lockTeamAudit(team) : null); renderTeams(); updateLockUi();
}
// Bản ghi lịch sử khi khóa đội: đội hình tại thời điểm khóa.
function lockTeamAudit(team) {
  const members = Object.keys(state.assignments).filter(id => state.assignments[id] === team);
  return [{ path: 'action', before: null, after: 'lock-team' }, { path: `lockedTeams/${team}`, before: null, after: true }, ...members.map(id => ({ path: `lockedRoster/${team}/${id}`, before: null, after: findMember(id)?.name || id }))];
}
function updateLockUi() {
  $('#unlock-all').hidden = !(canEdit && lockCount());
  $('#lock-hint').hidden = !canEdit || lockHintSeen;
}
let lockHintSeen = false;
try { lockHintSeen = localStorage.getItem('asdn-lock-hint') === '1'; } catch {}

function renderTeams() {
  const hasResult = state.selected.length > 0 && state.selected.every(id => Number.isInteger(state.assignments[id]));
  $('#results').hidden = !hasResult;
  for (const id of Object.keys(movedFrom)) if (!state.selected.includes(id) || state.assignments[id] === movedFrom[id]) delete movedFrom[id];
  renderRebalance(hasResult);
  if (!hasResult) return;
  const teams = Array.from({ length: state.teamCount }, () => []);
  for (const id of state.selected) {
    const member = findMember(id);
    if (member && state.assignments[id] < teams.length) teams[state.assignments[id]].push(member);
  }
  const container = $('#teams'); container.replaceChildren();
  const series = [];
  container.classList.toggle('many', state.teamCount > 2);
  teams.forEach((people, index) => {
    const card = document.createElement('article'); card.className = 'team-card';
    const head = document.createElement('div'); head.className = 'team-head';
    const title = document.createElement('h3'); title.textContent = `Đội ${String(index + 1).padStart(2, '0')}`;
    const count = document.createElement('span'); count.textContent = `${people.length} NGƯỜI · TB ${(people.reduce((sum, person) => sum + skill(person.id), 0) / (people.length || 1)).toFixed(1)} SKILL`;
    const teamLocked = isTeamLocked(index);
    card.classList.toggle('team-locked', teamLocked);
    const lockTeam = lockButton(teamLocked, `${teamLocked ? 'Mở khóa' : 'Khóa'} Đội ${index + 1}`, teamLocked ? 'ĐÃ KHÓA' : 'KHÓA ĐỘI', () => toggleTeamLock(index));
    lockTeam.classList.add('team-lock');
    head.append(title, count);
    if (teamLocked || canEdit) head.append(lockTeam);
    if (teamLocked && canEdit && live) { const qr = document.createElement('button'); qr.type = 'button'; qr.className = 'team-qr'; qr.textContent = 'QR VÀO ĐỘI'; qr.setAttribute('aria-label', `Mã QR vào Đội ${index + 1}`); qr.addEventListener('click', () => live.openOrganizer(index)); head.append(qr); }
    const list = document.createElement('div'); list.className = 'team-list';
    if (!people.length) { const empty = document.createElement('p'); empty.className = 'team-empty'; empty.textContent = 'Chưa có thành viên.'; list.append(empty); }
    people.forEach(member => {
      const row = document.createElement('div'); row.className = 'team-person';
      row.append(makeAvatar(member, 'team-avatar'));
      const text = document.createElement('div'); text.className = 'team-person-text';
      const name = document.createElement('span'); name.className = 'team-person-name'; name.textContent = member.name; name.title = member.name; text.append(name);
      if (member.roles && member.roles.length) { const roleLine = document.createElement('span'); roleLine.className = 'team-tag'; roleLine.append(makeRoleIcons(member, true)); if (member.tag) roleLine.append(member.tag); text.append(roleLine); }
      else if (member.tag) { const tag = document.createElement('span'); tag.className = 'team-tag'; tag.textContent = member.tag; text.append(tag); }
      if (movedFrom[member.id] !== undefined) { const chip = document.createElement('span'); chip.className = 'moved-chip'; chip.textContent = `↔ từ Đội ${movedFrom[member.id] + 1}`; chip.title = 'Vừa được chuyển đội'; text.append(chip); }
      row.append(text);
      const style = document.createElement('span'); style.className = 'team-style'; style.textContent = styleFor(member.id) ? STYLES[styleFor(member.id)] : '—'; style.title = styleFor(member.id) ? 'Lối chơi' : 'Chưa chọn lối chơi'; row.append(style);
      const badge = document.createElement('span'); badge.className = 'team-skill'; badge.textContent = `★ ${skillText(member.id)}`; badge.title = hasSkill(member.id) ? 'Điểm tổng' : 'Chưa đánh giá, tính tạm là 3'; row.append(badge);
      const playerLocked = isPlayerLocked(member.id), fixed = playerLocked || teamLocked;
      row.classList.toggle('person-locked', fixed);
      if (teamLocked && !playerLocked) { const mark = document.createElement('span'); mark.className = 'lock-mark'; mark.textContent = '🔒'; mark.title = `Cố định vì Đội ${index + 1} đã khóa`; row.append(mark); }
      else if (playerLocked || canEdit) {
        const lock = lockButton(playerLocked, `${playerLocked ? 'Mở khóa' : 'Khóa'} ${member.name}`, '', () => togglePlayerLock(member.id));
        lock.classList.add('person-lock'); row.append(lock);
      }
      const select = document.createElement('select'); select.setAttribute('aria-label', `Đổi đội cho ${member.name}`);
      teams.forEach((_, teamIndex) => { const option = new Option(`Đội ${teamIndex + 1}${isTeamLocked(teamIndex) ? ' 🔒' : ''}`, String(teamIndex)); option.disabled = teamIndex !== index && isTeamLocked(teamIndex); select.add(option); });
      select.value = String(index);
      select.disabled = !cloudReady || !canEdit || fixed;
      select.title = fixed ? (playerLocked ? 'Mở khóa người này trước khi đổi đội' : 'Mở khóa đội này trước khi đổi đội') : '';
      select.hidden = !canEdit;
      select.addEventListener('change', () => { noteMove(member.id, state.assignments[member.id], Number(select.value)); state.assignments[member.id] = Number(select.value); save('session'); renderTeams(); warnSeparatePairs(); });
      row.append(select); list.append(row);
    });
    const color = TEAM_COLORS[index % TEAM_COLORS.length];
    card.style.borderTop = `3px solid ${color}`;
    title.prepend(Object.assign(document.createElement('i'), { className: 'team-dot' }));
    title.firstChild.style.background = color;
    const average = teamAverage(people);
    if (Object.keys(average).length) series.push({ values: average, color, name: `Đội ${index + 1}`, count: people.length, total: people.reduce((sum, person) => sum + skill(person.id), 0) });
    card.append(head, list);
    container.append(card);
  });
  let compare = $('#team-compare');
  if (!compare) { compare = document.createElement('div'); compare.id = 'team-compare'; compare.className = 'team-compare'; container.before(compare); }
  compare.replaceChildren();
  compare.hidden = series.length === 0;
  if (series.length) {
    const legend = document.createElement('div'); legend.className = 'compare-legend';
    series.forEach(({ name, color, count, total }) => { const item = document.createElement('span'); const dot = document.createElement('i'); dot.className = 'team-dot'; dot.style.background = color; const label = document.createElement('b'); label.textContent = name; const stats = document.createElement('small'); stats.textContent = `${count} người · TB ${(total / (count || 1)).toFixed(1)} · tổng ${total.toFixed(1)}`; item.append(dot, label, stats); legend.append(item); });
    compare.append(radarChart({}, 'Biểu đồ so sánh các đội', series), legend);
    const totals = series.map(entry => entry.total);
    const info = [];
    if (state.splitMode) info.push(`Chia kiểu: ${state.splitMode === 'random' ? '⚄ Ngẫu nhiên' : '⚖ Cân bằng'}`);
    const counts = series.map(entry => entry.count);
    if (state.splitMode === 'balanced' && Math.max(...counts) !== Math.min(...counts)) {
      info.push(`Mục tiêu: đội ít người cao hơn đội đông ít nhất ${SIZE_GAP_MIN_AVG.toFixed(1)}`);
      const gap = minSizeGap(totals, counts);
      const ok = gap >= SIZE_GAP_MIN_AVG - 1e-9;
      info.push(`Chênh TB thực tế: ${gap.toFixed(2)} ${ok ? '✓ đạt' : '✗ chưa đạt'}`);
    }
    const unrated = state.selected.filter(id => !hasSkill(id)).length;
    if (unrated) info.push(`${unrated} người chưa chấm skill được tính 3`);
    if (info.length) { const note = document.createElement('div'); note.className = 'compare-note'; note.append(...info.flatMap((text, i) => [...(i ? [document.createElement('br')] : []), text])); compare.append(note); }
  }
  updateLockUi();
  $('#result-summary').textContent = `${state.mode === 'cqb' ? 'CQB' : 'Sân ngoài trời'} · ${state.selected.length} người · ${state.teamCount} đội · ${state.selected.filter(hasSkill).length} người đã có skill`;
  const badge = $('#split-badge');
  badge.hidden = !state.splitMode;
  if (state.splitMode) badge.textContent = `Chia kiểu: ${state.splitMode === 'random' ? '⚄ Ngẫu nhiên' : '⚖ Cân bằng'}`;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs = {}, text) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}
function gradeOf(value) { return value >= 4.8 ? 'S' : value >= 4.2 ? 'A' : value >= 3.5 ? 'B' : value >= 2.5 ? 'C' : 'D'; }
const GRADE_COLORS = { S: '#f4d35e', A: '#c8f36b', B: '#6fd3ff', C: '#7be0a0', D: '#f4a45f' };
const TEAM_COLORS = ['#c8f36b', '#f4a45f', '#6fd3ff', '#f472b6', '#a78bfa', '#f4d35e'];
function radarChart(values = {}, label, series = null) {
  const cx = 130, cy = 140, radius = 72, step = (Math.PI * 2) / CRITERIA.length;
  const point = (index, scale, extra = 0) => {
    const angle = -Math.PI / 2 + index * step, length = radius * scale + extra;
    return [cx + length * Math.cos(angle), cy + length * Math.sin(angle)];
  };
  const polygon = scale => CRITERIA.map((_, index) => point(index, scale).map(n => n.toFixed(1)).join(',')).join(' ');
  const svg = svgEl('svg', { viewBox: '-40 0 340 275', class: 'skill-radar', role: 'img', 'aria-label': label });
  svg.append(svgEl('rect', { x: -40, y: 0, width: 340, height: 275, rx: 14, class: 'radar-bg' }));
  for (let level = 5; level >= 1; level--) svg.append(svgEl('polygon', { points: polygon(level / 5), class: level === 5 ? 'radar-ring outer' : 'radar-ring' }));
  CRITERIA.forEach((_, index) => { const [x, y] = point(index, 1); svg.append(svgEl('line', { x1: cx, y1: cy, x2: x.toFixed(1), y2: y.toFixed(1), class: 'radar-axis' })); });
  const shape = CRITERIA.map(([key], index) => point(index, Math.max(values[key] ?? 0, 0.3) / 5).map(n => n.toFixed(1)).join(',')).join(' ');
  const hasValues = !series && CRITERIA.some(([key]) => Number.isFinite(values[key]));
  if (hasValues) svg.append(svgEl('polygon', { points: shape, class: 'radar-shape' }));
  for (const { values: teamValues, color } of series || []) {
    const pts = CRITERIA.map(([key], index) => point(index, Math.max(teamValues[key] ?? 0, 0.3) / 5));
    svg.append(svgEl('polygon', { points: pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '), fill: color, 'fill-opacity': 0.18, stroke: color, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));
    pts.forEach(([x, y]) => svg.append(svgEl('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3, fill: color })));
  }
  CRITERIA.forEach(([key, name], index) => {
    const value = values[key];
    const [px, py] = point(index, Math.max(value ?? 0, 0.3) / 5);
    if (hasValues) svg.append(svgEl('circle', { cx: px.toFixed(1), cy: py.toFixed(1), r: 2.6, class: 'radar-dot' }));
    const [lx, ly] = point(index, 1, 30);
    const anchor = Math.abs(lx - cx) < 4 ? 'middle' : lx > cx ? 'start' : 'end';
    const dx = anchor === 'start' ? -8 : anchor === 'end' ? 8 : 0;
    svg.append(svgEl('text', { x: (lx + dx).toFixed(1), y: (ly + (index === 0 ? -10 : 18)).toFixed(1), 'text-anchor': anchor, class: 'radar-label' }, name));
    if (!series && Number.isFinite(value)) {
      const grade = gradeOf(value), color = GRADE_COLORS[grade];
      const [gx, gy] = point(index, 1, 15);
      svg.append(svgEl('circle', { cx: gx.toFixed(1), cy: gy.toFixed(1), r: 9, fill: '#101714', stroke: color, 'stroke-width': 1.6 }));
      svg.append(svgEl('text', { x: gx.toFixed(1), y: (gy + 3.6).toFixed(1), 'text-anchor': 'middle', class: 'radar-grade', fill: color }, grade));
    }
  });
  return svg;
}
function teamAverage(people) {
  const result = {};
  for (const [key] of CRITERIA) {
    const values = people.map(person => statsFor(person.id)?.[key]).filter(Number.isFinite);
    if (values.length) result[key] = values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  return result;
}
function renderMapPick() {
  const box = $('#map-pick'), list = $('#map-pick-buttons');
  const show = Boolean(live?.maps) && canEdit && cloudReady;
  box.hidden = !show;
  if (!show) return;
  live.watchMap();
  const current = live.getMapId();
  if (list.childElementCount !== live.maps.length) {
    list.replaceChildren(...live.maps.map(m => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.map = m.id; button.textContent = m.label;
      button.addEventListener('click', () => live.setMap(m.id));
      return button;
    }));
  }
  list.querySelectorAll('button').forEach(button => {
    const active = button.dataset.map === current;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
}
function render() {
  renderMapPick();
  document.querySelectorAll('.mode-button, .team-count, #select-all, #clear-all, #guest-name, #guest-form button, #reshuffle, #rebalance-min').forEach(control => { control.disabled = !cloudReady || !canEdit; });
  $('#roster-total').textContent = allMembers().length;
  $('#selected-total').textContent = state.selected.length;
  $('#selected-count').textContent = state.selected.length;
  $('#team-total').textContent = state.teamCount;
  document.querySelectorAll('.team-count').forEach(button => {
    const active = Number(button.dataset.count) === state.teamCount;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.mode-button').forEach(button => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  const ready = state.selected.length >= state.teamCount;
  $('#split-button').disabled = !ready || !cloudReady || !canEdit;
  $('#split-mode').disabled = !cloudReady || !canEdit;
  $('#split-mode').value = splitMode;
  updateSplitIcons();
  $('#setup-message').textContent = !cloudReady ? 'Đang tải dữ liệu chung…' : !canEdit ? 'Chỉ người tổ chức được chọn người và chia đội. Bạn đang ở chế độ xem.' : ready ? `${state.selected.length} người sẽ được chia vào ${state.teamCount} đội.` : `Chọn ít nhất ${state.teamCount} người để tạo ${state.teamCount} đội.`;
  const viewer = cloudEnabled && !canEdit;
  document.body.classList.toggle('viewer', viewer);
  $('#viewer-empty').hidden = !viewer || !cloudReady || state.selected.length > 0 && state.selected.every(id => Number.isInteger(state.assignments[id]));
  $('#mobile-bar').hidden = viewer;
  $('#bar-count').textContent = state.selected.length;
  $('#bar-teams').textContent = state.teamCount;
  $('#bar-split').disabled = !ready || !cloudReady || !canEdit;
  applyRosterOpen();
  renderRoster(); renderTeams();
}

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

$('#search').addEventListener('input', event => { search = event.target.value; renderRoster(); });
$('#select-all').addEventListener('click', () => {
  const ids = allMembers().map(m => m.id);
  const placed = [];
  for (const id of ids) if (!state.selected.includes(id)) { state.selected.push(id); if (Object.keys(state.assignments).length) { placeMember(id); placed.push(id); } }
  save('session'); render();
  if (placed.length) announcePlacement(placed);
});
$('#clear-all').addEventListener('click', () => { state.selected = []; state.assignments = {}; clearLocks(); delete state.splitMode; resetRebalance(); save(); render(); });
$('#guest-form').addEventListener('submit', event => {
  event.preventDefault(); const input = $('#guest-name'); const name = input.value.trim();
  if (!name) return;
  const id = `guest-${crypto.randomUUID()}`;
  state.guests.push({ id, name }); state.selected.push(id);
  const placed = Object.keys(state.assignments).length > 0;
  if (placed) placeMember(id);
  input.value = ''; save('session'); render();
  if (placed) announcePlacement([id]); else showToast(`Đã thêm ${name}.`);
});
document.querySelectorAll('.team-count').forEach(button => button.addEventListener('click', () => {
  state.teamCount = Number(button.dataset.count); state.assignments = {}; clearLocks(); resetRebalance(); save(); render();
}));
document.querySelectorAll('.mode-button').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.mode === state.mode) return;
  state.mode = button.dataset.mode; state.assignments = {}; clearLocks(); resetRebalance(); save(); render();
}));
$('#roster-toggle').addEventListener('click', () => {
  rosterTouched = true;
  const panel = $('.roster-panel');
  panel.classList.toggle('roster-collapsed', !panel.classList.contains('roster-collapsed'));
  applyRosterOpen();
});
mobileQuery.addEventListener('change', () => { if (!rosterTouched) render(); });
$('#split-mode').addEventListener('change', event => {
  splitMode = event.target.value === 'random' ? 'random' : 'balanced';
  try { localStorage.setItem(SPLIT_MODE_KEY, splitMode); } catch {}
  render();
});
$('#unlock-all').addEventListener('click', () => { clearLocks(); save('session'); renderTeams(); showToast('Đã mở khóa tất cả.'); });
$('#lock-hint-ok').addEventListener('click', () => { lockHintSeen = true; try { localStorage.setItem('asdn-lock-hint', '1'); } catch {} updateLockUi(); });
$('#split-button').addEventListener('click', runSplit);
$('#bar-split').addEventListener('click', runSplit);
$('#reshuffle').addEventListener('click', runSplit);
$('#rebalance-min').addEventListener('click', previewRebalance);
$('#copy-result').addEventListener('click', async () => {
  const lines = [`ASDN · ${state.mode === 'cqb' ? 'CQB' : 'SÂN NGOÀI TRỜI'} · ĐỘI HÌNH (${state.selected.length} người)`];
  for (let i = 0; i < state.teamCount; i++) {
    const names = state.selected.filter(id => state.assignments[id] === i).map(id => findMember(id)?.name).filter(Boolean);
    lines.push('', `ĐỘI ${i + 1} (${names.length} người)`, ...names.map((name, index) => `${index + 1}. ${name}`));
  }
  try { await navigator.clipboard.writeText(lines.join('\n')); showToast('Đã sao chép đội hình.'); }
  catch { showToast('Không sao chép được. Hãy dùng HTTPS hoặc localhost.'); }
});

$('#auth-button').addEventListener('click', async () => {
  if (!cloudAuth || authBusy) return;
  authBusy = true;
  $('#auth-button').disabled = true;
  try {
    if (canEdit) {
      await cloudSignOut(cloudAuth);
      showToast('Đã đăng xuất.');
    } else {
      await cloudSignIn(cloudAuth, cloudProvider);
    }
  } catch (error) {
    showToast(`Đăng nhập thất bại: ${error.message}`);
  } finally {
    authBusy = false;
    $('#auth-button').disabled = false;
  }
});


render();
initCloud();

const PATH_LABELS = { selected: 'Điểm danh', guests: 'Khách mời', teamCount: 'Số đội', mode: 'Chế độ', assignments: 'Đội', ratings: 'Điểm đánh giá', styles: 'Lối chơi', stats: 'Chỉ số', lockedPlayers: 'Khóa người', lockedTeams: 'Khóa đội', lockedRoster: 'Đội hình khóa' };
const ACTION_LABELS = { 'auto-place': 'Tự xếp người mới vào đội', 'rebalance-min': 'Cân lại tối thiểu', manual: 'Đổi đội thủ công', lock: 'Khóa', unlock: 'Mở khóa', unlockAll: 'Mở khóa tất cả' };
function describeChange({ path, before, after }) {
  const [group, a, b] = path.split('/');
  const modeIndex = group === 'ratings' || group === 'styles';
  const id = modeIndex ? b : a;
  const name = findMember(id)?.name || (group === 'guests' ? after ?? before : id);
  const label = PATH_LABELS[group] || group;
  const where = modeIndex ? ` (${a})` : '';
  const show = value => value === null ? '—' : group === 'stats' ? Object.entries(JSON.parse(value)).map(([k, v]) => `${k}:${v}`).join(' ') : String(value);
  if (group === 'action' && after === 'lock-team') return 'Khóa đội';
  if (group === 'lockedRoster') return `Đội ${Number(a) + 1}: ${typeof after === 'string' ? after : name}`;
  if (group === 'action') return ACTION_LABELS[after] || `Kiểu chia: ${after === 'random' ? 'ngẫu nhiên hoàn toàn' : 'cân bằng'}`;
  if (group === 'lockedPlayers') return `Khóa người: ${name} ${after ? 'khóa' : 'mở khóa'}`;
  if (group === 'lockedTeams') return `Khóa đội: Đội ${Number(a) + 1} ${after ? 'khóa' : 'mở khóa'}`;
  if (group === 'selected') return `${label}: ${name} ${after ? 'tham gia' : 'bỏ chọn'}`;
  if (group === 'guests') return `${label}: ${after ? 'thêm' : 'xóa'} ${name}`;
  if (group === 'teamCount' || group === 'mode') return `${label}: ${show(before)} → ${show(after)}`;
  if (group === 'assignments') return `${label}: ${name} ${before === null ? '' : `Đội ${before + 1} `}→ ${after === null ? '—' : `Đội ${after + 1}`}`;
  return `${label}${where}: ${name} ${show(before)} → ${show(after)}`;
}
const AUDIT_CATS = {
  lock: { label: 'Khóa đội', icon: '🔒' },
  split: { label: 'Chia đội', icon: '🎲' },
  members: { label: 'Thành viên', icon: '👥' },
  stats: { label: 'Chỉ số', icon: '📊' },
  other: { label: 'Khác', icon: '⚙️' }
};
// Bản ghi cũ ghi mọi thay đổi nên phân loại theo nội dung; bản ghi mới chỉ có 'lock-team'.
function auditCategory(data) {
  const groups = new Set(data.changes.map(c => c.path.split('/')[0]));
  const action = data.changes.find(c => c.path === 'action')?.after;
  if (action === 'lock-team' || groups.has('lockedTeams') || groups.has('lockedRoster')) return 'lock';
  if (groups.has('ratings') || groups.has('styles') || groups.has('stats')) return 'stats';
  if (groups.has('selected') || groups.has('guests')) return 'members';
  if (groups.has('assignments') || action) return 'split';
  return 'other';
}
function describeAudit(data, cat) {
  if (cat === 'lock') {
    const roster = {};
    data.changes.filter(c => c.path.startsWith('lockedRoster/')).forEach(c => { const [, t, id] = c.path.split('/'); (roster[t] ||= []).push(typeof c.after === 'string' ? c.after : findMember(id)?.name || id); });
    const teams = Object.keys(roster);
    if (teams.length) return teams.map(t => `Đội ${Number(t) + 1} (${roster[t].length} người): ${roster[t].join(', ')}`);
    const old = data.changes.filter(c => c.path.startsWith('lockedTeams/') && c.after).map(c => `Đội ${Number(c.path.split('/')[1]) + 1}`);
    if (old.length) return [`${old.join(', ')} — bản ghi cũ, không lưu danh sách thành viên`];
  }
  return [data.changes.map(describeChange).join('; ')];
}
let auditLoading = false, auditLoaded = false, auditCat = 'all', auditEntries = [];
function renderAudit() {
  const list = $('#audit-list'), bar = $('#audit-filters');
  const counts = { all: auditEntries.length };
  auditEntries.forEach(e => { counts[e.cat] = (counts[e.cat] || 0) + 1; });
  bar.replaceChildren(...[['all', 'Tất cả'], ...Object.entries(AUDIT_CATS).map(([k, v]) => [k, v.label])].filter(([k]) => k === 'all' || counts[k]).map(([k, label]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = `audit-chip${auditCat === k ? ' on' : ''}`;
    b.textContent = `${label} ${counts[k] || 0}`; b.addEventListener('click', () => { auditCat = k; renderAudit(); }); return b;
  }));
  list.replaceChildren();
  const shown = auditEntries.filter(e => auditCat === 'all' || e.cat === auditCat);
  if (!shown.length) { list.textContent = 'Chưa có lịch sử.'; return; }
  let day = null;
  for (const e of shown) {
    const when = e.data.at?.toDate();
    const dayLabel = when ? when.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : '…';
    if (dayLabel !== day) { day = dayLabel; const h = document.createElement('li'); h.className = 'audit-day'; h.textContent = dayLabel; list.append(h); }
    const item = document.createElement('li'); item.className = `audit-card audit-${e.cat}`;
    const head = document.createElement('div'); head.className = 'audit-head';
    const tag = document.createElement('span'); tag.className = 'audit-tag'; tag.textContent = `${AUDIT_CATS[e.cat].icon} ${AUDIT_CATS[e.cat].label}`;
    const meta = document.createElement('span'); meta.className = 'audit-meta'; meta.textContent = `${when ? when.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '…'} · ${e.data.email || e.data.uid}`;
    head.append(tag, meta); item.append(head);
    describeAudit(e.data, e.cat).forEach(line => { const p = document.createElement('div'); p.className = 'audit-line'; p.textContent = line; item.append(p); });
    list.append(item);
  }
}
async function loadAudit() {
  if (auditLoading) return;
  auditLoading = true;
  const list = $('#audit-list'); list.textContent = 'Đang tải…';
  try {
    const { query, collection, orderBy, limit, getDocs } = cloudFs;
    const snap = await getDocs(query(collection(cloudDb, 'auditLog'), orderBy('at', 'desc'), limit(200)));
    auditLoaded = true;
    auditEntries = []; snap.forEach(entry => { const data = entry.data(); auditEntries.push({ data, cat: auditCategory(data) }); });
    renderAudit();
  } catch (error) { list.textContent = `Không tải được lịch sử: ${error.message}. Bấm "Tải lại" để thử lại.`; }
  finally { auditLoading = false; }
}
$('#audit-button').addEventListener('click', () => {
  const panel = $('#audit-panel'); panel.hidden = !panel.hidden;
  if (!panel.hidden) { if (!auditLoaded) loadAudit(); panel.scrollIntoView({ behavior: 'smooth' }); }
});
$('#audit-refresh').addEventListener('click', loadAudit);
