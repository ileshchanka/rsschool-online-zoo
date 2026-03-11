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

(function () {
  function createSlider(options) {
    const grid = options.grid;
    const track = options.track;
    const cards = Array.from(track.querySelectorAll(options.cardSelector));
    let currentIndex = 0;
    let cardWidth = 0;
    let cardGap = 0;
    let perPageCached = 0;

    track.style.willChange = 'transform';

    function layout() {
      perPageCached = options.getCardsPerPage();
      cardGap = parseFloat(getComputedStyle(track).columnGap) || 0;
      cardWidth = (grid.offsetWidth - cardGap * (perPageCached - 1)) / perPageCached;
      cards.forEach(function (card) {
        card.style.width = cardWidth + 'px';
      });
      const maxIndex = Math.max(0, cards.length - perPageCached);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      applyOffset('none');
    }

    function applyOffset(transition) {
      const offset = currentIndex * (cardWidth + cardGap);
      track.style.transition = transition;
      track.style.transform = 'translateX(-' + offset + 'px)';
      const maxIndex = Math.max(0, cards.length - perPageCached);
      options.prevBtn.disabled = currentIndex === 0;
      options.nextBtn.disabled = currentIndex >= maxIndex;
    }

    options.prevBtn.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        applyOffset('transform 0.4s ease');
      }
    });

    options.nextBtn.addEventListener('click', function () {
      const maxIndex = Math.max(0, cards.length - perPageCached);
      if (currentIndex < maxIndex) {
        currentIndex++;
        applyOffset('transform 0.4s ease');
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    });

    layout();
  }

  createSlider({
    grid: document.querySelector('.pets__grid'),
    track: document.querySelector('.pets__track'),
    cardSelector: '.pets__card',
    prevBtn: document.querySelector('.pets__arrow--prev'),
    nextBtn: document.querySelector('.pets__arrow--next'),
    getCardsPerPage: function () {
      const w = window.innerWidth;
      if (w <= 320) return 1;
      if (w <= 640) return 2;
      if (w <= 1200) return 3;
      return 4;
    }
  });

  createSlider({
    grid: document.querySelector('.reviews__grid'),
    track: document.querySelector('.reviews__track'),
    cardSelector: '.reviews__card',
    prevBtn: document.querySelector('.reviews__arrow--prev'),
    nextBtn: document.querySelector('.reviews__arrow--next'),
    getCardsPerPage: function () {
      return window.innerWidth <= 640 ? 1 : 2;
    }
  });
})();


