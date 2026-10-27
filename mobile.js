(function () {
  var mq = window.matchMedia('(max-width: 768px), (orientation: landscape) and (max-height: 500px)');
  var body = document.body;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('#tabbar button'));
  var userPicked = false;
  function $(s) { return document.querySelector(s); }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} }

  // --- Tab bar ---
  function setTab(name, manual) {
    if (name === 'audit' && $('#tab-audit').hidden) name = 'roster';
    if (manual) userPicked = true;
    body.dataset.tab = name;
    body.classList.remove('setup-open');
    if (typeof toggle !== 'undefined' && toggle) setupLabel();
    tabs.forEach(function (b) { if (b.dataset.tab === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (!mq.matches) return;
    if (name === 'audit' && $('#audit-panel').hidden) $('#audit-button').click();
    window.scrollTo(0, 0);
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.tab !== body.dataset.tab) buzz(6); setTab(b.dataset.tab, true); }); });
  setTab('roster');

  function sync() {
    var count = Number(($('#selected-total') || {}).textContent) || 0;
    var badge = $('#tab-count');
    // Chỉ ghi khi giá trị đổi, nếu không MutationObserver sẽ gọi lại sync() vô hạn.
    if (badge.hidden === !!count) badge.hidden = !count;
    if (badge.textContent !== String(count)) badge.textContent = count;
    var auditVisible = !$('#audit-button').hidden;
    if ($('#tab-audit').hidden === auditVisible) $('#tab-audit').hidden = !auditVisible;
    if (!auditVisible && body.dataset.tab === 'audit') setTab('roster');
  }
  new MutationObserver(sync).observe($('#selected-total'), { childList: true, characterData: true, subtree: true });
  new MutationObserver(sync).observe($('#audit-button'), { attributes: true, attributeFilter: ['hidden'] });
  sync();

  // Khi đội hình vừa xuất hiện (sau khi chia, hoặc người xem mở app) thì chuyển sang tab Đội hình.
  var results = $('#results'), resultsShown = !results.hidden;
  new MutationObserver(function () {
    var shown = !results.hidden;
    if (shown && !resultsShown && !userPicked && mq.matches) setTab('teams');
    resultsShown = shown;
  }).observe(results, { attributes: true, attributeFilter: ['hidden'] });
  ['#bar-split', '#split-button'].forEach(function (id) {
    $(id).addEventListener('click', function () { setTimeout(function () { if (mq.matches && !results.hidden) { setTab('teams'); if (typeof setupLabel === 'function') setupLabel(); } }, 80); });
  });

  // --- Thiết lập thu gọn ở tab Đội hình ---
  var toggle = document.createElement('button');
  toggle.type = 'button'; toggle.id = 'setup-toggle'; toggle.className = 'setup-toggle';
  toggle.innerHTML = '<span></span><span></span>';
  $('#setup-section').before(toggle);
  function setupLabel() {
    var mode = $('#split-mode'), opt = mode && mode.options[mode.selectedIndex];
    var text = '⚙ ' + $('#team-total').textContent + ' đội · ' + (opt ? opt.text : '');
    var open = body.classList.contains('setup-open');
    if (toggle.firstChild.textContent !== text) toggle.firstChild.textContent = text;
    var tail = open ? 'Thu gọn ▴' : 'Chỉnh ▾';
    if (toggle.lastChild.textContent !== tail) toggle.lastChild.textContent = tail;
  }
  toggle.addEventListener('click', function () { body.classList.toggle('setup-open'); setupLabel(); buzz(6); });
  function syncResults() { var has = !results.hidden; if (body.classList.contains('has-results') !== has) body.classList.toggle('has-results', has); setupLabel(); }
  new MutationObserver(syncResults).observe(results, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(setupLabel).observe($('#team-total'), { childList: true, characterData: true, subtree: true });
  $('#split-mode').addEventListener('change', setupLabel);
  syncResults();

  // Nhãn ngắn cho nút trên thanh nổi để không xuống 2 dòng
  var rbFull = rbLabelSource();
  function rbLabelSource() { return document.querySelector('#rebalance-min').innerHTML; }
  function applyRbLabel() { var b = document.querySelector('#rebalance-min'), want = mq.matches ? '⇄ CÂN LẠI' : rbFull; if (b.innerHTML !== want) b.innerHTML = want; }
  applyRbLabel();
  if (mq.addEventListener) mq.addEventListener('change', applyRbLabel);

  // --- Gợi ý cân lại: nút ở thanh dưới, đánh dấu khi đội đang lệch; xem trước hiện ngay trong bottom sheet ---
  var rbBox = $('#rebalance-box'), rbBtn = $('#rebalance-min');
  function syncRebalance() {
    var needs = !rbBox.hidden && !!rbBox.querySelector(':scope > span');
    if (rbBtn.classList.contains('needs-rebalance') !== needs) rbBtn.classList.toggle('needs-rebalance', needs);
    var hasPreview = !rbBox.hidden && !!rbBox.querySelector('.rebalance-actions');
    if (mq.matches && hasPreview) openRebalanceSheet();
    else if (rbOpen) closeSheet();
  }
  new MutationObserver(syncRebalance).observe(rbBox, { childList: true, attributes: true, attributeFilter: ['hidden'] });

  // --- Bottom sheet thay <select> ---
  var sheet = $('#sheet'), optionsBox = $('#sheet-options'), titleEl = $('#sheet-title'), current = null;
  var rbOpen = false;
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('open'); current = null; rbOpen = false;
    setTimeout(function () { sheet.hidden = true; }, 230);
  }
  function openSheet(select) {
    current = select;
    titleEl.textContent = select.getAttribute('aria-label') || 'Chọn';
    optionsBox.replaceChildren();
    Array.prototype.forEach.call(select.options, function (opt) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sheet-option'; b.textContent = opt.text; b.disabled = opt.disabled;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(opt.value === select.value));
      b.addEventListener('click', function () {
        var target = current; closeSheet(); buzz(10);
        if (target && target.value !== opt.value) { target.value = opt.value; target.dispatchEvent(new Event('change', { bubbles: true })); }
      });
      optionsBox.append(b);
    });
    sheet.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
  }
  function dismissSheet() {
    if (rbOpen) { var cancel = rbBox.querySelector('.rebalance-actions button:last-child'); if (cancel) { cancel.click(); return; } }
    closeSheet();
  }
  sheet.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) dismissSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dismissSheet(); });
  function openRebalanceSheet() {
    if (rbOpen) return;
    var title = rbBox.querySelector('strong'), moves = rbBox.querySelector('.rebalance-moves'), diffs = rbBox.querySelectorAll('.rebalance-diff'), buttons = rbBox.querySelectorAll('.rebalance-actions button');
    rbOpen = true; current = null;
    titleEl.textContent = title ? title.textContent : 'Cân lại tối thiểu';
    optionsBox.replaceChildren();
    if (moves) {
      var list = document.createElement('ul'); list.className = 'rb-moves';
      moves.textContent.split(' · ').forEach(function (m) { var li = document.createElement('li'); li.textContent = m; list.append(li); });
      optionsBox.append(list);
    }
    diffs.forEach(function (d) { var p = document.createElement('p'); p.className = 'rb-diff'; p.textContent = d.textContent; optionsBox.append(p); });
    var bar = document.createElement('div'); bar.className = 'rb-actions';
    buttons.forEach(function (real, i) {
      var b = document.createElement('button'); b.type = 'button';
      b.className = 'rb-btn' + (buttons.length > 1 && i === 0 ? ' primary' : '');
      b.textContent = real.textContent;
      b.addEventListener('click', function () { buzz(10); real.click(); });
      bar.append(b);
    });
    optionsBox.append(bar);
    sheet.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
  }
  syncRebalance();
  // select có pointer-events:none, nên tìm select nằm dưới ngón tay
  document.addEventListener('click', function (e) {
    if (!mq.matches || !sheet.hidden || e.target.closest('.sheet, button, a, input, textarea')) return;
    var x = e.clientX, y = e.clientY, hit = null;
    document.querySelectorAll('select:not(:disabled)').forEach(function (s) {
      if (hit || s.hidden || !s.offsetParent) return;
      var r = s.getBoundingClientRect();
      if (x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 4 && y <= r.bottom + 4) hit = s;
    });
    // Chỉ nhận khi vùng chạm thật sự nằm trong khối chứa select, tránh bắt nhầm khi một lớp nổi (thanh nút, tab bar) phủ lên select.
    if (hit && hit.parentElement.contains(e.target)) { e.preventDefault(); e.stopPropagation(); hit.blur(); buzz(6); openSheet(hit); }
  }, true);

  // --- Vuốt hàng người chơi: trái = khóa, phải = đổi đội ---
  var sw = null;
  document.addEventListener('touchstart', function (e) {
    if (!mq.matches || e.touches.length !== 1) return;
    var row = e.target.closest && e.target.closest('.team-person');
    if (!row || e.target.closest('button,select')) return;
    var t = e.touches[0];
    sw = { row: row, x: t.clientX, y: t.clientY, dx: 0, lock: false };
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!sw) return;
    var t = e.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    if (!sw.lock) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { sw = null; return; }
      if (Math.abs(dx) < 10) return;
      sw.lock = true; sw.row.classList.add('swiping');
    }
    sw.dx = Math.max(-110, Math.min(110, dx));
    sw.row.style.transform = 'translateX(' + sw.dx + 'px)';
    sw.row.classList.toggle('swipe-hint-lock', sw.dx < -70);
    sw.row.classList.toggle('swipe-hint-move', sw.dx > 70);
  }, { passive: true });
  function endSwipe() {
    if (!sw) return;
    var row = sw.row, dx = sw.dx; sw = null;
    row.classList.remove('swiping', 'swipe-hint-lock', 'swipe-hint-move');
    row.style.transform = '';
    if (dx < -70) { var lock = row.querySelector('.person-lock'); if (lock) { buzz(14); lock.click(); } }
    else if (dx > 70) { var sel = row.querySelector('select:not(:disabled)'); if (sel) { buzz(10); openSheet(sel); } }
  }
  document.addEventListener('touchend', endSwipe, { passive: true });
  document.addEventListener('touchcancel', endSwipe, { passive: true });
})();
