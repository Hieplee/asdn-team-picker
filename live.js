// Bản đồ GPS trực tiếp: vào đội bằng mã/QR (đăng nhập ẩn danh), chia sẻ vị trí cho đội mình, điều khiển của organizer.
// Dữ liệu nằm trong match/current/* (xem firestore.rules), chỉ tồn tại trong lúc trận diễn ra.

const LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist/';
const QR_LIB = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SHARE_KEY = 'asdn-live-share';
const ASKED_KEY = 'asdn-live-asked';
const FS_OFF_KEY = 'asdn-live-fs-off';
const HINT_KEY = 'asdn-live-rotate-hint';

// Các khu vực chơi. Mỗi khu có 4 góc, thứ tự theo vòng quanh khu. Organizer chọn khu, cả trận dùng chung (config/map).
const MAPS = {
  nui: { label: 'Núi', corners: [
    { name: 'A', ll: [16.119303, 108.060201] },
    { name: 'B', ll: [16.119244, 108.061203] },
    { name: 'C', ll: [16.118512, 108.061179] },
    { name: 'D', ll: [16.118600, 108.060200] },
  ] },
  pho: { label: 'Phố', corners: [
    { name: 'A', ll: [16.029560, 108.219011] },
    { name: 'B', ll: [16.029717, 108.220572] },
    { name: 'C', ll: [16.028682, 108.220734] },
    { name: 'D', ll: [16.028483, 108.219264] },
  ] },
};
const DEFAULT_MAP = 'nui';
const GRID_CELL_M = 60;
const MIN_WRITE_GAP_MS = 5000; // ghi tối đa 1 lần / 5 giây
const MOVE_WRITE_M = 5; // hoặc khi di chuyển hơn 5 m
const HEARTBEAT_MS = 15000; // đứng yên vẫn báo còn sống mỗi 15 giây
const STALE_MS = 60000; // quá 60 giây: mờ
const GONE_MS = 300000; // quá 5 phút: ẩn

const $ = selector => document.querySelector(selector);

function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, value);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src; script.onload = resolve;
    script.onerror = () => reject(new Error('Không tải được thư viện bản đồ. Kiểm tra mạng rồi thử lại.'));
    document.head.append(script);
  });
}
let leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (!leafletPromise) {
    document.head.append(h('link', { rel: 'stylesheet', href: LEAFLET + 'leaflet.css' }));
    leafletPromise = loadScript(LEAFLET + 'leaflet.js').catch(error => { leafletPromise = null; throw error; });
  }
  return leafletPromise;
}
let qrPromise = null;
function loadQr() {
  if (window.qrcode) return Promise.resolve();
  if (!qrPromise) qrPromise = loadScript(QR_LIB).catch(error => { qrPromise = null; throw error; });
  return qrPromise;
}

function randomCode(team) {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return String(team + 1) + [...bytes].map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}
function teamOfCode(code) { return /^[1-6][A-Z0-9]{5}$/.test(code) ? Number(code[0]) - 1 : -1; }
function cleanCode(text) { return String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); }
function joinLink(code) { return `${location.origin}${location.pathname}?join=${code}`; }
function ago(ms) { const s = Math.max(0, Math.round(ms / 1000)); return s < 60 ? `${s} giây trước` : `${Math.round(s / 60)} phút trước`; }

export function initLive(ctx) {
  const { auth, db, fs, signInAnonymously, getState, findMember, makeAvatar, isOrganizer, toast, teamColors } = ctx;
  const { doc, collection, setDoc, deleteDoc, getDoc, getDocs, onSnapshot, writeBatch, serverTimestamp } = fs;
  const ref = (...path) => doc(db, 'match', 'current', ...path);
  const col = (...path) => collection(db, 'match', 'current', ...path);

  let user = null;
  let me = null; // { memberId, teamId } khi đã vào đội
  let meLoaded = false;
  let join = { step: 'code', code: '', team: -1, pick: null, busy: false, error: '' };
  const pending = { code: cleanCode(new URLSearchParams(location.search).get('join')) };
  let unsubMe = null, unsubTeam = [];
  let members = {}; // uid -> memberId (đội mình)
  let positions = {}; // uid -> { lat, lng, acc, heading, ts }
  let captain = null;
  let mapId = DEFAULT_MAP;
  let CORNERS = MAPS[DEFAULT_MAP].corners;
  let wantShare = false;
  let watchId = null, wakeLock = null, lastWrite = { at: 0, ll: null };
  let myPos = null;
  let sheetClose = null;
  let orders = {}; // id -> { type, pts (phẳng), by, mid, ts }
  let draw = null; // đang vẽ: { kind, pts: [[lat, lng]], layer }
  const orderLayers = new Map();

  // ---------- Bottom sheet ----------
  function openSheet(title, body, onClose) {
    closeSheet();
    const sheet = $('#live-sheet');
    $('#live-sheet-title').textContent = title;
    const content = $('#live-sheet-body');
    content.replaceChildren(body);
    sheet.hidden = false;
    sheetClose = onClose || null;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
  }
  function closeSheet() {
    const sheet = $('#live-sheet');
    if (sheet.hidden) return;
    sheet.classList.remove('open');
    const done = sheetClose; sheetClose = null;
    setTimeout(() => { if (!sheet.classList.contains('open')) sheet.hidden = true; }, 230);
    if (done) done();
  }
  $('#live-sheet').addEventListener('click', event => { if (event.target.hasAttribute('data-close')) closeSheet(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSheet(); });

  // ---------- Đăng nhập ẩn danh + membership ----------
  async function ensureUser() {
    if (auth.currentUser) return auth.currentUser;
    try { await signInAnonymously(auth); } catch (error) {
      throw new Error(error.code === 'auth/operation-not-allowed'
        ? 'Chưa bật đăng nhập ẩn danh trên Firebase (Authentication > Sign-in method > Anonymous).'
        : `Không đăng nhập được: ${error.message}`);
    }
    return auth.currentUser;
  }

  function stopTeamSubs() { unsubTeam.forEach(fn => fn()); unsubTeam = []; members = {}; positions = {}; orders = {}; captain = null; mapId = DEFAULT_MAP; CORNERS = MAPS[DEFAULT_MAP].corners; cancelDraw(); clearMarkers(); clearOrderLayers(); }
  function startTeamSubs(teamId) {
    stopTeamSubs();
    // Vừa bấm "Tôi là…" thì snapshot memberOf đến từ bộ nhớ máy, trước khi server nhận. Luồng đọc mở lúc đó bị rules từ chối
    // (chưa là thành viên) và sẽ chết im lặng. Nên mỗi luồng tự mở lại với độ trễ tăng dần.
    const listen = (target, onNext) => {
      let stop = null, dead = false;
      const open = attempt => {
        stop = onSnapshot(target, onNext, () => { if (!dead && attempt < 6) setTimeout(() => { if (!dead) open(attempt + 1); }, 800 * (attempt + 1)); });
      };
      open(0);
      return () => { dead = true; if (stop) stop(); };
    };
    unsubTeam.push(listen(col('members'), snap => {
      members = {};
      snap.forEach(d => { const data = d.data(); if (data.teamId === teamId) members[data.uid] = d.id; });
      drawPlayers(); renderHud();
    }));
    unsubTeam.push(listen(col('teams', teamId, 'positions'), snap => {
      positions = {};
      snap.forEach(d => { const data = d.data(); positions[d.id] = { lat: data.lat, lng: data.lng, acc: data.acc, heading: data.heading, ts: data.ts ? data.ts.toMillis() : Date.now() }; });
      drawPlayers(); renderHud();
    }));
    unsubTeam.push(listen(ref('teamMeta', teamId), snap => { captain = snap.exists() ? snap.data().captain : null; if (!isCaptainMe() && draw && draw.kind !== 'target') cancelDraw(); drawPlayers(); renderHud(); renderDraw(); }));
    unsubTeam.push(listen(col('teams', teamId, 'orders'), snap => {
      orders = {};
      snap.forEach(d => { const data = d.data(); const slot = /^t_.*_([0-2])$/.exec(d.id); orders[d.id] = { type: data.type, pts: Array.isArray(data.pts) ? data.pts : [], by: data.by, mid: data.mid, ts: data.ts ? data.ts.toMillis() : Date.now(), num: slot ? Number(slot[1]) + 1 : null }; });
      drawOrders(); renderDraw();
    }));
    unsubTeam.push(listen(ref('config', 'map'), snap => { applyMapId(snap.exists() ? snap.data().map : DEFAULT_MAP); }));
  }

  function watchMe(nextUser) {
    if (unsubMe) { unsubMe(); unsubMe = null; }
    me = null; meLoaded = !nextUser;
    stopTeamSubs(); stopSharing(false);
    if (!nextUser) { render(); return; }
    unsubMe = onSnapshot(ref('memberOf', nextUser.uid), snap => {
      const next = snap.exists() ? { memberId: snap.data().memberId, teamId: snap.data().teamId } : null;
      const changed = JSON.stringify(next) !== JSON.stringify(me);
      me = next; meLoaded = true;
      if (changed) {
        if (me) startTeamSubs(me.teamId);
        else { stopTeamSubs(); stopSharing(false); }
      }
      render();
    }, () => { me = null; meLoaded = true; render(); });
  }

  // ---------- Luồng vào đội ----------
  function lockedTeam(team) { const s = getState(); return team >= 0 && team < s.teamCount && s.lockedTeams.includes(team); }
  function teamPlayers(team) { const s = getState(); return s.selected.filter(id => s.assignments[id] === team); }

  async function submitCode(rawCode) {
    const code = cleanCode(rawCode);
    const team = teamOfCode(code);
    if (team < 0) { join.error = 'Mã gồm 6 ký tự, ví dụ 3K7QMA.'; return render(); }
    if (!lockedTeam(team)) { join.error = `Đội ${team + 1} chưa được chốt. Hỏi organizer.`; return render(); }
    join.busy = true; join.error = ''; render();
    try {
      await ensureUser();
      join = { ...join, step: 'pick', code, team, pick: null, busy: false };
      subscribeTaken();
    } catch (error) { join.busy = false; join.error = error.message; }
    render();
  }

  let unsubTaken = null, taken = new Set();
  function subscribeTaken() {
    if (unsubTaken) unsubTaken();
    unsubTaken = onSnapshot(col('members'), snap => { taken = new Set(snap.docs.map(d => d.id)); if (join.step === 'pick') render(); }, () => {});
  }

  async function confirmJoin() {
    if (join.busy || !join.pick) return;
    join.busy = true; join.error = ''; render();
    try {
      const current = await ensureUser();
      const batch = writeBatch(db);
      batch.set(ref('memberOf', current.uid), { memberId: join.pick, teamId: String(join.team), code: join.code });
      batch.set(ref('members', join.pick), { uid: current.uid, teamId: String(join.team) });
      await batch.commit();
      if (unsubTaken) { unsubTaken(); unsubTaken = null; }
      join = { step: 'code', code: '', team: -1, pick: null, busy: false, error: '' };
      try { localStorage.removeItem(SHARE_KEY); sessionStorage.removeItem(ASKED_KEY); } catch {}
      // onSnapshot(memberOf) sẽ chuyển sang bản đồ.
    } catch (error) {
      join.busy = false;
      join.error = error.code === 'permission-denied'
        ? 'Không vào được: mã đã đổi hoặc tên này vừa có người nhận. Chọn lại hoặc hỏi organizer.'
        : `Không vào được: ${error.message}`;
      if (error.code === 'permission-denied') join.pick = null;
      render();
    }
  }

  function renderJoin() {
    const box = $('#map-join'); box.replaceChildren();
    const colorOf = team => teamColors[team % teamColors.length];
    if (join.step === 'code') {
      const input = h('input', { class: 'join-code', type: 'text', inputmode: 'text', autocapitalize: 'characters', autocomplete: 'off', spellcheck: 'false', maxlength: '6', placeholder: 'MÃ ĐỘI', 'aria-label': 'Mã đội', value: join.code });
      input.addEventListener('input', () => { input.value = cleanCode(input.value); join.code = input.value; });
      input.addEventListener('keydown', event => { if (event.key === 'Enter') submitCode(input.value); });
      box.append(h('div', { class: 'join-card' },
        h('p', { class: 'eyebrow', text: 'BẢN ĐỒ TRẬN ĐẤU' }),
        h('h2', { text: 'Vào đội của bạn' }),
        h('p', { class: 'join-lead', text: 'Quét mã QR của organizer bằng camera điện thoại, hoặc nhập mã đội gồm 6 ký tự.' }),
        input,
        join.error && h('p', { class: 'join-error', role: 'alert', text: join.error }),
        h('button', { class: 'primary-button join-next', type: 'button', disabled: join.busy, onclick: () => submitCode(input.value) }, h('span', { text: join.busy ? 'ĐANG KIỂM TRA…' : 'TIẾP TỤC' }), h('span', { class: 'arrow', text: '→' })),
        h('p', { class: 'join-note', text: 'Chỉ đồng đội trong đội của bạn thấy vị trí của bạn. Bạn có thể tắt chia sẻ bất cứ lúc nào.' })));
      return;
    }
    // Chọn tên
    const ids = teamPlayers(join.team);
    const rows = ids.map(id => {
      const member = findMember(id); if (!member) return null;
      const isTaken = taken.has(id), selected = join.pick === id;
      return h('button', { class: 'pick-row' + (selected ? ' selected' : ''), type: 'button', disabled: isTaken || join.busy, 'aria-pressed': String(selected), onclick: () => { join.pick = id; join.error = ''; render(); } },
        makeAvatar(member, 'pick-avatar'),
        h('span', { class: 'pick-name', text: member.name }),
        h('span', { class: 'pick-state', text: isTaken ? 'Đã có người nhận' : selected ? '✓' : '' }));
    });
    const pickedName = join.pick ? findMember(join.pick)?.name : '';
    box.append(h('div', { class: 'join-card pick-card' },
      h('div', { class: 'pick-head' },
        h('button', { class: 'text-button', type: 'button', onclick: () => { join = { ...join, step: 'code', pick: null, error: '' }; render(); } }, '← Đổi mã'),
        h('span', { class: 'pick-team', style: `--c:${colorOf(join.team)}`, text: `ĐỘI ${join.team + 1}` })),
      h('h2', { text: 'Bạn là ai?' }),
      h('p', { class: 'join-lead', text: 'Chọn đúng tên của bạn. Mỗi tên chỉ một người nhận được.' }),
      h('div', { class: 'pick-list' }, rows.length ? rows : h('p', { class: 'join-lead', text: 'Đội này chưa có thành viên.' })),
      join.error && h('p', { class: 'join-error', role: 'alert', text: join.error })));
    box.append(h('div', { class: 'pick-bar' },
      h('button', { class: 'primary-button', type: 'button', disabled: !join.pick || join.busy, onclick: confirmJoin },
        h('span', { text: join.busy ? 'ĐANG VÀO ĐỘI…' : pickedName ? `TÔI LÀ ${pickedName.toUpperCase()}` : 'CHỌN TÊN CỦA BẠN' }), h('span', { class: 'arrow', text: '→' }))));
  }

  // ---------- Bản đồ ----------
  let map = null, esri, clarity, areaLayer, gridLayer, gridOn = false, gridGeo = null, lblLayers = null, boundsArea, satClarity = true;
  let mapBuilding = null;
  const markers = new Map();
  let meMarker = null, meCircle = null;

  async function ensureMap() {
    if (map) { map.invalidateSize(); return; }
    if (mapBuilding) return mapBuilding;
    mapBuilding = (async () => {
      try { await loadLeaflet(); } catch (error) { $('#map-canvas').replaceChildren(h('p', { class: 'map-fail', text: error.message })); mapBuilding = null; return; }
      const L = window.L;
      map = L.map('map-canvas', { zoomControl: false, maxZoom: 21, zoomSnap: 0.25, attributionControl: true });
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
      esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 18, maxZoom: 21, attribution: 'Esri, Maxar, Earthstar' });
      clarity = L.tileLayer('https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 19, maxZoom: 21, attribution: 'Esri, Maxar, Earthstar' });
      clarity.addTo(map);
      buildArea(L);
      map.on('zoomend', syncGridLabels);
      map.on('move zoom resize', syncEdges);
      map.on('click', event => addDrawPoint(event.latlng));
      drawPlayers(); drawMe(); drawOrders(); renderDraw();
    })();
    await mapBuilding; mapBuilding = null;
  }
  // Vẽ khu chơi hiện tại (viền, 4 góc, lưới). Gọi lại khi organizer đổi khu.
  function buildArea(L) {
    if (areaLayer) map.removeLayer(areaLayer);
    if (gridLayer) map.removeLayer(gridLayer);
    areaLayer = L.layerGroup().addTo(map);
    const poly = L.polygon(CORNERS.map(c => c.ll), { color: '#ffd23f', weight: 3, fillColor: '#ffd23f', fillOpacity: 0.08, dashArray: '8 6' }).addTo(areaLayer);
    CORNERS.forEach(c => {
      L.circleMarker(c.ll, { radius: 6, color: '#000', weight: 2, fillColor: '#ffd23f', fillOpacity: 1 }).addTo(areaLayer);
      L.marker(c.ll, { interactive: false, icon: L.divIcon({ className: 'corner', html: c.name, iconSize: [0, 0], iconAnchor: [-10, 22] }) }).addTo(areaLayer);
    });
    boundsArea = poly.getBounds();
    buildGrid(L);
    if (gridOn) gridLayer.addTo(map);
    fitArea(); syncGridLabels(); syncEdges();
  }
  function applyMapId(id) {
    if (!MAPS[id]) id = DEFAULT_MAP;
    if (id === mapId) return;
    mapId = id; CORNERS = MAPS[id].corners;
    if (map) { buildArea(window.L); toast(`Organizer đã chọn khu: ${MAPS[id].label}.`); }
    if (orgOpen()) renderOrganizer();
    renderHud();
  }
  const orgOpen = () => !$('#live-sheet').hidden && $('#live-sheet-title').textContent === 'Điều khiển trận';
  function fitArea() { if (map) map.fitBounds(boundsArea, { paddingTopLeft: [16, 70], paddingBottomRight: [64, 96] }); }

  // Lưới kiểu Squad: ô lớn A1, B2…, chia 3x3 theo bàn phím số (7 8 9 / 4 5 6 / 1 2 3) thành cấp 2, rồi 3x3 nữa thành cấp 3.
  function buildGrid(L) {
    gridLayer = L.layerGroup(); lblLayers = { 1: [], 2: [], 3: [], 4: [] };
    const keypad = (r, c) => 7 - 3 * r + c;
    const sw = boundsArea.getSouthWest(), ne = boundsArea.getNorthEast();
    const mLat = 111320, mLng = 111320 * Math.cos(sw.lat * Math.PI / 180);
    const dLat = GRID_CELL_M / mLat, dLng = GRID_CELL_M / mLng;
    const cols = Math.ceil((ne.lng - sw.lng) / dLng), rows = Math.ceil((ne.lat - sw.lat) / dLat);
    const north = sw.lat + rows * dLat;
    gridGeo = { sw, north, dLat, dLng, cols, rows };
    const style = lvl => lvl === 1 ? { color: '#fff', weight: 2, opacity: .85 } : lvl === 2 ? { color: '#fff', weight: 1, opacity: .55 } : { color: '#fff', weight: 1, opacity: .3, dashArray: '2 4' };
    const line = (a, b, st) => L.polyline([a, b], { ...st, interactive: false }).addTo(gridLayer);
    const lbl = (ll, text, lvl) => lblLayers[lvl].push(L.marker(ll, { interactive: false, icon: L.divIcon({ className: 'gridlbl lv' + lvl, html: text, iconSize: [0, 0] }) }));
    const n3 = cols * 9, r3 = rows * 9, d3Lng = dLng / 9, d3Lat = dLat / 9;
    for (let i = 0; i <= n3; i++) line([sw.lat, sw.lng + i * d3Lng], [north, sw.lng + i * d3Lng], style(i % 9 === 0 ? 1 : i % 3 === 0 ? 2 : 3));
    for (let j = 0; j <= r3; j++) line([north - j * d3Lat, sw.lng], [north - j * d3Lat, sw.lng + cols * dLng], style(j % 9 === 0 ? 1 : j % 3 === 0 ? 2 : 3));
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      for (let kr = 0; kr < 3; kr++) for (let kc = 0; kc < 3; kc++) {
        lbl([north - r * dLat - (kr + 0.5) * dLat / 3, sw.lng + c * dLng + (kc + 0.5) * dLng / 3], keypad(kr, kc), 2);
        lbl([north - r * dLat - kr * dLat / 3 - dLat / 200, sw.lng + c * dLng + kc * dLng / 3 + dLng / 200], keypad(kr, kc), 4);
        for (let sr = 0; sr < 3; sr++) for (let sc = 0; sc < 3; sc++) {
          lbl([north - r * dLat - kr * dLat / 3 - (sr + 0.5) * dLat / 9, sw.lng + c * dLng + kc * dLng / 3 + (sc + 0.5) * dLng / 9], keypad(sr, sc), 3);
        }
      }
    }
  }
  const LV_ZOOM = { 1: 99, 2: 18.5, 3: 20.25, 4: 20.25 };
  function syncGridLabels() {
    if (!map || !lblLayers) return;
    const z = map.getZoom();
    [1, 2, 3, 4].forEach(l => lblLayers[l].forEach(m => {
      const visible = gridOn && z >= LV_ZOOM[l] && !(l === 2 && z >= LV_ZOOM[3]);
      visible ? gridLayer.addLayer(m) : gridLayer.removeLayer(m);
    }));
  }
  // Nhãn ô lớn (chữ ở viền trên, số ở viền trái) bám theo khi kéo/zoom.
  function syncEdges() {
    const top = $('#edge-top'), left = $('#edge-left');
    if (!top) return;
    top.hidden = left.hidden = !gridOn;
    if (!gridOn || !gridGeo || !map) return;
    const g = gridGeo, size = map.getSize(), clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const origin = map.latLngToContainerPoint([g.north, g.sw.lng]);
    const ty = clamp(origin.y - 14, 12, size.y - 12), lx = clamp(origin.x - 16, 16, size.x - 16);
    const topKids = [], leftKids = [];
    for (let c = 0; c < g.cols; c++) {
      const x1 = map.latLngToContainerPoint([g.sw.lat, g.sw.lng + c * g.dLng]).x, x2 = map.latLngToContainerPoint([g.sw.lat, g.sw.lng + (c + 1) * g.dLng]).x;
      const a = Math.max(x1, 0), b = Math.min(x2, size.x);
      if (b - a > 20) topKids.push(h('span', { style: `left:${(a + b) / 2}px;top:${ty}px`, text: String.fromCharCode(65 + c) }));
    }
    for (let r = 0; r < g.rows; r++) {
      const y1 = map.latLngToContainerPoint([g.north - r * g.dLat, g.sw.lng]).y, y2 = map.latLngToContainerPoint([g.north - (r + 1) * g.dLat, g.sw.lng]).y;
      const a = Math.max(y1, 0), b = Math.min(y2, size.y);
      if (b - a > 20) leftKids.push(h('span', { style: `top:${(a + b) / 2}px;left:${lx}px`, text: String(r + 1) }));
    }
    top.replaceChildren(...topKids); left.replaceChildren(...leftKids);
  }
  function toggleGrid() {
    if (!map) return;
    gridOn = !gridOn;
    gridOn ? gridLayer.addTo(map) : map.removeLayer(gridLayer);
    $('#btn-grid').setAttribute('aria-pressed', String(gridOn));
    syncGridLabels(); syncEdges();
  }
  // Android Chrome: vào toàn màn hình rồi khóa ngang. iPhone không cho web khóa xoay: chỉ gợi ý xoay tay (giao diện tự thích ứng).
  async function toggleFullscreen(auto = false) {
    const el = $('#map-section');
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} return; }
    try {
      try { sessionStorage.removeItem(FS_OFF_KEY); } catch {}
      await el.requestFullscreen({ navigationUI: 'hide' });
      try { await screen.orientation.lock('landscape'); } catch { if (!auto) toast('Máy chưa tự xoay ngang được. Hãy xoay điện thoại.'); }
    } catch { if (!auto) toast('Không vào được toàn màn hình. Hãy xoay ngang điện thoại.'); }
  }
  document.addEventListener('fullscreenchange', () => {
    const on = Boolean(document.fullscreenElement);
    $('#btn-full').setAttribute('aria-pressed', String(on));
    // Sheet và toast phải nằm trong phần tử đang toàn màn hình thì mới hiện được; không thoát toàn màn hình (thoát là máy xoay lại dọc).
    const host = on ? $('#map-section') : document.body;
    host.append($('#toast'), $('#live-sheet'));
    if (!on) { try { screen.orientation.unlock(); } catch {} try { sessionStorage.setItem(FS_OFF_KEY, '1'); } catch {} }
    if (map) setTimeout(() => { map.invalidateSize(); syncEdges(); }, 150);
  });
  function toggleSatellite() {
    if (!map) return;
    satClarity = !satClarity;
    if (satClarity) { map.removeLayer(esri); clarity.addTo(map); } else { map.removeLayer(clarity); esri.addTo(map); }
    toast(satClarity ? 'Nền vệ tinh: Clarity' : 'Nền vệ tinh: Esri chuẩn');
  }

  // ---------- Marker đồng đội ----------
  function teamColor() { return me ? teamColors[Number(me.teamId) % teamColors.length] : '#c8f36b'; }
  function nameOfUid(uid) { const id = members[uid]; return (id && findMember(id)?.name) || 'Đồng đội'; }
  function clearMarkers() { markers.forEach(m => m.remove()); markers.clear(); }
  function playerIcon(uid, stale) {
    const color = teamColor(), isCaptain = members[uid] && members[uid] === captain;
    const el = h('div', { class: 'pl' + (stale ? ' stale' : ''), style: `--c:${color}` }, h('i', { style: `background:${color}` }), h('b', { text: (isCaptain ? '★ ' : '') + nameOfUid(uid) }));
    return window.L.divIcon({ className: '', iconSize: [0, 0], html: el });
  }
  function drawPlayers() {
    if (!map) return;
    const now = Date.now(), myUid = user && user.uid, seen = new Set();
    for (const [uid, p] of Object.entries(positions)) {
      if (uid === myUid) continue;
      const age = now - p.ts;
      if (age > GONE_MS || !Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;
      seen.add(uid);
      const stale = age > STALE_MS;
      let marker = markers.get(uid);
      if (!marker) { marker = window.L.marker([p.lat, p.lng], { interactive: false, keyboard: false, icon: playerIcon(uid, stale) }).addTo(map); markers.set(uid, marker); }
      else { marker.setLatLng([p.lat, p.lng]); marker.setIcon(playerIcon(uid, stale)); }
    }
    for (const [uid, marker] of markers) if (!seen.has(uid)) { marker.remove(); markers.delete(uid); }
  }
  setInterval(drawPlayers, 5000);
  setInterval(renderHud, 5000);

  function drawMe() {
    if (!map || !myPos) return;
    const L = window.L, ll = [myPos.lat, myPos.lng];
    if (!meMarker) {
      meMarker = L.marker(ll, { interactive: false, keyboard: false, zIndexOffset: 1000, icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
      meCircle = L.circle(ll, { radius: myPos.acc, color: '#2f8cff', weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
    } else { meMarker.setLatLng(ll); meCircle.setLatLng(ll).setRadius(myPos.acc); }
  }
  function clearMe() { if (meMarker) { meMarker.remove(); meMarker = null; } if (meCircle) { meCircle.remove(); meCircle = null; } myPos = null; }

  // ---------- Chia sẻ vị trí ----------
  const myPositionRef = () => ref('teams', me.teamId, 'positions', user.uid);
  function distanceM(a, b) {
    const R = 6371000, rad = Math.PI / 180, dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function inArea(ll) {
    const ring = CORNERS.map(c => c.ll); let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [yi, xi] = ring[i], [yj, xj] = ring[j];
      if ((xi > ll[1]) !== (xj > ll[1]) && ll[0] < (yj - yi) * (ll[1] - xi) / (xj - xi) + yi) inside = !inside;
    }
    return inside;
  }
  function onPosition(position) {
    const c = position.coords;
    myPos = { lat: c.latitude, lng: c.longitude, acc: c.accuracy || 0, heading: Number.isFinite(c.heading) ? c.heading : null };
    drawMe(); renderHud();
    maybeWrite();
  }
  function maybeWrite() {
    if (!me || !user || !myPos) return;
    const now = Date.now(), ll = [myPos.lat, myPos.lng];
    const gap = now - lastWrite.at, moved = lastWrite.ll ? distanceM(lastWrite.ll, ll) : Infinity;
    if (gap < MIN_WRITE_GAP_MS || (gap < HEARTBEAT_MS && moved < MOVE_WRITE_M)) return;
    lastWrite = { at: now, ll };
    setDoc(myPositionRef(), { lat: myPos.lat, lng: myPos.lng, acc: Math.round(myPos.acc), heading: myPos.heading, ts: serverTimestamp() }).catch(error => {
      if (error.code === 'permission-denied') { lastWrite.at = 0; }
    });
  }
  function onPositionError(error) {
    if (error.code === 1) { stopSharing(true); toast('Bạn đã từ chối quyền vị trí. Bật lại trong cài đặt trình duyệt rồi thử lại.'); }
    else if (error.code === 2) toast('Chưa lấy được tín hiệu GPS. Ra chỗ thoáng hơn.');
  }
  async function acquireWakeLock() {
    try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch { wakeLock = null; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wantShare) acquireWakeLock(); });

  function startSharing() {
    if (!navigator.geolocation) { toast('Trình duyệt này không hỗ trợ định vị.'); return; }
    wantShare = true;
    try { localStorage.setItem(SHARE_KEY, '1'); } catch {}
    syncSharing(); renderHud();
  }
  function syncSharing() {
    if (wantShare && watchId === null && me) {
      watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 });
      acquireWakeLock();
    }
  }
  function stopSharing(remember) {
    wantShare = false;
    if (remember) { try { localStorage.setItem(SHARE_KEY, '0'); } catch {} }
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
    if (me && user) deleteDoc(myPositionRef()).catch(() => {});
    lastWrite = { at: 0, ll: null };
    clearMe(); renderHud();
  }
  addEventListener('pagehide', () => { if (wantShare && me && user) deleteDoc(myPositionRef()).catch(() => {}); });

  function askShare() {
    const body = h('div', { class: 'ask-share' },
      h('p', { text: 'Vị trí của bạn chỉ hiện cho đồng đội trong đội của bạn, và chỉ khi organizer bật chia sẻ cho trận.' }),
      h('ul', {}, h('li', { text: 'Tắt chia sẻ bất cứ lúc nào bằng nút ở dưới bản đồ.' }), h('li', { text: 'Dữ liệu vị trí được xóa khi trận kết thúc.' }), h('li', { text: 'iPhone chỉ cập nhật khi app đang mở và màn hình sáng. App sẽ giữ màn hình luôn sáng.' })),
      h('div', { class: 'sheet-actions' },
        h('button', { class: 'primary-button', type: 'button', onclick: () => { closeSheet(); startSharing(); } }, h('span', { text: 'CHIA SẺ VỊ TRÍ' }), h('span', { class: 'arrow', text: '→' })),
        h('button', { class: 'secondary-button', type: 'button', onclick: () => { closeSheet(); try { localStorage.setItem(SHARE_KEY, '0'); } catch {} } }, 'CHỈ XEM BẢN ĐỒ')));
    openSheet('Chia sẻ vị trí?', body);
  }

  // ---------- HUD & thanh điều khiển ----------
  function myName() { return me ? findMember(me.memberId)?.name || '' : ''; }
  function renderHud() {
    const hud = $('#map-hud'); if (!hud || !me) return;
    const now = Date.now();
    const active = Object.entries(positions).filter(([uid, p]) => uid !== (user && user.uid) && now - p.ts <= STALE_MS).length + (wantShare && myPos ? 1 : 0);
    const total = teamPlayers(Number(me.teamId)).length;
    const state = wantShare ? 'live' : 'view';
    const label = state === 'live' ? 'ĐANG CHIA SẺ' : state === 'view' ? 'ĐANG XEM' : 'CHƯA BẬT';
    const hudSig = [me.teamId, active, total, myName(), state, teamColor(), mapId].join('|');
    if (hud.dataset.sig !== hudSig) {
    hud.dataset.sig = hudSig;
    hud.replaceChildren(
      h('button', { class: 'hud-chip', type: 'button', onclick: openTeamSheet, 'aria-label': 'Xem danh sách đội' },
        h('i', { class: 'team-dot', style: `background:${teamColor()}` }),
        h('span', { class: 'hud-main' }, h('b', { text: `Đội ${Number(me.teamId) + 1}` }), h('small', { text: `${active}/${total} đang hiện · ${myName()} · ${MAPS[mapId].label}` })),
        h('em', { class: 'hud-state ' + state, text: label })));
    }
    renderDraw();
    const share = $('#btn-share');
    share.className = 'share-button' + (wantShare ? ' on' : '');
    let text = wantShare ? 'ĐANG CHIA SẺ · BẤM ĐỂ TẮT' : 'BẬT CHIA SẺ VỊ TRÍ';
    let sub = '';
    if (wantShare && myPos) sub = `Sai số ~${Math.round(myPos.acc)} m · ${inArea([myPos.lat, myPos.lng]) ? 'trong khu' : 'ngoài khu'}`;
    else if (wantShare) sub = 'Đang lấy tín hiệu GPS…';
    const shareSig = text + '|' + sub;
    if (share.dataset.sig !== shareSig) { share.dataset.sig = shareSig; share.replaceChildren(h('span', { class: 'share-main', text }), sub && h('small', { text: sub })); }
  }
  function openTeamSheet() {
    if (!me) return;
    const team = Number(me.teamId), now = Date.now(), myUid = user.uid;
    const byMember = {}; for (const [uid, id] of Object.entries(members)) byMember[id] = uid;
    const rows = teamPlayers(team).map(id => {
      const member = findMember(id), uid = byMember[id];
      const p = uid === myUid ? (myPos && { ...myPos, ts: now }) : positions[uid];
      const status = !uid ? 'Chưa vào đội' : !p || now - p.ts > GONE_MS ? 'Chưa chia sẻ' : now - p.ts > STALE_MS ? `Mất tín hiệu ${ago(now - p.ts)}` : uid === myUid ? 'Bạn' : 'Đang hiện';
      const can = p && Number.isFinite(p.lat) && now - p.ts <= GONE_MS;
      return h('button', { class: 'team-row', type: 'button', disabled: !can, onclick: () => { closeSheet(); if (map) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 19)); } },
        makeAvatar(member, 'pick-avatar'),
        h('span', { class: 'pick-name' }, h('i', { class: 'color-dot', style: `background:${memberColor(id)}` }), (id === captain ? '★ ' : '') + member.name, h('small', { text: status })),
        h('span', { class: 'pick-state', text: can ? 'Đi tới ›' : '' }));
    });
    openSheet(`Đội ${team + 1}`, h('div', { class: 'pick-list' }, rows));
  }

  // ---------- Lệnh trên bản đồ: mục tiêu / mũi tên / vùng ----------
  // Thao tác chạm: chạm nút công cụ, rồi chạm lên bản đồ để đặt điểm (không cần kéo, vì kéo là di chuyển bản đồ).
  // Mục tiêu đặt một chạm. Mũi tên (>=2 điểm) và vùng (>=3 điểm) chạm nhiều điểm rồi bấm Xong.
  const NEED = { target: 1, arrow: 2, zone: 3 };
  const KIND_NAME = { target: 'Mục tiêu', arrow: 'Mũi tên', zone: 'Vùng' };
  const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms || 10); } catch {} };
  const isCaptainMe = () => Boolean(me && captain && captain === me.memberId);
  function flatToLatLngs(flat) {
    const out = [];
    for (let i = 0; i + 1 < flat.length; i += 2) if (Number.isFinite(flat[i]) && Number.isFinite(flat[i + 1])) out.push([flat[i], flat[i + 1]]);
    return out;
  }
  function bearing(a, b) {
    const rad = Math.PI / 180, dLng = (b[1] - a[1]) * rad;
    const y = Math.sin(dLng) * Math.cos(b[0] * rad), x = Math.cos(a[0] * rad) * Math.sin(b[0] * rad) - Math.sin(a[0] * rad) * Math.cos(b[0] * rad) * Math.cos(dLng);
    return (Math.atan2(y, x) / rad + 360) % 360;
  }
  // Mỗi người một màu để nhìn là biết ai đặt mà không cần ghi tên. Màu theo thứ tự id trong đội nên mọi máy thấy giống nhau.
  const MEMBER_COLORS = ['#ff4d4d', '#ffb020', '#ffe14d', '#4dff88', '#2ee6d6', '#4da3ff', '#b07bff', '#ff6bd6', '#ffffff', '#9aa5b1'];
  function memberColor(mid) {
    if (!me) return MEMBER_COLORS[0];
    const roster = [...teamPlayers(Number(me.teamId))].sort(), index = roster.indexOf(mid);
    if (index >= 0) return MEMBER_COLORS[index % MEMBER_COLORS.length];
    let hash = 0; for (const ch of String(mid)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return MEMBER_COLORS[hash % MEMBER_COLORS.length];
  }
  function orderLabel(order) { return order.type === 'target' && order.num ? `Mục tiêu ${order.num}` : (KIND_NAME[order.type] || 'Lệnh'); }
  function authorName(order) { return findMember(order.mid)?.name || 'Đồng đội'; }
  function canDeleteOrder(order) { return Boolean(user && (order.by === user.uid || isCaptainMe())); }
  function targetIcon(order) {
    const el = h('div', { class: 'tgt-pin', style: `--c:${memberColor(order.mid)}` }, h('span', { class: 'tgt-mark', text: '⌖' }), order.num && h('b', { class: 'tgt-num', text: String(order.num) }));
    return window.L.divIcon({ className: '', iconSize: [44, 44], iconAnchor: [22, 22], html: el });
  }
  function clearOrderLayers() { orderLayers.forEach(entry => entry.group.remove()); orderLayers.clear(); }
  function drawOrders() {
    if (!map || !window.L) return;
    const L = window.L, color = teamColor(), seen = new Set();
    for (const [id, order] of Object.entries(orders)) {
      seen.add(id);
      const sig = JSON.stringify([order.type, order.pts, order.mid, color, memberColor(order.mid), order.num]);
      const existing = orderLayers.get(id);
      if (existing && existing.sig === sig) continue;
      if (existing) existing.group.remove();
      const ll = flatToLatLngs(order.pts), group = L.layerGroup();
      const open = () => { if (!draw) openOrderSheet(id); }; // đang vẽ thì chạm vào lệnh cũ chỉ là thêm điểm
      if (order.type === 'target' && ll.length >= 1) {
        group.addLayer(L.marker(ll[0], { icon: targetIcon(order), keyboard: false, zIndexOffset: 500 }).on('click', open));
      } else if (order.type === 'arrow' && ll.length >= 2) {
        const end = ll[ll.length - 1], head = h('div', { class: 'ah', style: `transform:rotate(${bearing(ll[ll.length - 2], end)}deg)` });
        group.addLayer(L.polyline(ll, { color: '#000', weight: 6, opacity: .65, lineCap: 'round', lineJoin: 'round', interactive: false }));
        group.addLayer(L.polyline(ll, { color: '#fff', weight: 2.5, opacity: 1, lineCap: 'round', lineJoin: 'round', interactive: false }));
        group.addLayer(L.marker(end, { interactive: false, keyboard: false, icon: L.divIcon({ className: '', iconSize: [0, 0], html: head }) }));
        group.addLayer(L.polyline(ll, { color: '#000', weight: 36, opacity: 0 }).on('click', open)); // vùng chạm rộng cho ngón tay
      } else if (order.type === 'zone' && ll.length >= 3) {
        group.addLayer(L.polygon(ll, { color, weight: 2, fillColor: color, fillOpacity: .14, dashArray: '7 5', interactive: false }));
        group.addLayer(L.polyline([...ll, ll[0]], { color: '#000', weight: 36, opacity: 0 }).on('click', open)); // chỉ viền bấm được, chạm trong vùng vẫn là kéo bản đồ
      } else { orderLayers.delete(id); continue; }
      group.addTo(map); orderLayers.set(id, { group, sig });
    }
    for (const [id, entry] of orderLayers) if (!seen.has(id)) { entry.group.remove(); orderLayers.delete(id); }
  }

  function startDraw(kind) {
    if (!me || !map) return;
    if (kind !== 'target' && !isCaptainMe()) { toast('Chỉ đội trưởng vẽ được mũi tên và vùng.'); return; }
    cancelDraw();
    draw = { kind, pts: [], layer: window.L.layerGroup().addTo(map) };
    map.doubleClickZoom.disable(); // chạm nhanh liên tiếp không bị phóng to nhầm
    $('#map-canvas').classList.add('drawing'); $('#map-view').classList.add('drawing');
    buzz(8); renderDraw();
  }
  function cancelDraw() {
    if (!draw) return;
    draw.layer.remove(); draw = null;
    if (map) map.doubleClickZoom.enable();
    $('#map-canvas').classList.remove('drawing'); $('#map-view').classList.remove('drawing');
    renderDraw();
  }
  function drawPreview() {
    const L = window.L, color = teamColor(), pts = draw.pts;
    draw.layer.clearLayers();
    if (pts.length >= 2) draw.layer.addLayer(draw.kind === 'zone' && pts.length >= 3
      ? L.polygon(pts, { color, weight: 2, fillColor: color, fillOpacity: .12, dashArray: '6 6', interactive: false })
      : L.polyline(pts, { color: draw.kind === 'arrow' ? '#fff' : color, weight: 2.5, dashArray: '6 6', interactive: false }));
    pts.forEach((point, i) => draw.layer.addLayer(L.circleMarker(point, { radius: i === pts.length - 1 ? 10 : 7, color: '#000', weight: 2, fillColor: i === 0 ? '#ffd23f' : '#fff', fillOpacity: 1, interactive: false })));
  }
  function addDrawPoint(latlng) {
    if (!draw) return;
    draw.pts.push([latlng.lat, latlng.lng]); buzz(8);
    if (draw.kind === 'target') { finishDraw(); return; }
    drawPreview(); renderDraw();
  }
  function undoDrawPoint() { if (!draw || !draw.pts.length) return; draw.pts.pop(); drawPreview(); renderDraw(); }
  function pickSlot(kind) {
    const slots = kind === 'target' ? [0, 1, 2].map(n => `t_${user.uid}_${n}`) : Array.from({ length: 10 }, (_, n) => `${kind === 'arrow' ? 'a' : 'z'}_${n}`);
    const free = slots.find(id => !orders[id]);
    return free || [...slots].sort((x, y) => orders[x].ts - orders[y].ts)[0]; // hết chỗ thì thay lệnh cũ nhất
  }
  async function finishDraw() {
    if (!draw || draw.pts.length < NEED[draw.kind] || !me || !user) return;
    const { kind, pts } = draw, id = pickSlot(kind);
    cancelDraw();
    try { await setDoc(ref('teams', me.teamId, 'orders', id), { type: kind, pts: pts.flat(), by: user.uid, mid: me.memberId, ts: serverTimestamp() }); }
    catch (error) {
      console.error('order write failed', id, error);
      notice(`Không lưu được ${KIND_NAME[kind].toLowerCase()}: ${error.code === 'permission-denied' ? 'không có quyền (bạn đã vào đội chưa?)' : error.message}`);
    }
  }
  let noticeTimer = null;
  function notice(text) {
    const hint = $('#map-hint'); if (!hint) { toast(text); return; }
    hint.hidden = false; hint.textContent = text; hint.classList.add('error');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { hint.classList.remove('error'); const bar = $('#draw-bar'); if (bar) delete bar.dataset.sig; renderDraw(); }, 7000);
  }
  async function removeOrder(id) {
    try { await deleteDoc(ref('teams', me.teamId, 'orders', id)); } catch (error) { toast(`Không xóa được: ${error.message}`); }
  }
  function focusOrder(order) {
    const ll = flatToLatLngs(order.pts); if (!ll.length || !map) return;
    if (ll.length === 1) map.flyTo(ll[0], Math.max(map.getZoom(), 19)); else map.fitBounds(window.L.latLngBounds(ll), { padding: [60, 60], maxZoom: 20 });
  }
  function orderRows(close) {
    const entries = Object.entries(orders).sort((x, y) => y[1].ts - x[1].ts), now = Date.now();
    if (!entries.length) return [h('p', { class: 'join-lead', text: isCaptainMe() ? 'Chưa có lệnh nào. Dùng Mục tiêu, Mũi tên, Vùng ở thanh dưới bản đồ.' : 'Chưa có lệnh nào. Bấm Mục tiêu để đánh dấu cho cả đội.' })];
    return entries.map(([id, order]) => h('div', { class: 'order-row' },
      h('button', { class: 'order-main', type: 'button', onclick: () => { close(); focusOrder(order); } },
        h('span', { class: 'order-icon ' + order.type, style: order.type === 'target' ? `color:${memberColor(order.mid)}` : '', text: order.type === 'target' ? '⌖' : order.type === 'arrow' ? '➚' : '⬠' }),
        h('span', { class: 'pick-name' }, `${orderLabel(order)} · ${authorName(order)}`, h('small', { text: ago(now - order.ts) }))),
      canDeleteOrder(order) && h('button', { class: 'icon-button', type: 'button', 'aria-label': 'Xóa lệnh này', onclick: () => { removeOrder(id); close(); } }, '✕')));
  }
  function openOrderSheet(id) {
    const order = orders[id]; if (!order) return;
    const body = h('div', { class: 'sheet-actions' },
      h('p', { class: 'join-lead', text: `${authorName(order)} · ${ago(Date.now() - order.ts)}` }),
      h('button', { class: 'secondary-button', type: 'button', onclick: () => { closeSheet(); focusOrder(order); } }, 'ĐI TỚI'),
      canDeleteOrder(order) && h('button', { class: 'danger-button', type: 'button', onclick: () => { closeSheet(); removeOrder(id); } }, 'XÓA'),
      h('button', { class: 'secondary-button', type: 'button', onclick: closeSheet }, 'ĐÓNG'));
    openSheet(orderLabel(order), body);
  }
  function openOrdersList() {
    let confirmAll = false;
    const body = h('div', { class: 'live-sheet-stack' });
    const paint = () => {
      const rows = orderRows(closeSheet);
      body.replaceChildren(h('div', { class: 'pick-list' }, rows),
        isCaptainMe() && Object.keys(orders).length > 0 && h('button', { class: 'danger-button', type: 'button', onclick: async () => {
          if (!confirmAll) { confirmAll = true; paint(); return; }
          closeSheet();
          try { const batch = writeBatch(db); Object.keys(orders).forEach(id => batch.delete(ref('teams', me.teamId, 'orders', id))); await batch.commit(); toast('Đã xóa hết lệnh của đội.'); }
          catch (error) { toast(`Không xóa được: ${error.message}`); }
        } }, confirmAll ? 'BẤM LẠI ĐỂ XÁC NHẬN XÓA HẾT' : 'XÓA TẤT CẢ LỆNH'));
    };
    paint();
    openSheet('Lệnh của đội', body);
  }

  // Thanh công cụ ở đáy (vùng ngón cái). Chỉ dựng lại khi nội dung đổi để không làm mất cú chạm đang diễn ra.
  function toolButton(icon, label, onclick, extra = {}) {
    return h('button', { class: 'draw-btn' + (extra.class ? ' ' + extra.class : ''), type: 'button', disabled: extra.disabled, onclick, 'aria-label': extra.aria || label },
      h('span', { class: 'draw-icon', text: icon }), h('span', { text: label }));
  }
  function renderDraw() {
    const bar = $('#draw-bar'), hint = $('#map-hint'); if (!bar || !hint) return;
    const count = Object.keys(orders).length;
    const sig = draw ? `d|${draw.kind}|${draw.pts.length}` : `i|${isCaptainMe()}|${count}`;
    if (bar.dataset.sig === sig) return;
    bar.dataset.sig = sig;
    if (draw) {
      const n = draw.pts.length, need = NEED[draw.kind];
      hint.hidden = false;
      hint.textContent = draw.kind === 'target' ? 'Chạm lên bản đồ để đánh dấu mục tiêu'
        : n < need ? `${KIND_NAME[draw.kind]}: chạm ${need - n} điểm nữa (đã ${n})` : `${KIND_NAME[draw.kind]}: đã ${n} điểm. Chạm thêm hoặc bấm Xong`;
      bar.replaceChildren(...[
        toolButton('✕', 'Hủy', cancelDraw, { class: 'cancel' }),
        draw.kind !== 'target' && toolButton('↶', 'Lùi 1 điểm', undoDrawPoint, { disabled: n === 0 }),
        draw.kind !== 'target' && toolButton('✓', `Xong (${n})`, finishDraw, { class: 'done', disabled: n < need, aria: 'Xong, lưu lệnh' })].filter(Boolean));
    } else {
      hint.hidden = true;
      bar.replaceChildren(...[
        toolButton('⌖', 'Mục tiêu', () => startDraw('target')),
        isCaptainMe() && toolButton('➚', 'Mũi tên', () => startDraw('arrow')),
        isCaptainMe() && toolButton('⬠', 'Vùng', () => startDraw('zone')),
        toolButton('☰', count ? `Lệnh (${count})` : 'Lệnh', openOrdersList)].filter(Boolean));
    }
  }

  // ---------- Organizer ----------
  let codes = {};
  async function loadCodes() {
    const s = getState(); codes = {};
    for (let team = 0; team < s.teamCount; team++) {
      if (!lockedTeam(team)) continue;
      try {
        const snap = await getDoc(ref('teamKeys', String(team)));
        if (snap.exists()) codes[team] = snap.data().code;
        else { const code = randomCode(team); await setDoc(ref('teamKeys', String(team)), { code, at: serverTimestamp() }); codes[team] = code; }
      } catch (error) { toast(`Không tạo được mã đội ${team + 1}: ${error.message}`); }
    }
  }
  async function newCode(team) {
    const code = randomCode(team);
    try { await setDoc(ref('teamKeys', String(team)), { code, at: serverTimestamp() }); codes[team] = code; toast(`Đã đổi mã Đội ${team + 1}. Mã cũ không dùng được nữa.`); renderOrganizer(); }
    catch (error) { toast(`Không đổi được mã: ${error.message}`); }
  }
  let orgUnsubs = [], orgMembers = {}, orgCaptains = {}, orgFocus = null, qrOpen = new Set(), confirmEnd = false;

  async function openOrganizer(focusTeam = null) {
    if (!isOrganizer()) return;
    orgFocus = focusTeam; confirmEnd = false; qrOpen = new Set(focusTeam == null ? [] : [focusTeam]);
    openSheet('Điều khiển trận', h('p', { class: 'join-lead', text: 'Đang tải…' }), () => { orgUnsubs.forEach(fn => fn()); orgUnsubs = []; });
    orgUnsubs.push(onSnapshot(col('members'), snap => { orgMembers = {}; snap.forEach(d => { orgMembers[d.id] = d.data(); }); renderOrganizer(); }, () => {}));
    orgUnsubs.push(onSnapshot(col('teamMeta'), snap => { orgCaptains = {}; snap.forEach(d => { orgCaptains[d.id] = d.data().captain; }); renderOrganizer(); }, () => {}));
    orgUnsubs.push(onSnapshot(ref('config', 'map'), snap => { applyMapId(snap.exists() ? snap.data().map : DEFAULT_MAP); }, () => {}));
    await loadCodes();
    renderOrganizer();
  }
  function qrNode(text) {
    const wrap = h('div', { class: 'qr-box', 'aria-label': 'Mã QR vào đội' }, h('p', { class: 'join-lead', text: 'Đang tạo QR…' }));
    loadQr().then(() => {
      const qr = window.qrcode(0, 'M'); qr.addData(text); qr.make();
      const svg = new DOMParser().parseFromString(qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }), 'image/svg+xml').documentElement;
      wrap.replaceChildren(document.importNode(svg, true));
    }).catch(error => wrap.replaceChildren(h('p', { class: 'join-error', text: error.message })));
    return wrap;
  }
  async function setMap(id) {
    if (id === mapId) return;
    try { await setDoc(ref('config', 'map'), { map: id, at: serverTimestamp() }); toast(`Đã chọn khu ${MAPS[id].label} cho cả trận.`); }
    catch (error) { toast(`Không đổi được khu: ${error.message}`); }
  }
  async function setCaptain(team, memberId) {
    try {
      if (orgCaptains[team] === memberId) await deleteDoc(ref('teamMeta', String(team)));
      else await setDoc(ref('teamMeta', String(team)), { captain: memberId });
    } catch (error) { toast(`Không đặt được đội trưởng: ${error.message}`); }
  }
  async function removeMember(memberId) {
    const entry = orgMembers[memberId]; if (!entry) return;
    try {
      const batch = writeBatch(db);
      batch.delete(ref('members', memberId)); batch.delete(ref('memberOf', entry.uid)); batch.delete(ref('teams', entry.teamId, 'positions', entry.uid));
      for (let n = 0; n < 3; n++) batch.delete(ref('teams', entry.teamId, 'orders', `t_${entry.uid}_${n}`));
      await batch.commit(); toast(`Đã gỡ ${findMember(memberId)?.name || 'người chơi'}. Họ có thể vào lại.`);
    } catch (error) { toast(`Không gỡ được: ${error.message}`); }
  }
  async function endMatch() {
    try {
      // Id lệnh cố định nên xóa được mà không cần đọc (organizer không đọc được lệnh của đội). Chia nhiều batch vì giới hạn 500 thao tác.
      const targets = [];
      for (const [memberId, entry] of Object.entries(orgMembers)) {
        targets.push(ref('teams', entry.teamId, 'positions', entry.uid), ref('memberOf', entry.uid), ref('members', memberId));
        for (let n = 0; n < 3; n++) targets.push(ref('teams', entry.teamId, 'orders', `t_${entry.uid}_${n}`));
      }
      for (let team = 0; team < 6; team++) {
        targets.push(ref('teamKeys', String(team)), ref('teamMeta', String(team)));
        for (let n = 0; n < 10; n++) targets.push(ref('teams', String(team), 'orders', `a_${n}`), ref('teams', String(team), 'orders', `z_${n}`));
      }
      targets.push(ref('config', 'map'));
      for (let i = 0; i < targets.length; i += 400) {
        const batch = writeBatch(db);
        targets.slice(i, i + 400).forEach(target => batch.delete(target));
        await batch.commit();
      }
      codes = {}; confirmEnd = false;
      toast('Đã kết thúc trận và xóa dữ liệu vị trí, lệnh.'); renderOrganizer();
    } catch (error) { toast(`Không kết thúc được: ${error.message}`); }
  }
  function renderOrganizer() {
    if ($('#live-sheet').hidden || $('#live-sheet-title').textContent !== 'Điều khiển trận') return;
    const s = getState(), blocks = [];
    blocks.push(h('div', { class: 'org-map' },
      h('div', {}, h('b', { text: 'Khu vực chơi' }), h('small', { text: 'Cả trận dùng chung. Đổi là bản đồ của mọi người đổi theo.' })),
      h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Chọn khu vực chơi' },
        ...Object.entries(MAPS).map(([id, m]) => h('button', { class: 'seg-btn' + (id === mapId ? ' on' : ''), type: 'button', role: 'radio', 'aria-checked': String(id === mapId), onclick: () => setMap(id) }, m.label)))));
    for (let team = 0; team < s.teamCount; team++) {
      const locked = lockedTeam(team), players = teamPlayers(team), code = codes[team];
      const open = qrOpen.has(team), color = teamColors[team % teamColors.length];
      const joined = players.filter(id => orgMembers[id]).length;
      const card = h('section', { class: 'org-team', style: `--c:${color}`, id: `org-team-${team}` },
        h('header', {}, h('b', { text: `ĐỘI ${team + 1}` }), h('small', { text: `${joined}/${players.length} đã vào` })));
      if (!locked) card.append(h('p', { class: 'join-lead', text: 'Khóa đội ở tab Đội hình để tạo mã vào đội.' }));
      else if (code) {
        card.append(h('div', { class: 'org-code' }, h('code', { text: code }), h('div', { class: 'org-code-actions' },
          h('button', { class: 'secondary-button', type: 'button', onclick: () => { open ? qrOpen.delete(team) : qrOpen.add(team); renderOrganizer(); } }, open ? 'ẨN QR' : 'HIỆN QR'),
          h('button', { class: 'secondary-button', type: 'button', onclick: async () => {
            const link = joinLink(code);
            if (navigator.share) { try { await navigator.share({ title: `ASDN · Đội ${team + 1}`, text: `Vào Đội ${team + 1}, mã ${code}`, url: link }); return; } catch (error) { if (error.name === 'AbortError') return; } }
            try { await navigator.clipboard.writeText(link); toast('Đã sao chép link vào đội.'); } catch { toast('Không sao chép được. Hãy dùng HTTPS.'); }
          } }, navigator.share ? 'CHIA SẺ LINK' : 'SAO CHÉP LINK'))));
        if (open) card.append(qrNode(joinLink(code)), h('button', { class: 'text-button', type: 'button', onclick: () => newCode(team) }, '↻ Đổi mã (mã cũ vô hiệu)'));
      }
      const list = h('div', { class: 'org-members' });
      players.forEach(id => {
        const member = findMember(id); if (!member) return;
        const inTeam = Boolean(orgMembers[id]), isCaptain = orgCaptains[String(team)] === id;
        list.append(h('div', { class: 'org-member' },
          makeAvatar(member, 'pick-avatar'),
          h('span', { class: 'pick-name' }, member.name, h('small', { text: inTeam ? '✓ Đã vào' : 'Chưa vào' })),
          h('button', { class: 'icon-button' + (isCaptain ? ' on' : ''), type: 'button', 'aria-pressed': String(isCaptain), 'aria-label': `${isCaptain ? 'Bỏ' : 'Đặt'} đội trưởng ${member.name}`, onclick: () => setCaptain(team, id) }, '★'),
          inTeam && h('button', { class: 'icon-button', type: 'button', 'aria-label': `Gỡ ${member.name}`, onclick: () => removeMember(id) }, '✕')));
      });
      card.append(list); blocks.push(card);
    }
    blocks.push(h('div', { class: 'org-danger' }, confirmEnd
      ? [h('p', { text: 'Xóa toàn bộ vị trí, danh sách vào đội và mã đội? Không hoàn tác được.' }), h('div', { class: 'sheet-actions' },
          h('button', { class: 'danger-button', type: 'button', onclick: endMatch }, 'XÁC NHẬN KẾT THÚC'), h('button', { class: 'secondary-button', type: 'button', onclick: () => { confirmEnd = false; renderOrganizer(); } }, 'HỦY'))]
      : h('button', { class: 'danger-button', type: 'button', onclick: () => { confirmEnd = true; renderOrganizer(); } }, 'KẾT THÚC TRẬN · XÓA DỮ LIỆU')));
    const keepScroll = $('#live-sheet-body').scrollTop;
    $('#live-sheet-body').replaceChildren(...blocks);
    $('#live-sheet-body').scrollTop = keepScroll;
    if (orgFocus != null) { const target = $(`#org-team-${orgFocus}`); orgFocus = null; if (target) target.scrollIntoView({ block: 'start' }); }
  }

  // ---------- Hiển thị ----------
  function mapSectionVisible() { const section = $('#map-section'); return Boolean(section && section.offsetParent !== null); }
  function askedThisSession() { try { if (sessionStorage.getItem(ASKED_KEY)) return true; sessionStorage.setItem(ASKED_KEY, '1'); } catch {} return false; }
  function render() {
    const view = $('#map-view'), joinBox = $('#map-join');
    const loading = user && !meLoaded;
    joinBox.hidden = Boolean(me) || Boolean(loading);
    view.hidden = !me;
    $('#btn-org').hidden = !isOrganizer();
    $('#map-loading').hidden = !loading;
    if (!me && !loading) renderJoin();
    if (me) {
      renderHud();
      if (mapSectionVisible()) ensureMap().then(() => { if (map) { map.invalidateSize(); drawPlayers(); } });
      let asked = null; try { asked = localStorage.getItem(SHARE_KEY); } catch {}
      if (asked === '1' && !wantShare) startSharing();
      else if (asked === null && !wantShare && mapSectionVisible() && !askedThisSession()) askShare();
    }
    if (!me) clearMe();
  }

  // Khi tab Bản đồ được mở (mobile) hoặc cuộn tới (desktop) thì dựng bản đồ và tính lại kích thước.
  new MutationObserver(() => { if (me && mapSectionVisible()) render(); }).observe(document.body, { attributes: true, attributeFilter: ['data-tab'] });
  addEventListener('resize', () => { if (map) { map.invalidateSize(); syncEdges(); } });
  // Xoay màn hình: căn lại khu chơi vào khung mới.
  matchMedia('(orientation: landscape)').addEventListener('change', () => setTimeout(() => { if (map) { map.invalidateSize(); fitArea(); } }, 250));

  $('#btn-fit').addEventListener('click', fitArea);
  $('#btn-grid').addEventListener('click', toggleGrid);
  $('#btn-sat').addEventListener('click', toggleSatellite);
  $('#btn-org').addEventListener('click', () => openOrganizer());
  // Điện thoại: bấm tab Bản đồ (là thao tác của người dùng nên được phép) thì tự vào toàn màn hình + khóa ngang.
  // Người dùng thoát toàn màn hình thủ công thì không tự vào lại trong phiên này.
  const phone = matchMedia('(max-width: 768px), (orientation: landscape) and (max-height: 500px)');
  const mapTab = document.querySelector('#tabbar button[data-tab="map"]');
  if (mapTab) mapTab.addEventListener('click', () => {
    if (!me || !phone.matches) return;
    let off = false; try { off = sessionStorage.getItem(FS_OFF_KEY) === '1'; } catch {}
    if (off) return;
    if ($('#map-section').requestFullscreen) { if (!document.fullscreenElement) toggleFullscreen(true); }
    else { let seen = false; try { seen = sessionStorage.getItem(HINT_KEY) === '1'; sessionStorage.setItem(HINT_KEY, '1'); } catch {} if (!seen) toast('Xoay ngang điện thoại để xem bản đồ rộng hơn.'); }
  });
  if ($('#map-section').requestFullscreen) { $('#btn-full').hidden = false; $('#btn-full').addEventListener('click', () => toggleFullscreen()); }
  $('#btn-share').addEventListener('click', () => { if (wantShare) stopSharing(true); else startSharing(); });

  // ---------- API cho app.js ----------
  const api = {
    onAuth(next) {
      const changed = (next && next.uid) !== (user && user.uid);
      user = next;
      if (changed) watchMe(next); else render();
    },
    onState() { if (join.step === 'pick') render(); else if (!me) render(); renderHud(); if (!$('#live-sheet').hidden) renderOrganizer(); },
    openOrganizer,
    // Mở link ?join=… : chuyển sang tab Bản đồ và điền mã.
    consumeJoinLink() {
      if (!pending.code) return;
      const code = pending.code; pending.code = '';
      history.replaceState(null, '', location.pathname);
      join.code = code;
      const tab = document.querySelector('#tabbar button[data-tab="map"]'); if (tab) tab.click();
      $('#map-section').scrollIntoView({ block: 'start' });
      if (!me) submitCode(code);
    },
  };
  render();
  return api;
}
