import members from './members.json' with { type: 'json' };
import { firebaseConfig, organizerUid } from './cloud-config.js';

const STORAGE_KEY = 'asdn-team-picker-v1';
const $ = (selector) => document.querySelector(selector);
const MODES = ['cqb', 'outdoor'];
const STYLES = { push: 'Đẩy mục tiêu', hold: 'Giữ vị trí', mobile: 'Cơ động' };
const initial = { selected: [], guests: [], teamCount: 2, mode: 'cqb', assignments: {}, ratings: { cqb: {}, outdoor: {} }, styles: { cqb: {}, outdoor: {} } };
const cloudEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
let state = cloudEnabled ? structuredClone(initial) : loadState();
let canEdit = !cloudEnabled;
let cloudReady = !cloudEnabled;
let cloudAuth, cloudSignIn, cloudSignOut, cloudProvider, cloudDocument, cloudSetDocument;
let writeQueue = Promise.resolve();
let pendingWrites = 0;
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
    return { selected, guests, teamCount, mode, assignments, ratings, styles };
  } catch { return structuredClone(initial); }
}

function setSyncStatus(message, error = false) {
  const status = $('#sync-status');
  status.textContent = message;
  status.classList.toggle('sync-error', error);
}

function save() {
  if (!cloudEnabled) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return; }
  if (!canEdit || !cloudReady) return;
  const snapshot = structuredClone(state);
  pendingWrites++;
  setSyncStatus('Đang lưu…');
  writeQueue = writeQueue.catch(() => {}).then(() => cloudSetDocument(cloudDocument, snapshot));
  writeQueue.then(() => {
    pendingWrites--;
    if (pendingWrites === 0) setSyncStatus('Đã đồng bộ');
  }).catch(error => {
    pendingWrites--;
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
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }, { getFirestore, doc, onSnapshot, setDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js'),
    ]);
    const app = initializeApp(firebaseConfig);
    cloudAuth = getAuth(app);
    cloudSignIn = signInWithPopup;
    cloudSignOut = signOut;
    cloudProvider = new GoogleAuthProvider();
    cloudSetDocument = setDoc;
    cloudDocument = doc(getFirestore(app), 'public', 'current');
    onAuthStateChanged(cloudAuth, user => {
      canEdit = Boolean(organizerUid && user?.uid === organizerUid);
      const button = $('#auth-button');
      button.hidden = false;
      button.textContent = user ? (canEdit ? 'Tổ chức · Đăng xuất' : 'Đổi tài khoản') : 'Đăng nhập tổ chức';
      render();
    });
    onSnapshot(cloudDocument, snapshot => {
      cloudReady = true;
      if (pendingWrites === 0) {
        state = normalizeState(snapshot.exists() ? snapshot.data() : {});
        render();
      }
      setSyncStatus(pendingWrites ? 'Đang lưu…' : 'Đã đồng bộ');
    }, error => {
      cloudReady = false;
      setSyncStatus('Không tải được dữ liệu chung', true);
      showToast(error.message);
    });
  } catch (error) {
    setSyncStatus('Không kết nối được dữ liệu chung', true);
    showToast(error.message);
  }
}
function allMembers() { return [...members, ...state.guests]; }
function findMember(id) { return allMembers().find(m => m.id === id); }
function initials(name) { return [...name.trim()][0]?.toUpperCase() || '?'; }
function ratingFor(id) { return state.ratings[state.mode][id]; }
function styleFor(id) { return state.styles[state.mode][id]; }
function skill(id) { return ratingFor(id) ?? 3; }
function makeAvatar(member, className) {
  if (!member.avatar) {
    const avatar = document.createElement('span');
    avatar.className = `${className} guest-avatar`;
    avatar.textContent = initials(member.name);
    return avatar;
  }
  const avatar = document.createElement('img');
  avatar.className = className;
  avatar.src = member.avatar;
  avatar.alt = '';
  avatar.loading = 'lazy';
  return avatar;
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
    pick.disabled = !canEdit || !cloudReady;
    pick.setAttribute('aria-pressed', String(selected));
    pick.setAttribute('aria-label', `${selected ? 'Bỏ chọn' : 'Chọn'} ${member.name}`);
    const portrait = document.createElement('span'); portrait.className = 'card-portrait';
    portrait.append(makeAvatar(member, 'member-avatar'));
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = member.id.startsWith('guest-') ? 'GUEST' : `#${member.id}`;
    const check = document.createElement('span'); check.className = 'member-check'; check.setAttribute('aria-hidden', 'true'); check.textContent = selected ? '✓' : '+';
    const skillBadge = document.createElement('span'); skillBadge.className = 'card-skill'; skillBadge.textContent = ratingFor(member.id) ? String(ratingFor(member.id)) : '—';
    const skillCaption = document.createElement('span'); skillCaption.textContent = 'SKILL'; skillBadge.append(skillCaption);
    portrait.append(number, check, skillBadge); pick.append(portrait);
    const info = document.createElement('span');
    info.className = 'member-info';
    const name = document.createElement('span'); name.className = 'member-name'; name.textContent = member.name; name.title = member.name;
    const id = document.createElement('span'); id.className = 'member-id'; id.textContent = member.id.startsWith('guest-') ? 'GUEST PLAYER' : 'ASDN OPERATIVE';
    info.append(name, id); pick.append(info);
    pick.addEventListener('click', () => toggleMember(member.id));
    const footer = document.createElement('div'); footer.className = 'card-footer';
    const label = document.createElement('label'); label.textContent = 'SKILL'; label.htmlFor = `rating-${member.id}`;
    const rating = document.createElement('select'); rating.id = `rating-${member.id}`; rating.className = 'rating-select';
    rating.setAttribute('aria-label', `Skill của ${member.name}`);
    rating.add(new Option('— Chưa đánh giá', ''));
    for (let value = 1; value <= 5; value++) rating.add(new Option(`${value} / 5`, String(value)));
    rating.value = ratingFor(member.id) ? String(ratingFor(member.id)) : '';
    rating.disabled = !canEdit || !cloudReady;
    rating.addEventListener('change', () => {
      if (rating.value) state.ratings[state.mode][member.id] = Number(rating.value); else delete state.ratings[state.mode][member.id];
      skillBadge.firstChild.textContent = rating.value || '—';
      save(); renderTeams();
    });
    footer.append(label, rating);
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
      save(); renderTeams();
    });
    styleRow.append(styleLabel, styleSelect); card.append(pick, footer, styleRow);
    container.append(card);
  }
  $('#empty-search').hidden = filtered.length > 0;
}

function toggleMember(id) {
  if (state.selected.includes(id)) {
    state.selected = state.selected.filter(value => value !== id);
    delete state.assignments[id];
  } else {
    state.selected.push(id);
    if (Object.keys(state.assignments).length) state.assignments[id] = smallestTeam();
  }
  save(); render();
}

function smallestTeam() {
  const counts = Array(state.teamCount).fill(0);
  Object.values(state.assignments).forEach(index => { if (index < counts.length) counts[index]++; });
  return counts.indexOf(Math.min(...counts));
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

function scoreLayout(assignments, ids, teamCount) {
  const totals = Array(teamCount).fill(0), counts = Array(teamCount).fill(0);
  const styleCounts = Array.from({ length: teamCount }, () => ({ push: 0, hold: 0, mobile: 0 }));
  const styleTotals = { push: 0, hold: 0, mobile: 0 };
  for (const id of ids) {
    const team = assignments[id]; totals[team] += skill(id); counts[team]++;
    const style = styleFor(id);
    if (style) { styleCounts[team][style]++; styleTotals[style]++; }
  }
  const target = ids.reduce((sum, id) => sum + skill(id), 0) / ids.length;
  const skillPenalty = totals.reduce((sum, total, index) => sum + (total / counts[index] - target) ** 2, 0);
  const stylePenalty = styleCounts.reduce((sum, team, index) => {
    for (const style of Object.keys(STYLES)) {
      const expected = styleTotals[style] * counts[index] / ids.length;
      sum += (team[style] - expected) ** 2;
    }
    return sum;
  }, 0);
  return skillPenalty + stylePenalty * 0.65;
}

function balancedAssignments(ids, teamCount) {
  let best = null, bestScore = Infinity;
  for (let attempt = 0; attempt < 32; attempt++) {
    const assignments = {};
    shuffle(ids).forEach((id, index) => { assignments[id] = index % teamCount; });
    let current = scoreLayout(assignments, ids, teamCount);
    for (let pass = 0; pass < 12; pass++) {
      let improved = false;
      for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
        const first = ids[a], second = ids[b];
        if (assignments[first] === assignments[second]) continue;
        [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
        const next = scoreLayout(assignments, ids, teamCount);
        if (next + 1e-9 < current) { current = next; improved = true; }
        else [assignments[first], assignments[second]] = [assignments[second], assignments[first]];
      }
      if (!improved) break;
    }
    if (current < bestScore) { bestScore = current; best = assignments; }
  }
  return best;
}

function splitTeams() {
  if (state.selected.length < state.teamCount) { showToast(`Cần ít nhất ${state.teamCount} người cho ${state.teamCount} đội.`); return; }
  state.assignments = balancedAssignments(state.selected, state.teamCount);
  save(); render();
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderTeams() {
  const hasResult = state.selected.length > 0 && state.selected.every(id => Number.isInteger(state.assignments[id]));
  $('#results').hidden = !hasResult;
  if (!hasResult) return;
  const teams = Array.from({ length: state.teamCount }, () => []);
  for (const id of state.selected) {
    const member = findMember(id);
    if (member && state.assignments[id] < teams.length) teams[state.assignments[id]].push(member);
  }
  const container = $('#teams'); container.replaceChildren();
  container.classList.toggle('many', state.teamCount > 2);
  teams.forEach((people, index) => {
    const card = document.createElement('article'); card.className = 'team-card';
    const head = document.createElement('div'); head.className = 'team-head';
    const title = document.createElement('h3'); title.textContent = `Đội ${String(index + 1).padStart(2, '0')}`;
    const count = document.createElement('span'); count.textContent = `${people.length} NGƯỜI · TB ${(people.reduce((sum, person) => sum + skill(person.id), 0) / (people.length || 1)).toFixed(1)} SKILL`;
    head.append(title, count);
    const list = document.createElement('div'); list.className = 'team-list';
    if (!people.length) { const empty = document.createElement('p'); empty.className = 'team-empty'; empty.textContent = 'Chưa có thành viên.'; list.append(empty); }
    people.forEach(member => {
      const row = document.createElement('div'); row.className = 'team-person';
      row.append(makeAvatar(member, 'team-avatar'));
      const name = document.createElement('span'); name.className = 'team-person-name'; name.textContent = member.name; name.title = member.name; row.append(name);
      const style = document.createElement('span'); style.className = 'team-style'; style.textContent = styleFor(member.id) ? STYLES[styleFor(member.id)] : '—'; style.title = styleFor(member.id) ? 'Lối chơi' : 'Chưa chọn lối chơi'; row.append(style);
      const badge = document.createElement('span'); badge.className = 'team-skill'; badge.textContent = ratingFor(member.id) ? `★ ${ratingFor(member.id)}` : '★ —'; badge.title = ratingFor(member.id) ? 'Skill đã nhập' : 'Chưa đánh giá, tính tạm là 3'; row.append(badge);
      const select = document.createElement('select'); select.setAttribute('aria-label', `Đổi đội cho ${member.name}`);
      teams.forEach((_, teamIndex) => { const option = new Option(`Đội ${teamIndex + 1}`, String(teamIndex)); select.add(option); });
      select.value = String(index);
      select.disabled = !canEdit || !cloudReady;
      select.addEventListener('change', () => { state.assignments[member.id] = Number(select.value); save(); renderTeams(); });
      row.append(select); list.append(row);
    });
    card.append(head, list); container.append(card);
  });
  $('#result-summary').textContent = `${state.mode === 'cqb' ? 'CQB' : 'Sân ngoài trời'} · ${state.selected.length} người · ${state.teamCount} đội · ${state.selected.filter(id => ratingFor(id)).length} người đã có skill`;
}

function render() {
  document.querySelectorAll('.mode-button, .team-count, #select-all, #clear-all, #guest-name, #guest-form button, #reshuffle').forEach(control => { control.disabled = !canEdit || !cloudReady; });
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
  $('#split-button').disabled = !ready || !canEdit || !cloudReady;
  $('#setup-message').textContent = !cloudReady ? 'Đang tải dữ liệu chung…' : !canEdit ? 'Bạn đang xem đội hình chung. Đăng nhập tài khoản tổ chức để chỉnh sửa.' : ready ? `${state.selected.length} người sẽ được chia vào ${state.teamCount} đội.` : `Chọn ít nhất ${state.teamCount} người để tạo ${state.teamCount} đội.`;
  renderRoster(); renderTeams();
}

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

$('#search').addEventListener('input', event => { search = event.target.value; renderRoster(); });
$('#select-all').addEventListener('click', () => {
  const ids = allMembers().map(m => m.id);
  for (const id of ids) if (!state.selected.includes(id)) { state.selected.push(id); if (Object.keys(state.assignments).length) state.assignments[id] = smallestTeam(); }
  save(); render();
});
$('#clear-all').addEventListener('click', () => { state.selected = []; state.assignments = {}; save(); render(); });
$('#guest-form').addEventListener('submit', event => {
  event.preventDefault(); const input = $('#guest-name'); const name = input.value.trim();
  if (!name) return;
  const id = `guest-${crypto.randomUUID()}`;
  state.guests.push({ id, name }); state.selected.push(id);
  if (Object.keys(state.assignments).length) state.assignments[id] = smallestTeam();
  input.value = ''; save(); render(); showToast(`Đã thêm ${name}.`);
});
document.querySelectorAll('.team-count').forEach(button => button.addEventListener('click', () => {
  state.teamCount = Number(button.dataset.count); state.assignments = {}; save(); render();
}));
document.querySelectorAll('.mode-button').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.mode === state.mode) return;
  state.mode = button.dataset.mode; state.assignments = {}; save(); render();
}));
$('#split-button').addEventListener('click', splitTeams);
$('#reshuffle').addEventListener('click', splitTeams);
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
  if (!cloudAuth) return;
  try {
    if (canEdit) {
      await cloudSignOut(cloudAuth);
      showToast('Đã đăng xuất tài khoản tổ chức.');
    } else {
      if (cloudAuth.currentUser) await cloudSignOut(cloudAuth);
      await cloudSignIn(cloudAuth, cloudProvider);
      if (cloudAuth.currentUser?.uid !== organizerUid) showToast('Tài khoản này chỉ có quyền xem.');
    }
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') showToast(`Đăng nhập thất bại: ${error.message}`);
  }
});

render();
initCloud();
