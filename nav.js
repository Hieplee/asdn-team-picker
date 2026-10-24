(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('#section-nav a'));
  function targetOf(a) { return document.getElementById(a.dataset.target); }
  function visible(el) { return el && el.offsetParent !== null; }
  function update() {
    var current = null;
    links.forEach(function (a) {
      var el = targetOf(a);
      a.hidden = !visible(el);
      if (visible(el) && el.getBoundingClientRect().top <= 140) current = a;
    });
    links.forEach(function (a) { a.classList.toggle('active', a === current); });
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  new MutationObserver(update).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['hidden', 'class'] });
  update();
})();
