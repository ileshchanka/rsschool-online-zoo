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

// Pets slider
(function () {
  interface SliderState {
    index: number;
    perView: number;
    total: number;
  }

  function getPerView(): number {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function initSlider(
    trackSelector: string,
    cardSelector: string,
    prevSelector: string,
    nextSelector: string,
  ): void {
    const track = document.querySelector<HTMLElement>(trackSelector);
    const prevBtn = document.querySelector<HTMLButtonElement>(prevSelector);
    const nextBtn = document.querySelector<HTMLButtonElement>(nextSelector);
    if (!track || !prevBtn || !nextBtn) return;
    const t: HTMLElement = track;
    const prev: HTMLButtonElement = prevBtn;
    const next: HTMLButtonElement = nextBtn;

    const cards = Array.from(t.querySelectorAll<HTMLElement>(cardSelector));
    const state: SliderState = {
      index: 0,
      perView: getPerView(),
      total: cards.length,
    };

    function updateSlider(): void {
      state.perView = getPerView();
      const maxIndex = Math.max(0, state.total - state.perView);
      if (state.index > maxIndex) state.index = maxIndex;
      const offset = -(state.index * (100 / state.perView));
      t.style.transform = `translateX(${offset}%)`;
      prev.disabled = state.index === 0;
      next.disabled = state.index >= maxIndex;
    }

    prev.addEventListener('click', () => {
      if (state.index > 0) {
        state.index -= 1;
        updateSlider();
      }
    });

    next.addEventListener('click', () => {
      const maxIndex = Math.max(0, state.total - state.perView);
      if (state.index < maxIndex) {
        state.index += 1;
        updateSlider();
      }
    });

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener('resize', () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlider, 150);
    });

    updateSlider();
  }

  initSlider('.pets__track', '.pets__card', '.pets__arrow--prev', '.pets__arrow--next');
})();

// Reviews: fetch from API and render slider
(function () {
  interface Feedback {
    id: number;
    city: string;
    month: string;
    year: string;
    text: string;
    name: string;
  }

  interface ApiResponse {
    data: Feedback[];
  }

  const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

  function buildReviewCard(item: Feedback): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('reviews__card');
    card.innerHTML = `
      <img class="reviews__card-quote" src="../../assets/icons/quotes.svg" alt="">
      <h4 class="reviews__card-location">${escapeHtml(item.city)}, ${escapeHtml(item.month)} ${escapeHtml(item.year)}</h4>
      <p class="reviews__card-text">${escapeHtml(item.text)}</p>
      <span class="reviews__card-author">${escapeHtml(item.name)}</span>
    `;
    return card;
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getPerView(): number {
    return window.innerWidth >= 900 ? 2 : 1;
  }

  async function loadReviews(): Promise<void> {
    const track = document.querySelector<HTMLElement>('.reviews__track');
    if (!track) return;

    let reviews: Feedback[] = [];
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResponse;
      reviews = json.data;
    } catch {
      // Fallback: keep static HTML cards already in track
      initReviewsSlider();
      return;
    }

    // Replace static cards with API data
    track.innerHTML = '';
    reviews.forEach((item) => track.appendChild(buildReviewCard(item)));
    initReviewsSlider();
  }

  function initReviewsSlider(): void {
    const track = document.querySelector<HTMLElement>('.reviews__track');
    const prevBtn = document.querySelector<HTMLButtonElement>('.reviews__arrow--prev');
    const nextBtn = document.querySelector<HTMLButtonElement>('.reviews__arrow--next');
    if (!track || !prevBtn || !nextBtn) return;
    const t: HTMLElement = track;
    const prev: HTMLButtonElement = prevBtn;
    const next: HTMLButtonElement = nextBtn;

    const cards = Array.from(t.querySelectorAll<HTMLElement>('.reviews__card'));
    let index = 0;
    const total = cards.length;

    function update(): void {
      const perView = getPerView();
      const maxIndex = Math.max(0, total - perView);
      if (index > maxIndex) index = maxIndex;
      const offset = -(index * (100 / perView));
      t.style.transform = `translateX(${offset}%)`;
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex;
    }

    prev.addEventListener('click', () => {
      if (index > 0) { index -= 1; update(); }
    });
    next.addEventListener('click', () => {
      const maxIndex = Math.max(0, total - getPerView());
      if (index < maxIndex) { index += 1; update(); }
    });

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener('resize', () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 150);
    });

    update();
  }

  void loadReviews();
})();
