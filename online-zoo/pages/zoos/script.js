const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
const IMG_BASE = '../../assets/images/';
const ICON_BASE = '../../assets/icons/';
const PET_IMAGES = {
    1: 'cameras/1.jpg',
    2: 'cameras/2.jpg',
    3: 'cameras/3.jpg',
    4: 'cameras/4.jpg',
    5: 'cameras/5.jpg',
    6: 'cameras/6.jpg',
    7: 'cameras/7.jpg',
    8: 'cameras/8.jpg',
};
const PET_ICONS = {
    1: 'panda.svg',
    2: 'lemur.svg',
    3: 'gorilla.svg',
    4: 'alligator.svg',
    5: 'eagle.svg',
    6: 'coala.svg',
    7: 'lion.svg',
    8: 'tiger.svg',
};
const PET_PLAYER_IMAGES = {
    1: 'youtube-player-giant-panda.jpg',
    2: 'youtube-player-lemur.jpg',
    3: 'youtube-player-gorilla.jpg',
    5: 'youtube-player-eagles.jpg',
};
const PET_CAM_IMAGES = {
    1: [
        { img: 'panda-additional-cam-card-1.jpg', label: 'CAM 1' },
        { img: 'panda-additional-cam-card-2.jpg', label: 'CAM 2' },
        { img: 'panda-additional-cam-card-3.jpg', label: 'CAM 3' },
    ],
    2: [
        { img: 'lemur-additional-cam-card-1.jpg', label: 'CAM 1' },
        { img: 'lemur-additional-cam-card-2.jpg', label: 'CAM 2' },
        { img: 'lemur-additional-cam-card-3.jpg', label: 'CAM 3' },
    ],
    3: [
        { img: 'gorilla-additional-cam-card-1.jpg', label: 'CAM 1' },
        { img: 'gorilla-additional-cam-card-2.jpg', label: 'CAM 2' },
        { img: 'gorilla-additional-cam-card-3.jpg', label: 'CAM 3' },
    ],
    5: [
        { img: 'eagles-additional-cam-card-1.jpg', label: 'CAM 1' },
        { img: 'eagles-additional-cam-card-2.jpg', label: 'CAM 2' },
        { img: 'eagles-additional-cam-card-3.jpg', label: 'CAM 3' },
    ],
};
let cameras = [];
let pets = [];
let activeIndex = 0;
function getPetById(petId) {
    return pets.find((p) => p.id === petId);
}
function getIconForPet(petId) {
    return ICON_BASE + (PET_ICONS[petId] ?? 'pet-placeholder.svg');
}
function getImageForPet(petId) {
    return IMG_BASE + (PET_IMAGES[petId] ?? 'cameras/1.jpg');
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function parseCoord(raw) {
    const match = raw.match(/([\d.]+)°?\s*([NSEW])/i);
    if (!match)
        return 0;
    const value = parseFloat(match[1]);
    const dir = match[2].toUpperCase();
    return dir === 'S' || dir === 'W' ? -value : value;
}
function openMapModal(lat, lng, title) {
    let modal = document.getElementById('mapModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mapModal';
        modal.className = 'map-modal';
        modal.innerHTML = `
      <div class="map-modal__overlay"></div>
      <div class="map-modal__window">
        <button class="map-modal__close" aria-label="Close">&times;</button>
        <h3 class="map-modal__title"></h3>
        <iframe class="map-modal__iframe" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    `;
        document.body.appendChild(modal);
        modal.querySelector('.map-modal__overlay')?.addEventListener('click', closeMapModal);
        modal.querySelector('.map-modal__close')?.addEventListener('click', closeMapModal);
    }
    const titleEl = modal.querySelector('.map-modal__title');
    if (titleEl)
        titleEl.textContent = title;
    const iframe = modal.querySelector('.map-modal__iframe');
    if (iframe) {
        iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=6&output=embed`;
    }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}
function closeMapModal() {
    const modal = document.getElementById('mapModal');
    if (!modal)
        return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    const iframe = modal.querySelector('.map-modal__iframe');
    if (iframe)
        iframe.src = '';
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
        closeMapModal();
});
function renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav)
        return;
    nav.innerHTML = '';
    cameras.forEach((camera, i) => {
        const pet = getPetById(camera.petId);
        const title = pet ? `${pet.name} — ${pet.commonName}` : `Camera ${camera.id}`;
        const btn = document.createElement('button');
        btn.className = 'zoos-sidebar__item' + (i === activeIndex ? ' active' : '');
        btn.setAttribute('aria-label', title);
        const iconSrc = getIconForPet(camera.petId);
        const labelText = escapeHtml(camera.text);
        btn.innerHTML = `<span class="zoos-sidebar__icon"><img src="${iconSrc}" alt="${escapeHtml(title)}"></span><span class="zoos-sidebar__label">${labelText}</span>`;
        btn.addEventListener('click', () => {
            activeIndex = i;
            renderSidebar();
            selectPet(camera.petId);
        });
        nav.appendChild(btn);
    });
}
const contentRoot = document.getElementById('zoosContentRoot');
function showContentOverlay() {
    let overlay = document.getElementById('contentOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'contentOverlay';
        overlay.className = 'zoos-content-overlay';
        overlay.innerHTML = `
      <div class="zoos-content-overlay__spinner"></div>
      <div class="zoos-content-overlay__error">
        <div class="zoos-loader__error-icon">!</div>
        <p class="zoos-loader__error-text">Something went wrong. Please, refresh the page</p>
      </div>
    `;
        contentRoot?.appendChild(overlay);
    }
    overlay.classList.remove('is-hidden', 'is-error');
}
function hideContentOverlay() {
    const overlay = document.getElementById('contentOverlay');
    overlay?.classList.add('is-hidden');
}
function showContentOverlayError() {
    const overlay = document.getElementById('contentOverlay');
    overlay?.classList.add('is-error');
}
function buildContent(camera, pet, detail) {
    if (!contentRoot)
        return;
    const existing = contentRoot.querySelector('.zoos-content, .zoos-donation');
    if (existing) {
        contentRoot.querySelectorAll('.zoos-content, .zoos-donation').forEach((el) => el.remove());
    }
    const title = `${detail.commonName} Cams`;
    const playerImgSrc = PET_PLAYER_IMAGES[camera.petId]
        ? IMG_BASE + PET_PLAYER_IMAGES[camera.petId]
        : getImageForPet(camera.petId);
    const photoSrc = getImageForPet(camera.petId);
    const cams = PET_CAM_IMAGES[camera.petId] ?? [{ img: PET_IMAGES[camera.petId] ?? 'cameras/1.jpg', label: 'CAM 1' }];
    let camCardsHtml = '';
    cams.forEach((cam, i) => {
        camCardsHtml += `
      <a class="zoos-cam-card${i === 0 ? ' active' : ''}" href="https://www.youtube.com/c/RSSchool/" target="_blank" rel="noopener noreferrer">
        <img src="${IMG_BASE + cam.img}" alt="${escapeHtml(cam.label)}">
        <div class="zoos-cam-card__play"></div>
      </a>
    `;
    });
    const infoRows = [
        ['Common name:', detail.commonName],
        ['Scientific name:', detail.scientificName],
        ['Type:', detail.type],
        ['Size:', detail.size],
        ['Diet:', detail.diet],
        ['Habitat:', detail.habitat],
        ['Range:', detail.range],
    ];
    let infoRowsHtml = '';
    infoRows.forEach(([key, value]) => {
        if (key === 'Range:') {
            infoRowsHtml += `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(value)} <button class="zoos-info__map-link" data-lat="${escapeHtml(detail.latitude)}" data-lng="${escapeHtml(detail.longitude)}" data-title="${escapeHtml(detail.commonName)}">View Map</button></td></tr>`;
        }
        else {
            infoRowsHtml += `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td></tr>`;
        }
    });
    const topSection = document.createElement('div');
    topSection.className = 'zoos-content container';
    topSection.innerHTML = `
    <div class="zoos-content__header">
      <h1 class="zoos-content__title">${escapeHtml(title)}</h1>
      <button class="zoos-content__donate-btn button_orange">Donate Now</button>
    </div>
    <div class="zoos-player">
      <div class="zoos-player__frame">
        <img class="zoos-player__img" src="${playerImgSrc}" alt="${escapeHtml(title)}">
        <a class="zoos-player__link" href="https://www.youtube.com/c/RSSchool/" target="_blank" rel="noopener noreferrer" aria-label="Watch on YouTube"></a>
        <div class="zoos-player__overlay">
          <button class="zoos-player__play" aria-label="Play"></button>
        </div>
      </div>
    </div>
    <div class="zoos-more-views">
      <h2 class="visually-hidden">Live Views</h2>
      <h3 class="zoos-more-views__title">More Live Views</h3>
      <div class="zoos-more-views__slider">
        <button class="zoos-more-views__arrow" aria-label="Previous">&#8592;</button>
        <div class="zoos-more-views__cards">${camCardsHtml}</div>
        <button class="zoos-more-views__arrow" aria-label="Next">&#8594;</button>
      </div>
    </div>
  `;
    const donationSection = document.createElement('section');
    donationSection.className = 'zoos-donation';
    donationSection.innerHTML = `
    <div class="zoos-donation__inner container">
      <div class="zoos-donation__content">
        <h3 class="zoos-donation__title">Support ${escapeHtml(pet.name)} the ${escapeHtml(detail.commonName)}!</h3>
        <p class="zoos-donation__text">${escapeHtml(detail.description)}</p>
      </div>
      <div class="zoos-donation__form">
        <p class="subheader">Quick Donate</p>
        <form class="donate-form">
          <input class="donate-form__input" placeholder="$ Donation Amount">
          <button class="donate-form__btn button_orange" type="submit"></button>
        </form>
      </div>
    </div>
  `;
    const bottomSection = document.createElement('div');
    bottomSection.className = 'zoos-content container';
    bottomSection.innerHTML = `
    <div class="zoos-fact">
      <h2 class="zoos-fact__title">Did you know?</h2>
      <p class="zoos-fact__text">${escapeHtml(detail.detailedDescription)}</p>
    </div>
    <div class="zoos-info">
      <table class="zoos-info__table">
        <tbody>${infoRowsHtml}</tbody>
      </table>
      <img class="zoos-info__photo" src="${photoSrc}" alt="${escapeHtml(title)}">
    </div>
    <p class="zoos-description">${escapeHtml(detail.description)}</p>
  `;
    const overlay = document.getElementById('contentOverlay');
    if (overlay) {
        contentRoot.insertBefore(bottomSection, overlay);
        contentRoot.insertBefore(donationSection, bottomSection);
        contentRoot.insertBefore(topSection, donationSection);
    }
    else {
        contentRoot.appendChild(topSection);
        contentRoot.appendChild(donationSection);
        contentRoot.appendChild(bottomSection);
    }
    const mapBtn = bottomSection.querySelector('.zoos-info__map-link');
    mapBtn?.addEventListener('click', () => {
        const lat = parseCoord(mapBtn.dataset['lat'] ?? '');
        const lng = parseCoord(mapBtn.dataset['lng'] ?? '');
        const mapTitle = mapBtn.dataset['title'] ?? '';
        openMapModal(lat, lng, mapTitle);
    });
    const donateBtn = topSection.querySelector('.zoos-content__donate-btn');
    donateBtn?.addEventListener('click', () => {
        window
            .openDonateStepsModal(camera.petId);
    });
}
async function selectPet(petId) {
    const camera = cameras[activeIndex];
    const pet = getPetById(petId);
    if (!camera || !pet)
        return;
    showContentOverlay();
    try {
        const res = await fetch(`${API_BASE}/pets/${petId}`);
        if (!res.ok)
            throw new Error('Failed to fetch pet detail');
        const json = (await res.json());
        buildContent(camera, pet, json.data);
        hideContentOverlay();
    }
    catch {
        showContentOverlayError();
    }
}
const zoosMain = document.querySelector('.zoos-main');
const zoosLoader = document.getElementById('zoosLoader');
function showLoader() {
    zoosMain?.classList.add('zoos-main--loading');
    zoosLoader?.classList.remove('is-hidden');
}
function hideLoader() {
    zoosMain?.classList.remove('zoos-main--loading');
    zoosLoader?.classList.add('is-hidden');
}
function buildSidebar() {
    const layout = document.getElementById('zoosLayout');
    if (!layout)
        return;
    const overlay = document.createElement('div');
    overlay.className = 'zoos-sidebar-overlay';
    overlay.id = 'zoosSidebarOverlay';
    const trigger = document.createElement('button');
    trigger.className = 'zoos-sidebar-trigger';
    trigger.id = 'zoosSidebarTrigger';
    trigger.setAttribute('aria-label', 'Open camera list');
    trigger.innerHTML = `<span class="zoos-sidebar-trigger__live">LIVE</span><img src="${ICON_BASE}live-camera.svg" alt="Live">`;
    const aside = document.createElement('aside');
    aside.className = 'zoos-sidebar';
    aside.innerHTML = `
    <div class="zoos-sidebar__header">
      <div class="zoos-sidebar__live">
        <span class="zoos-sidebar__live-text">LIVE</span>
        <img class="zoos-sidebar__live-icon" src="${ICON_BASE}live-camera.svg" alt="Live">
      </div>
      <button class="zoos-sidebar__expand" aria-label="Expand sidebar"><img src="${ICON_BASE}expand.svg" alt="Expand"></button>
    </div>
    <nav class="zoos-sidebar__nav" id="sidebarNav"></nav>
    <button class="zoos-sidebar__scroll-down" aria-label="Scroll down">&#8964;</button>
  `;
    layout.prepend(aside);
    layout.prepend(trigger);
    layout.prepend(overlay);
    const expandBtn = aside.querySelector('.zoos-sidebar__expand');
    function openSidebar() {
        aside.classList.add('is-expanded');
    }
    function closeSidebar() {
        aside.classList.remove('is-expanded');
    }
    expandBtn?.addEventListener('click', () => {
        if (aside.classList.contains('is-expanded')) {
            closeSidebar();
        }
        else {
            openSidebar();
        }
    });
    overlay.addEventListener('click', closeSidebar);
    trigger.addEventListener('click', openSidebar);
}
async function loadCameras() {
    showLoader();
    try {
        const [camRes, petRes] = await Promise.all([
            fetch(`${API_BASE}/cameras`),
            fetch(`${API_BASE}/pets`),
        ]);
        if (!camRes.ok || !petRes.ok) {
            throw new Error('API request failed');
        }
        const camData = (await camRes.json());
        const petData = (await petRes.json());
        cameras = camData.data;
        pets = petData.data;
        activeIndex = 0;
        buildSidebar();
        renderSidebar();
        await selectPet(cameras[0].petId);
    }
    catch {
        zoosLoader?.classList.add('is-error');
        return;
    }
    hideLoader();
}
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
loadCameras();
export {};
