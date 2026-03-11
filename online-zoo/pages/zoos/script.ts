// Zoom sidebar toggle
(function () {
  const trigger = document.getElementById('zoosSidebarTrigger');
  const overlay = document.getElementById('zoosSidebarOverlay');
  const sidebar = document.querySelector<HTMLElement>('.zoos-sidebar');

  function openSidebar(): void {
    sidebar?.classList.add('zoos-sidebar--open');
    overlay?.classList.add('zoos-sidebar-overlay--visible');
  }

  function closeSidebar(): void {
    sidebar?.classList.remove('zoos-sidebar--open');
    overlay?.classList.remove('zoos-sidebar-overlay--visible');
  }

  trigger?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);

  const expandBtn = document.querySelector<HTMLButtonElement>('.zoos-sidebar__expand');
  expandBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('zoos-sidebar--expanded');
  });
})();

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

// Zoos: fetch pets and populate
(function () {
  interface Pet {
    id: number;
    name: string;
    commonName: string;
    description: string;
  }

  interface PetDetail {
    id: number;
    name: string;
    commonName: string;
    scientificName: string;
    type: string;
    size: string;
    diet: string;
    habitat: string;
    range: string;
    latitude: string;
    longitude: string;
    description: string;
    detailedDescription: string;
  }

  interface PetsApiResponse {
    data: Pet[];
  }

  interface PetDetailApiResponse {
    data: PetDetail;
  }

  const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

  const IMG_BASE = '../../assets/images/';

  // Map pet ID to static image filenames (for the 8 pets that have matching images)
  const PLAYER_IMAGES: Record<number, string> = {
    1: 'youtube-player-giant-panda.jpg',
    2: 'youtube-player-lemur.jpg',
    3: 'youtube-player-gorilla.jpg',
    4: 'youtube-player-alligator.jpg',
    5: 'youtube-player-eagles.jpg',
    6: 'youtube-player-koala.jpg',
    7: 'youtube-player-lion.jpg',
    8: 'youtube-player-tiger.jpg',
  };

  const INFO_IMAGES: Record<number, string> = {
    1: 'rectangle-giant-panda.jpg',
    2: 'rectangle-madagascarian-lemur.jpg',
    3: 'rectangle-gorilla-in-congo.jpg',
    4: 'rectangle-chinese-alligator.jpg',
    5: 'rectangle-west-end-bald-eagles.jpg',
    6: 'rectangle-australian-koala.jpg',
    7: 'rectangle-african-lion.jpg',
    8: 'rectangle-sumatran-tiger.jpg',
  };

  const FALLBACK_PLAYER = 'youtube-player-lemur.jpg';
  const FALLBACK_INFO = 'rectangle-madagascarian-lemur.jpg';

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setEl(id: string, html: string): void {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setAttr(id: string, attr: string, value: string): void {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }

  function populateContent(pet: PetDetail): void {
    setEl('animalTitle', escapeHtml(`${pet.name} the ${pet.commonName}`));
    setEl('donationTitle', escapeHtml(`Provide ${pet.name} the ${pet.commonName} with food!`));
    setEl('donationText', escapeHtml(pet.description));
    setEl('factText', escapeHtml(pet.detailedDescription.slice(0, 200) + '…'));
    setEl('description', escapeHtml(pet.detailedDescription));

    const playerSrc = IMG_BASE + (PLAYER_IMAGES[pet.id] ?? FALLBACK_PLAYER);
    setAttr('playerImg', 'src', playerSrc);
    setAttr('playerImg', 'alt', escapeHtml(pet.commonName));

    const infoSrc = IMG_BASE + (INFO_IMAGES[pet.id] ?? FALLBACK_INFO);
    setAttr('infoPhoto', 'src', infoSrc);
    setAttr('infoPhoto', 'alt', escapeHtml(pet.commonName));

    const tableRows: [string, string][] = [
      ['Common name', pet.commonName],
      ['Scientific name', pet.scientificName],
      ['Type', pet.type],
      ['Size', pet.size],
      ['Diet', pet.diet],
      ['Habitat', pet.habitat],
      ['Range', pet.range],
      ['Latitude', pet.latitude],
      ['Longitude', pet.longitude],
    ];

    const tbody = document.getElementById('infoTable');
    if (tbody) {
      tbody.innerHTML = tableRows
        .map(
          ([label, value]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
        )
        .join('');
    }

    // Populate extra cam cards with other pets
    populateCamCards(pet.id);
  }

  let allPets: Pet[] = [];

  function populateCamCards(activePetId: number): void {
    const container = document.getElementById('camCards');
    if (!container) return;
    const others = allPets.filter((p) => p.id !== activePetId).slice(0, 5);
    container.innerHTML = others
      .map((p) => {
        const imgSrc = IMG_BASE + (INFO_IMAGES[p.id] ?? FALLBACK_INFO);
        return `<div class="zoos-cam-card">
          <img src="${imgSrc}" alt="${escapeHtml(p.commonName)}">
          <span>${escapeHtml(p.name)}</span>
        </div>`;
      })
      .join('');
  }

  async function fetchPetDetail(id: number): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/pets/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PetDetailApiResponse;
      populateContent(json.data);
    } catch (err) {
      console.error('Failed to fetch pet detail:', err);
    }
  }

  function buildSidebarNav(pets: Pet[]): void {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    nav.innerHTML = pets
      .map(
        (pet) =>
          `<button class="zoos-sidebar__btn" data-pet-id="${pet.id}" aria-label="View ${escapeHtml(pet.commonName)}">
            <span class="zoos-sidebar__btn-name">${escapeHtml(pet.name)}</span>
            <span class="zoos-sidebar__btn-species">${escapeHtml(pet.commonName)}</span>
          </button>`,
      )
      .join('');

    nav.addEventListener('click', (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pet-id]');
      if (!btn) return;
      const petId = Number(btn.dataset['petId']);
      if (!Number.isFinite(petId)) return;

      nav.querySelectorAll<HTMLButtonElement>('.zoos-sidebar__btn').forEach((b) => {
        b.classList.remove('zoos-sidebar__btn--active');
      });
      btn.classList.add('zoos-sidebar__btn--active');

      void fetchPetDetail(petId);
    });
  }

  async function init(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/pets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PetsApiResponse;
      allPets = json.data;
      buildSidebarNav(allPets);

      // Load first pet by default
      const firstPet = allPets[0];
      if (firstPet !== undefined) {
        await fetchPetDetail(firstPet.id);
        const firstBtn = document.querySelector<HTMLButtonElement>('.zoos-sidebar__btn');
        firstBtn?.classList.add('zoos-sidebar__btn--active');
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  }

  void init();
})();
