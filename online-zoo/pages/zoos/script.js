const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
const IMG_BASE = '../../assets/images/';
const ICON_BASE = '../../assets/icons/';
// ─── Image mapping by pet ID ─────────────────────────────────────────────────
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
// ─── Enriched data for original animals ──────────────────────────────────────
const ANIMAL_DETAILS = {
    1: {
        icon: 'panda.svg',
        title: 'Live Panda Cams',
        playerImg: 'youtube-player-giant-panda.jpg',
        cams: [
            { img: 'panda-additional-cam-card-1.jpg', label: 'CAM 1' },
            { img: 'panda-additional-cam-card-2.jpg', label: 'CAM 2' },
            { img: 'panda-additional-cam-card-3.jpg', label: 'CAM 3' },
        ],
        donationTitle: 'Make the Bamboo Donation!',
        donationText: 'Our process for bamboo donations first starts with a site evaluation. It is important that our team sees where the bamboo is growing, then determining if the bamboo is a species that our animals are currently eating. Thank you for your interest in donating bamboo for our pandas.',
        fact: 'Pandas are often seen eating in a relaxed sitting posture, with their hind legs stretched out before them. They may appear sedentary, but they are skilled tree-climbers and efficient swimmers.',
        info: {
            'Common name:': 'Giant Panda',
            'Scientific name:': 'Ailuropoda melanoleuca',
            'Type:': 'Mammals',
            'Size:': '4 to 5 feet',
            'Diet:': 'Omnivore',
            'Habitat:': 'Forests',
            'Range:': 'Eastern Asia',
        },
        photo: 'rectangle-giant-panda.jpg',
        description: 'Giant pandas are very unusual animals that eat almost exclusively bamboo, which is very low in nutrients. Because of this, they have many unique adaptations for their low-energy lifestyle. Giant pandas are solitary. They have a highly developed sense of smell that males use to avoid each other and to find females for mating in the spring. After a five-month pregnancy, females give birth to a cub or two, though they cannot care for both twins. The blind infants weigh only 5 ounces at birth and cannot crawl until they reach three months of age. They are born white, and develop their much loved coloring later. Habitat loss is the primary threat to this species. Its popularity around the world has helped the giant panda become the focus of successful conservation programs.',
    },
    2: {
        icon: 'lemur.svg',
        title: 'Lemurs Cams',
        playerImg: 'youtube-player-lemur.jpg',
        cams: [
            { img: 'lemur-additional-cam-card-1.jpg', label: 'CAM 1' },
            { img: 'lemur-additional-cam-card-2.jpg', label: 'CAM 2' },
            { img: 'lemur-additional-cam-card-3.jpg', label: 'CAM 3' },
        ],
        donationTitle: 'Provide Andy the Lemur with Fruits!',
        donationText: 'More than 90% of lemur species are endangered and might face extinction in the nearest future. Watch the ring-tailed lemurs play and climb in this soothing setting and support them by donating for the fruits they adore.',
        fact: 'A ring-tailed lemur mob will gather in open areas of the forest to sunbathe. They sit in what some call a "yoga position" with their bellies toward the sun and their arms and legs stretched out to the sides.',
        info: {
            'Common name:': 'Ring-Tailed Lemur',
            'Scientific name:': 'Lemur catta',
            'Type:': 'Mammals',
            'Size:': 'Head and body: 17.75 inches; tail: 21.75 inches',
            'Diet:': 'Herbivore',
            'Habitat:': 'Arid, open areas and forests',
            'Range:': 'Southeast Asia',
        },
        photo: 'rectangle-madagascarian-lemur.jpg',
        description: "Ring-tailed lemurs are named for the 13 alternating black and white bands that adorn their tails. Unlike most other lemurs, ringtails spend 40 percent of their time on the ground, moving quadrupedally along the forest floor. Ring-tailed lemurs live in southwestern Madagascar, in arid, open areas and forests in territories that range from 15 to 57 acres (0.06 to 0.2 square kilometers) in size. As with all lemurs, olfactory communication is important for ringtails. Ring-tailed lemurs have scent glands on their wrists and chests that they use to mark their foraging routes. Ringtails eat leaves, flowers and insects. They can also eat fruit, herbs and small vertebrates. Females usually give birth to their first baby when they are three years old, and usually once a year every year after that. All adult females participate in raising the offspring of the group. The median life expectancy for a ring-tailed lemur is about 16 years.",
    },
    3: {
        icon: 'gorilla.svg',
        title: 'Gorillas Cams',
        playerImg: 'youtube-player-gorilla.jpg',
        cams: [
            { img: 'gorilla-additional-cam-card-1.jpg', label: 'CAM 1' },
            { img: 'gorilla-additional-cam-card-2.jpg', label: 'CAM 2' },
            { img: 'gorilla-additional-cam-card-3.jpg', label: 'CAM 3' },
        ],
        donationTitle: 'Make a Difference for the Gorillas!',
        donationText: 'It is our goal to ensure the conservation and restoration of the gorilla population and their habitat in Central Africa. To do this, we need your help! Bring your food charity straight to Glen and his family.',
        fact: 'In addition to having distinctive fingerprints like humans do, gorillas also have unique nose prints. Gorillas are the largest of the great apes, but the western lowland gorilla is the smallest of the subspecies.',
        info: {
            'Common name:': 'Western lowland gorillas',
            'Scientific name:': 'Gorilla gorilla gorilla',
            'Type:': 'Mammals',
            'Size:': 'Standing height, four to six feet',
            'Diet:': 'Omnivore',
            'Habitat:': 'Rainforests',
            'Range:': 'Western Africa',
        },
        photo: 'rectangle-gorilla-in-congo.jpg',
        description: "Western lowland gorillas are the smallest of the four subspecies. They live in thick tropical rainforests, where they find plenty of food for their vegetarian diet. They eat roots, shoots, fruit, wild celery, and tree bark and pulp. Gorillas can climb trees, but they're usually found on the ground in communities—known as troops. Troops are led by one dominant, older adult male, often called a silverback because of the swath of silver hair that adorns his otherwise dark fur. Troops also include several other young males, some females, and their offspring. The leader organizes troop activities, such as eating, nesting in leaves, and moving about the group's home range. Gorillas prefer traveling on all fours, pushing themselves forward with their knuckles and soles of their feet. Female gorillas give birth to one infant after a pregnancy of nearly nine months. These infants ride on their mothers' backs from the age of four months through the first two or three years of their lives.",
    },
    5: {
        icon: 'eagle.svg',
        title: 'Bald Eagle Cams',
        playerImg: 'youtube-player-eagles.jpg',
        cams: [
            { img: 'eagles-additional-cam-card-1.jpg', label: 'CAM 1' },
            { img: 'eagles-additional-cam-card-2.jpg', label: 'CAM 2' },
            { img: 'eagles-additional-cam-card-3.jpg', label: 'CAM 3' },
        ],
        donationTitle: 'Keep the Bald Eagle Cams Streaming!',
        donationText: 'Watch as this lifelong pair of eagle parents lay and protect eggs, feed their chicks and teach them to hunt and fly. Sam & Lora have stolen the hearts of thousands of viewers! 100% of the donations from this page will be utilized directly for the streaming and operational costs of this project.',
        fact: 'Because of its role as a symbol of the US, but also because of its being a large predator, the bald eagle has many representations in popular culture. Not all of these representations are accurate. In particular, the movie or television bald eagle typically has a bold, powerful cry. The actual eagle has a much softer, chirpy voice, not in keeping with its popular image.',
        info: {
            'Common name:': 'Bald Eagle',
            'Scientific name:': 'Haliaeetus Leucocephalus',
            'Type:': 'Birds',
            'Size:': 'Body: 34 to 43 inches; wingspan: 6 to 8 feet',
            'Diet:': 'Carnivore',
            'Habitat:': 'Seacoasts, rivers, large lakes or marshes',
            'Range:': 'Continental United States',
        },
        photo: 'rectangle-west-end-bald-eagles.jpg',
        description: "The bald eagle, with its snowy-feathered (not bald) head and white tail, is the proud national animal of the United States—yet the bird was nearly wiped out there. For many decades, bald eagles were hunted for sport and for the \"protection\" of fishing grounds. These powerful birds of prey use their talons to fish, but they get many of their meals by scavenging carrion or stealing the kills of other animals. They live near water and favor coasts and lakes where fish are plentiful, though they will also snare and eat small mammals. Bald eagles are believed to mate for life. A pair constructs an enormous stick nest—one of the bird-world's biggest—high above the ground and tends to a pair of eggs each year. Immature eagles are dark, and until they are about five years old, they lack the distinctive white markings that make their parents so easy to identify.",
    },
};
// ─── State ───────────────────────────────────────────────────────────────────
let cameras = [];
let pets = [];
let activeIndex = 0;
// ─── Helpers ─────────────────────────────────────────────────────────────────
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
// ─── Sidebar ─────────────────────────────────────────────────────────────────
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
            renderContent();
        });
        nav.appendChild(btn);
    });
}
// ─── Content ─────────────────────────────────────────────────────────────────
function renderContent() {
    const camera = cameras[activeIndex];
    if (!camera)
        return;
    const pet = getPetById(camera.petId);
    const detail = ANIMAL_DETAILS[camera.petId];
    const title = detail?.title ?? (pet ? `${pet.commonName} Cams` : `Camera ${camera.id}`);
    const animalTitle = document.getElementById('animalTitle');
    if (animalTitle)
        animalTitle.textContent = title;
    const playerImg = document.getElementById('playerImg');
    if (playerImg) {
        playerImg.src = detail ? IMG_BASE + detail.playerImg : getImageForPet(camera.petId);
        playerImg.alt = title;
    }
    const camCards = document.getElementById('camCards');
    if (camCards) {
        camCards.innerHTML = '';
        const cams = detail?.cams ?? [{ img: PET_IMAGES[camera.petId] ?? 'cameras/1.jpg', label: 'CAM 1' }];
        cams.forEach((cam, i) => {
            const card = document.createElement('a');
            card.className = 'zoos-cam-card' + (i === 0 ? ' active' : '');
            card.href = 'https://www.youtube.com/c/RSSchool/';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.innerHTML = `
        <img src="${IMG_BASE + cam.img}" alt="${escapeHtml(cam.label)}">
        <div class="zoos-cam-card__play"></div>
      `;
            camCards.appendChild(card);
        });
    }
    const donationTitle = document.getElementById('donationTitle');
    if (donationTitle) {
        donationTitle.textContent =
            detail?.donationTitle ?? (pet ? `Support ${pet.name} the ${pet.commonName}!` : `Support Camera ${camera.id}!`);
    }
    const donationText = document.getElementById('donationText');
    if (donationText) {
        donationText.textContent = detail?.donationText ?? (pet?.description ?? camera.text);
    }
    const factText = document.getElementById('factText');
    if (factText) {
        factText.textContent = detail?.fact ?? (pet?.description ?? '');
    }
    const infoTable = document.getElementById('infoTable');
    if (infoTable) {
        infoTable.innerHTML = '';
        if (detail) {
            Object.entries(detail.info).forEach(([key, value]) => {
                const tr = document.createElement('tr');
                if (key === 'Range:') {
                    tr.innerHTML = `<td>${escapeHtml(key)}</td><td>${escapeHtml(value)} <a class="zoos-info__map-link" href="../map/">View Map</a></td>`;
                }
                else {
                    tr.innerHTML = `<td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td>`;
                }
                infoTable.appendChild(tr);
            });
        }
        else if (pet) {
            const rows = [
                ['Common name:', pet.commonName],
                ['Name:', pet.name],
            ];
            rows.forEach(([key, value]) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td>`;
                infoTable.appendChild(tr);
            });
        }
    }
    const infoPhoto = document.getElementById('infoPhoto');
    if (infoPhoto) {
        infoPhoto.src = detail ? IMG_BASE + detail.photo : getImageForPet(camera.petId);
        infoPhoto.alt = title;
    }
    const description = document.getElementById('description');
    if (description) {
        description.textContent = detail?.description ?? (pet?.description ?? '');
    }
}
// ─── Loader ──────────────────────────────────────────────────────────────────
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
// ─── API Fetch ───────────────────────────────────────────────────────────────
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
        renderSidebar();
        renderContent();
    }
    catch {
        console.error('Failed to load cameras data');
    }
    finally {
        hideLoader();
    }
}
// ─── Sidebar expand / collapse ───────────────────────────────────────────────
const sidebar = document.querySelector('.zoos-sidebar');
const expandBtn = document.querySelector('.zoos-sidebar__expand');
const sidebarOverlay = document.getElementById('zoosSidebarOverlay');
const sidebarTrigger = document.getElementById('zoosSidebarTrigger');
function openZoosSidebar() {
    sidebar?.classList.add('is-expanded');
}
function closeZoosSidebar() {
    sidebar?.classList.remove('is-expanded');
}
expandBtn?.addEventListener('click', () => {
    if (sidebar?.classList.contains('is-expanded')) {
        closeZoosSidebar();
    }
    else {
        openZoosSidebar();
    }
});
sidebarOverlay?.addEventListener('click', closeZoosSidebar);
sidebarTrigger?.addEventListener('click', openZoosSidebar);
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
// ─── Init ────────────────────────────────────────────────────────────────────
loadCameras();
export {};
//# sourceMappingURL=script.js.map