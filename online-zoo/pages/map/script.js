(function () {
  const headerBurger = document.getElementById('headerBurger');
  const sideNav = document.getElementById('sideNav');
  const sideNavOverlay = document.getElementById('sideNavOverlay');
  const sideNavClose = document.getElementById('sideNavClose');

  function openSideNav() {
    sideNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSideNav() {
    sideNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  headerBurger.addEventListener('click', openSideNav);
  sideNavClose.addEventListener('click', closeSideNav);
  sideNavOverlay.addEventListener('click', closeSideNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSideNav();
    }
  });
})();


