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
        const originalCards = Array.from(track.querySelectorAll(cardSelector));
        const totalOriginal = originalCards.length;
        if (totalOriginal === 0)
            return;
        let perPageCached = 0;
        let cardWidth = 0;
        let cardGap = 0;
        let currentIndex = 0;
        let allCards = [];
        track.style.willChange = 'transform';
        function buildClones() {
            perPageCached = getCardsPerPage();
            // Remove old clones
            track.querySelectorAll('[data-clone]').forEach((el) => el.remove());
            // Append clones of the first perPage cards to the end
            for (let i = 0; i < perPageCached; i++) {
                const clone = originalCards[i % totalOriginal].cloneNode(true);
                clone.setAttribute('data-clone', '');
                track.appendChild(clone);
            }
            // Prepend clones of the last perPage cards to the start
            for (let i = perPageCached - 1; i >= 0; i--) {
                const srcIndex = (totalOriginal - 1 - i + totalOriginal) % totalOriginal;
                const clone = originalCards[srcIndex].cloneNode(true);
                clone.setAttribute('data-clone', '');
                track.prepend(clone);
            }
            allCards = Array.from(track.querySelectorAll(cardSelector));
        }
        function layout() {
            buildClones();
            cardGap = parseFloat(getComputedStyle(track).columnGap) || 0;
            cardWidth = (grid.offsetWidth - cardGap * (perPageCached - 1)) / perPageCached;
            allCards.forEach((card) => {
                card.style.width = `${cardWidth}px`;
            });
            // Reset to the first real card (offset by perPageCached clones prepended)
            currentIndex = perPageCached;
            applyOffset('none');
        }
        function applyOffset(transition) {
            const offset = currentIndex * (cardWidth + cardGap);
            track.style.transition = transition;
            track.style.transform = `translateX(-${offset}px)`;
        }
        /** Normalize currentIndex into the real-card range without animation */
        function wrapIndex() {
            if (currentIndex >= totalOriginal + perPageCached) {
                currentIndex -= totalOriginal;
                applyOffset('none');
            }
            else if (currentIndex < perPageCached) {
                currentIndex += totalOriginal;
                applyOffset('none');
            }
        }
        track.addEventListener('transitionend', wrapIndex);
        function slide(delta) {
            // If mid-animation, snap to the target position instantly and wrap
            wrapIndex();
            // Force reflow so the instant snap is painted before the new animation
            void track.offsetWidth;
            currentIndex += delta;
            applyOffset('transform 0.4s ease');
        }
        prevBtn.addEventListener('click', () => slide(-1));
        nextBtn.addEventListener('click', () => slide(1));
        prevBtn.disabled = false;
        nextBtn.disabled = false;
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
            <p>Something went wrong. Please, refresh the page</p>
          </div>`;
            }
        }
    }
    void loadPets();
    function buildReviewCard(item) {
        return `
      <div class="reviews__card">
        <img class="reviews__card-quote" src="../../assets/icons/quotes.svg" alt="">
        <h4 class="reviews__card-location">${escapeHtml(item.city)}, ${escapeHtml(item.month)} ${item.year}</h4>
        <p class="reviews__card-text">${escapeHtml(item.text)}</p>
        <span class="reviews__card-author">${escapeHtml(item.name)}</span>
      </div>`;
    }
    function initReviewsSlider() {
        const grid = document.querySelector('.reviews__grid');
        const track = document.querySelector('.reviews__track');
        const prevBtn = document.querySelector('.reviews__arrow--prev');
        const nextBtn = document.querySelector('.reviews__arrow--next');
        if (!grid || !track || !prevBtn || !nextBtn)
            return;
        createSlider({
            grid,
            track,
            cardSelector: '.reviews__card',
            prevBtn,
            nextBtn,
            getCardsPerPage() {
                return window.innerWidth <= 640 ? 1 : 2;
            },
        });
    }
    async function loadReviews() {
        const track = document.querySelector('.reviews__track');
        if (!track) {
            initReviewsSlider();
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/feedback`);
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const json = (await res.json());
            if (json.data.length > 0) {
                track.innerHTML = json.data.map(buildReviewCard).join('');
            }
            initReviewsSlider();
        }
        catch (err) {
            console.error('Failed to load reviews:', err);
            const grid = track.closest('.reviews__grid');
            if (grid) {
                grid.innerHTML = `
          <div class="reviews__error">
            <p>Something went wrong. Please, refresh the page</p>
          </div>`;
            }
        }
    }
    void loadReviews();
})();
export {};
//# sourceMappingURL=script.js.map