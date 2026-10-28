(function () {
  var data = window.GUIDE;
  if (!data) return;
  var body = document.body, partsEl = document.getElementById('g-parts'), bodyEl = document.getElementById('g-body');
  var roleBtns = Array.prototype.slice.call(document.querySelectorAll('.g-role button')), note = document.getElementById('g-role-note');
  var ROLE_KEY = 'asdn-guide-role', PART_KEY = 'asdn-guide-part';
  var manual = null, part = null, auto = 'org';
  try { manual = localStorage.getItem(ROLE_KEY); } catch (e) {}
  try { part = localStorage.getItem(PART_KEY); } catch (e) {}

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function detect() { return body.classList.contains('viewer') ? 'player' : 'org'; }
  function role() { return manual || auto; }
  function visible(item, r) { return !item.role || item.role === r; }
  function partVisible(p, r) { return p.blocks.some(function (b) { return visible(b, r); }); }

  function figure(b) {
    var fig = el('div', 'g-fig');
    var shot = el('div', 'g-shot'); var img = el('img'); img.src = 'guide/' + b.shot + '.jpg?v=7'; img.alt = b.alt || b.caption || ''; img.loading = 'lazy'; shot.append(img);
    var legend = el('ol', 'g-legend');
    b.marks.forEach(function (m) {
      var box = el('div', 'g-mk'); box.dataset.role = m.role || ''; box.style.cssText = 'left:' + m.x + '%;top:' + m.y + '%;width:' + m.w + '%;height:' + m.h + '%'; box.append(el('i'));
      shot.append(box);
      var li = el('li', null, '<i></i><span><b>' + m.title + (m.role === 'org' ? '<em>TỔ CHỨC</em>' : '') + '</b>' + m.desc + '</span>'); li.dataset.role = m.role || '';
      legend.append(li);
    });
    fig.append(el('p', 'g-cap', b.caption), shot, legend);
    return fig;
  }
  function renumber(scope, r) {
    scope.querySelectorAll('.g-fig').forEach(function (fig) {
      var n = 0, boxes = fig.querySelectorAll('.g-mk'), items = fig.querySelectorAll('.g-legend li');
      boxes.forEach(function (box, i) {
        var show = !box.dataset.role || box.dataset.role === r;
        box.hidden = items[i].hidden = !show;
        if (show) { n++; box.querySelector('i').textContent = n; items[i].querySelector('i').textContent = n; }
      });
    });
  }
  function block(b) {
    var w;
    switch (b.t) {
      case 'h': w = el('h3', 'g-h', b.text); break;
      case 'p': w = el('p', 'g-p', b.html); break;
      case 'tip': w = el('div', 'g-tip', b.html); break;
      case 'warn': w = el('div', 'g-warn', b.html); break;
      case 'steps': w = el('ol', 'g-steps'); b.items.forEach(function (i) { w.append(el('li', null, i)); }); break;
      case 'cards': w = el('div', 'g-cards'); b.items.forEach(function (c) { w.append(el('div', 'g-card', '<h4>' + c[0] + '</h4>' + c[1])); }); break;
      case 'gest': w = el('div', 'g-gest'); b.items.forEach(function (c) { w.append(el('div', null, '<strong>' + c[0] + '</strong>' + c[1])); }); break;
      case 'chips': w = el('div', 'g-chips'); b.items.forEach(function (c) { var d = el('div', 'g-chip', '<i' + (c[0].length > 2 ? ' class="wide"' : '') + '>' + c[0] + '</i><span><b>' + c[1] + (c[3] === 'org' ? ' · <small>tổ chức</small>' : '') + '</b>' + c[2] + '</span>'); d.dataset.role = c[3] || ''; w.append(d); }); break;
      case 'faq': w = el('div'); b.items.forEach(function (q) { var d = el('details', 'g-faq', '<summary>' + q[0] + '</summary><div>' + q[1] + '</div>'); d.dataset.role = q[2] || ''; w.append(d); }); break;
      case 'fig': w = figure(b); break;
    }
    var wrap = el('div', 'g-block'); wrap.dataset.role = b.role || ''; wrap.append(w); return wrap;
  }

  function currentPart(r) {
    var list = data.parts.filter(function (p) { return partVisible(p, r); });
    if (!list.some(function (p) { return p.id === part; })) part = list[0].id;
    return list;
  }
  function render() {
    var r = role();
    roleBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.role === r)); });
    var detected = auto === 'org' ? 'người tổ chức' : 'người chơi';
    note.textContent = manual && manual !== auto
      ? 'Bạn đang xem trước hướng dẫn của ' + (r === 'org' ? 'người tổ chức' : 'người chơi') + '. Tài khoản của bạn hiện là ' + detected + '. '
      : r === 'org' ? 'Bạn đang là người tổ chức (hoặc bản demo), nên hiện đủ các bước chọn người, chia đội, khóa và điều khiển trận. Nút nào chỉ dành cho người tổ chức có nhãn TỔ CHỨC.'
      : 'Bạn đang là người chơi: chỉ xem danh sách, đội hình và dùng bản đồ. Các thao tác của người tổ chức được ẩn đi; bấm "Người tổ chức" nếu muốn xem trước.';
    var list = currentPart(r);
    partsEl.replaceChildren();
    list.forEach(function (p, i) {
      var b = el('button', null, '<b>' + (i + 1) + '</b>' + p.title); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(p.id === part));
      b.addEventListener('click', function () { go(p.id); }); partsEl.append(b);
    });
    var p = data.parts.filter(function (x) { return x.id === part; })[0];
    bodyEl.replaceChildren();
    bodyEl.append(el('h3', 'g-part-title', p.title), el('p', 'g-part-lead', r === 'org' && p.leadOrg ? p.leadOrg : p.lead));
    p.blocks.forEach(function (b) { if (visible(b, r)) bodyEl.append(block(b)); });
    var idx = list.findIndex(function (x) { return x.id === part; });
    var nav = el('div', 'g-nav-row');
    if (idx > 0) { var pv = el('button', 'prev', '← ' + list[idx - 1].title); pv.type = 'button'; pv.addEventListener('click', function () { go(list[idx - 1].id); }); nav.append(pv); }
    if (idx < list.length - 1) { var nx = el('button', 'next', list[idx + 1].title + ' →'); nx.type = 'button'; nx.addEventListener('click', function () { go(list[idx + 1].id); }); nav.append(nx); }
    bodyEl.append(nav);
    renumber(bodyEl, r);
    var sel = partsEl.querySelector('[aria-selected="true"]'); if (sel && sel.scrollIntoView) { try { partsEl.scrollTo({ left: sel.offsetLeft - 20 }); } catch (e) {} }
  }
  function go(id) {
    part = id; try { localStorage.setItem(PART_KEY, id); } catch (e) {}
    render();
    var top = document.getElementById('g-parts').getBoundingClientRect().top + window.scrollY - (window.matchMedia('(max-width:768px)').matches ? 0 : 100);
    window.scrollTo({ top: Math.max(0, top - 4), behavior: 'smooth' });
  }
  roleBtns.forEach(function (b) { b.addEventListener('click', function () { manual = b.dataset.role === auto ? null : b.dataset.role; try { if (manual) localStorage.setItem(ROLE_KEY, manual); else localStorage.removeItem(ROLE_KEY); } catch (e) {} render(); }); });
  // Vai trò tự nhận theo trạng thái đăng nhập: app.js gắn/bỏ class "viewer" trên <body>.
  function sync() { var next = detect(); if (next !== auto) { auto = next; render(); } }
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class'] });
  auto = detect();
  render();
})();
