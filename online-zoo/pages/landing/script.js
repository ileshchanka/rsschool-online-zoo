// ─── Mobile side-nav ─────────────────────────────────────────────────────────
(function () {
    const headerBurger = document.getElementById('headerBurger');
    const sideNav = document.getElementById('sideNav');
    const sideNavOverlay = document.getElementById('sideNavOverlay');
    const sideNavClose = document.getElementById('sideNavClose');
    function openSideNav() {
        sideNav?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }
    function closeSideNav() {
        sideNav?.classList.remove('is-open');
        document.body.style.overflow = '';
    }
    headerBurger?.addEventListener('click', openSideNav);
    sideNavClose?.addEventListener('click', closeSideNav);
    sideNavOverlay?.addEventListener('click', closeSideNav);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSideNav();
        }
    });
})();
// ─── Sliders + Pets from API ─────────────────────────────────────────────────
(function () {
    function createSlider(options) {
        const { grid, track, cardSelector, prevBtn, nextBtn, getCardsPerPage } = options;
        const cards = Array.from(track.querySelectorAll(cardSelector));
        let currentIndex = 0;
        let cardWidth = 0;
        let cardGap = 0;
        let perPageCached = 0;
        track.style.willChange = 'transform';
        function layout() {
            perPageCached = getCardsPerPage();
            cardGap = parseFloat(getComputedStyle(track).columnGap) || 0;
            cardWidth = (grid.offsetWidth - cardGap * (perPageCached - 1)) / perPageCached;
            cards.forEach((card) => {
                card.style.width = `${cardWidth}px`;
            });
            const maxIndex = Math.max(0, cards.length - perPageCached);
            if (currentIndex > maxIndex)
                currentIndex = maxIndex;
            applyOffset('none');
        }
        function applyOffset(transition) {
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
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layout, 150);
        });
        layout();
    }
    const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
    const IMG_BASE = '../../assets/images/';
    const PET_IMAGES = {
        1: 'rectangle-giant-panda.jpg',
        2: 'rectangle-madagascarian-lemur.jpg',
        3: 'rectangle-gorilla-in-congo.jpg',
        4: 'rectangle-chinese-alligator.jpg',
        5: 'rectangle-west-end-bald-eagles.jpg',
        6: 'rectangle-australian-koala.jpg',
        7: 'rectangle-african-lion.jpg',
        8: 'rectangle-sumatran-tiger.jpg',
    };
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    function buildPetCard(pet) {
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
    function initPetsSlider() {
        const grid = document.querySelector('.pets__grid');
        const track = document.querySelector('.pets__track');
        const prevBtn = document.querySelector('.pets__arrow--prev');
        const nextBtn = document.querySelector('.pets__arrow--next');
        if (!grid || !track || !prevBtn || !nextBtn)
            return;
        createSlider({
            grid,
            track,
            cardSelector: '.pets__card',
            prevBtn,
            nextBtn,
            getCardsPerPage() {
                const w = window.innerWidth;
                if (w <= 320)
                    return 1;
                if (w <= 640)
                    return 2;
                if (w <= 1200)
                    return 3;
                return 4;
            },
        });
    }
    async function loadPets() {
        const track = document.querySelector('.pets__track');
        if (!track) {
            initPetsSlider();
            return;
        }
        track.innerHTML = '';
        try {
            const res = await fetch(`${API_BASE}/pets`);
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const json = (await res.json());
            if (json.data.length > 0) {
                track.innerHTML = json.data.map(buildPetCard).join('');
            }
            initPetsSlider();
        }
        catch (err) {
            console.error('Failed to load pets:', err);
            const grid = track.closest('.pets__grid');
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
    const reviewsGrid = document.querySelector('.reviews__grid');
    const reviewsTrack = document.querySelector('.reviews__track');
    const reviewsPrev = document.querySelector('.reviews__arrow--prev');
    const reviewsNext = document.querySelector('.reviews__arrow--next');
    if (reviewsGrid && reviewsTrack && reviewsPrev && reviewsNext) {
        createSlider({
            grid: reviewsGrid,
            track: reviewsTrack,
            cardSelector: '.reviews__card',
            prevBtn: reviewsPrev,
            nextBtn: reviewsNext,
            getCardsPerPage() {
                return window.innerWidth <= 640 ? 1 : 2;
            },
        });
    }
})();
export {};
//# sourceMappingURL=script.js.map