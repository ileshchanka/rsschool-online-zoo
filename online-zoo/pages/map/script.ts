// Mobile side-nav
(function () {
  const burger = document.getElementById('headerBurger');
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('sideNavOverlay');
  const closeBtn = document.getElementById('sideNavClose');

  function openNav(): void {
    sideNav?.classList.add('side-nav--open');
  }

  function closeNav(): void {
    sideNav?.classList.remove('side-nav--open');
  }

  burger?.addEventListener('click', openNav);
  overlay?.addEventListener('click', closeNav);
  closeBtn?.addEventListener('click', closeNav);
})();
