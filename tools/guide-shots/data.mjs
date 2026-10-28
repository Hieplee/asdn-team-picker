// Dữ liệu giả lập cho ảnh hướng dẫn: đội, người chơi, vị trí và lệnh đều đặt trong khu Núi (khung vàng A-B-C-D).
import { readFileSync } from 'node:fs';
const scene = JSON.parse(readFileSync(new URL('./scene.json', import.meta.url)));
const [LAT0, LNG0] = scene.origin;
const M_LAT = 111320, M_LNG = 111320 * Math.cos(LAT0 * Math.PI / 180);
export const ll = (x, y) => [LAT0 + y / M_LAT, LNG0 + x / M_LNG];
const flat = pts => pts.flatMap(p => ll(...p));

export const CODES = { 0: '1K7QMA', 1: '2P4XWD' };
export const ORGANIZER_UID = '57BKTGPZoDaIc2wChRWut3NBf6E3'; // trùng organizerUids[0] để app coi là người tổ chức

export const PEOPLE = [
  ['d01', 'Long Trần', 0], ['d02', 'Khoa Lê', 0], ['d03', 'Đức Phạm', 0], ['d04', 'Tuấn Vũ', 0], ['d05', 'Bình Đặng', 0], ['d06', 'Sơn Hoàng', 0],
  ['d07', 'Nam Bùi', 1], ['d08', 'Phát Võ', 1], ['d09', 'Quân Đỗ', 1], ['d10', 'Việt Lý', 1], ['d11', 'Kiên Mai', 1], ['d12', 'Dũng Cao', 1],
];
export const MEMBERS_JSON = [...PEOPLE.map(([id, name]) => ({ id, name })), { id: 'd13', name: 'Hải Ngô' }, { id: 'd14', name: 'Thịnh Đinh' }, { id: 'd15', name: 'Vinh Phan' }];
export const uidOf = id => 'u_' + id;

// vị trí đồng đội (m, gốc tại góc D) rải dọc đường mòn phía tây tiến dần ra ngã tư
export const POS = {
  d01: [14, 31],   // đội trưởng, đầu đường mòn phía tây
  d02: [31, 37],   // người xem (Khoa)
  d03: [15, 45],   // quanh nhà gỗ
  d04: [52, 22],   // lối mòn nam
  d05: [63, 31],   // gần ngã tư, phía đông
  d06: [40, 45],   // bìa rừng, mất tín hiệu ở một số ảnh
};
export const ME = 'd02';

const ORDERS = (t) => ({
  [`t_${uidOf('d02')}_0`]: { type: 'target', pts: flat([[57, 41]]), by: uidOf('d02'), mid: 'd02', ts: { __ago: 150000 } },
  [`t_${uidOf('d04')}_0`]: { type: 'target', pts: flat([[85, 16]]), by: uidOf('d04'), mid: 'd04', ts: { __ago: 260000 } },
  atk_0: { type: 'attack', pts: flat([[80, 45]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 90000 } },
  atk_1: { type: 'attack', pts: flat([[88, 56]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 80000 } },
  def_0: { type: 'defend', pts: flat([[32, 50]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 70000 } },
  def_1: { type: 'defend', pts: flat([[42, 24]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 60000 } },
  a_0: { type: 'arrow', pts: flat([[6, 31], [24, 34], [42, 37], [56, 38], [74, 41]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 50000 } },
  z_0: { type: 'zone', pts: flat([[73, 6], [96, 5], [100, 24], [75, 25]]), by: uidOf('d01'), mid: 'd01', ts: { __ago: 40000 } },
});
export const ORDER_SETS = { none: () => ({}), target: () => { const o = ORDERS(); return { [`t_${uidOf('d02')}_0`]: o[`t_${uidOf('d02')}_0`], [`t_${uidOf('d04')}_0`]: o[`t_${uidOf('d04')}_0`] }; }, all: ORDERS };

/** Dựng seed Firestore giả. opts: role ('join' | 'member' | 'captain' | 'org'), orders ('none'|'target'|'all'), joined (ids đã vào đội), stale (ids mất tín hiệu), deaths ({id:[x,y]}) */
export function seed(opts = {}) {
  const { role = 'member', orders = 'all', joined = ['d01', 'd02', 'd03', 'd04', 'd05', 'd06'], stale = [], noPos = [], deaths = {}, mapId = 'nui', share = true } = opts;
  const docs = {};
  const selected = PEOPLE.map(p => p[0]);
  docs['public/current'] = { selected, assignments: Object.fromEntries(PEOPLE.map(([id, , t]) => [id, t])), teamCount: 2, mode: 'outdoor', lockedPlayers: [], lockedTeams: [0, 1], guests: [] };
  docs['public/attributes'] = {};
  docs['match/current/teamKeys/0'] = { code: CODES[0] };
  docs['match/current/teamKeys/1'] = { code: CODES[1] };
  docs['match/current/config/map'] = { map: mapId };
  docs['match/current/teamMeta/0'] = { captain: 'd01' };
  const me = role === 'captain' || role === 'org' ? 'd01' : ME;
  const myUid = role === 'org' ? ORGANIZER_UID : uidOf(me);
  const uidFor = id => (role === 'org' && id === me) ? ORGANIZER_UID : uidOf(id);
  const fresh = [];
  const freshAge = {};
  joined.forEach(id => {
    const uid = uidFor(id), t = PEOPLE.find(p => p[0] === id)[2];
    docs[`match/current/members/${id}`] = { uid, teamId: String(t) };
    if (role === 'join' && id === me) return;
    if (id === me && role !== 'join' && !share) return;
    if (noPos.includes(id)) return;
    const path = `match/current/teams/${t}/positions/${uid}`;
    if (id !== me) { const [x, y] = POS[id]; const [lat, lng] = ll(x, y); docs[path] = { lat, lng, acc: 5 + (id.charCodeAt(2) % 4), heading: null, ts: { __ago: stale.includes(id) ? 95000 : 4000 } }; if (!stale.includes(id)) fresh.push(path); }
  });
  if (role !== 'join') docs[`match/current/memberOf/${myUid}`] = { memberId: me, teamId: '0', code: CODES[0] };
  const o = ORDER_SETS[orders]();
  if (role !== 'join') for (const [k, v] of Object.entries(o)) docs[`match/current/teams/0/orders/${k}`] = { ...v, by: v.mid === 'd02' && role !== 'member' && role !== 'join' ? v.by : v.by };
  for (const [id, [x, y]] of Object.entries(deaths)) { const [lat, lng] = ll(x, y); docs[`match/current/teams/0/deaths/${id}`] = { mid: id, lat, lng, by: uidOf(id), ts: { __ago: 120000 } }; delete docs[`match/current/teams/0/positions/${uidOf(id)}`]; }
  const user = role === 'join' ? null : { uid: myUid, isAnonymous: role !== 'org' };
  return { user, docs, fresh, freshAge, anonUid: 'anon-guest', myPos: POS[me] };
}
