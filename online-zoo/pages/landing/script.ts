// ─── Mobile side-nav ─────────────────────────────────────────────────────────
(function () {
  const headerBurger = document.getElementById('headerBurger');
  const sideNav = document.getElementById('sideNav');
  const sideNavOverlay = document.getElementById('sideNavOverlay');
  const sideNavClose = document.getElementById('sideNavClose');

  function openSideNav(): void {
    sideNav?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSideNav(): void {
    sideNav?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  headerBurger?.addEventListener('click', openSideNav);
  sideNavClose?.addEventListener('click', closeSideNav);
  sideNavOverlay?.addEventListener('click', closeSideNav);

  document.addEventListener('keydown', function (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      closeSideNav();
    }
  });
})();

// ─── Sliders + Pets from API ─────────────────────────────────────────────────
(function () {
  interface SliderOptions {
    grid: HTMLElement;
    track: HTMLElement;
    cardSelector: string;
    prevBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    getCardsPerPage: () => number;
  }

  function createSlider(options: SliderOptions): void {
    const { grid, track, cardSelector, prevBtn, nextBtn, getCardsPerPage } = options;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(cardSelector));
    let currentIndex = 0;
    let cardWidth = 0;
    let cardGap = 0;
    let perPageCached = 0;

    track.style.willChange = 'transform';

    function layout(): void {
      perPageCached = getCardsPerPage();
      cardGap = parseFloat(getComputedStyle(track).columnGap) || 0;
      cardWidth = (grid.offsetWidth - cardGap * (perPageCached - 1)) / perPageCached;
      cards.forEach((card) => {
        card.style.width = `${cardWidth}px`;
      });
      const maxIndex = Math.max(0, cards.length - perPageCached);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      applyOffset('none');
    }

    function applyOffset(transition: string): void {
      const offset = currentIndex * (cardWidth + cardGap);
      track.style.transition = transition;
      track.style.transform = `translateX(-${offset}px)`;
      const maxIndex = Math.max(0, cards.length - perPageCached);
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        applyOffset('transform 0.4s ease');
      }
    });

    nextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, cards.length - perPageCached);
      if (currentIndex < maxIndex) {
        currentIndex++;
        applyOffset('transform 0.4s ease');
      }
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    });

    layout();
  }

  // ─── Pets from API ──────────────────────────────────────────────────────────

  interface Pet {
    id: number;
    name: string;
    commonName: string;
    description: string;
  }

  interface PetsApiResponse {
    data: Pet[];
  }

  const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
  const IMG_BASE = '../../assets/images/';

  const PET_IMAGES: Record<number, string> = {
    1: 'rectangle-giant-panda.jpg',
    2: 'rectangle-madagascarian-lemur.jpg',
    3: 'rectangle-gorilla-in-congo.jpg',
    4: 'rectangle-chinese-alligator.jpg',
    5: 'rectangle-west-end-bald-eagles.jpg',
    6: 'rectangle-australian-koala.jpg',
    7: 'rectangle-african-lion.jpg',
    8: 'rectangle-sumatran-tiger.jpg',
  };

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildPetCard(pet: Pet): string {
    const imgFile = PET_IMAGES[pet.id];
    const imgTag = imgFile
      ? `<img src="${IMG_BASE}${imgFile}" alt="${escapeHtml(pet.commonName)}">`
      : `<img src="../../assets/icons/pet-placeholder.svg" alt="No photo yet" class="pets__card-placeholder">`;
    return `
      <div class="pets__card">
        <div class="pets__card-img-wrap">
          <span class="pets__card-name">${escapeHtml(pet.name)}</span>
          ${imgTag}
        </div>
        <div class="pets__card-body">
          <p class="subheader">${escapeHtml(pet.commonName)}</p>
          <p>${escapeHtml(pet.description)}</p>
          <a class="pets__card-link" href="../zoos/">View Live Cam</a>
        </div>
      </div>`;
  }

  function initPetsSlider(): void {
    const grid = document.querySelector<HTMLElement>('.pets__grid');
    const track = document.querySelector<HTMLElement>('.pets__track');
    const prevBtn = document.querySelector<HTMLButtonElement>('.pets__arrow--prev');
    const nextBtn = document.querySelector<HTMLButtonElement>('.pets__arrow--next');
    if (!grid || !track || !prevBtn || !nextBtn) return;
    createSlider({
      grid,
      track,
      cardSelector: '.pets__card',
      prevBtn,
      nextBtn,
      getCardsPerPage(): number {
        const w = window.innerWidth;
        if (w <= 320) return 1;
        if (w <= 640) return 2;
        if (w <= 1200) return 3;
        return 4;
      },
    });
  }

  async function loadPets(): Promise<void> {
    const track = document.querySelector<HTMLElement>('.pets__track');
    if (!track) {
      initPetsSlider();
      return;
    }
    track.innerHTML = '';
    try {
      const res = await fetch(`${API_BASE}/pets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PetsApiResponse;
      if (json.data.length > 0) {
        track.innerHTML = json.data.map(buildPetCard).join('');
      }
      initPetsSlider();
    } catch (err) {
      console.error('Failed to load pets:', err);
      const grid = track.closest<HTMLElement>('.pets__grid');
      if (grid) {
        grid.innerHTML = `
          <div class="pets__error">
            <p>Could not load pets. Please refresh the page.</p>
          </div>`;
      }
    }
  }

  void loadPets();

  // ─── Reviews slider ─────────────────────────────────────────────────────────

  const reviewsGrid = document.querySelector<HTMLElement>('.reviews__grid');
  const reviewsTrack = document.querySelector<HTMLElement>('.reviews__track');
  const reviewsPrev = document.querySelector<HTMLButtonElement>('.reviews__arrow--prev');
  const reviewsNext = document.querySelector<HTMLButtonElement>('.reviews__arrow--next');

  if (reviewsGrid && reviewsTrack && reviewsPrev && reviewsNext) {
    createSlider({
      grid: reviewsGrid,
      track: reviewsTrack,
      cardSelector: '.reviews__card',
      prevBtn: reviewsPrev,
      nextBtn: reviewsNext,
      getCardsPerPage(): number {
        return window.innerWidth <= 640 ? 1 : 2;
      },
    });
  }
})();
