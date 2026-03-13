(function () {
    const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
    const TOKEN_KEY = 'zoo_auth_token';
    const userBtn = document.getElementById('headerUserBtn');
    const popup = document.getElementById('headerUserPopup');
    const userNameEl = document.getElementById('headerUserName');
    // ─── Auth modal (created once, reused) ────────────────────────────────────
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
    <div class="auth-modal__overlay"></div>
    <div class="auth-modal__window">
      <button class="auth-modal__close" aria-label="Close">&times;</button>
      <div class="auth-modal__content"></div>
    </div>`;
    document.body.appendChild(modal);
    const modalOverlay = modal.querySelector('.auth-modal__overlay');
    const modalClose = modal.querySelector('.auth-modal__close');
    const modalContent = modal.querySelector('.auth-modal__content');
    function openModal() {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            closeModal();
    });
    // ─── Helpers ──────────────────────────────────────────────────────────────
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }
    function setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    function removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    }
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    // ─── Close header popup ────────────────────────────────────────────────────
    function closePopup() {
        popup?.classList.remove('is-open');
    }
    function togglePopup() {
        popup?.classList.toggle('is-open');
    }
    document.addEventListener('click', (e) => {
        const userEl = document.getElementById('headerUser');
        if (userEl && !userEl.contains(e.target)) {
            closePopup();
        }
    });
    // ─── Render sign-in form inside modal ─────────────────────────────────────
    function showSignInForm() {
        modalContent.innerHTML = `
      <h2 class="auth-modal__title">Sign In</h2>
      <form class="auth-modal__form" id="authSignInForm">
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="authLogin">Login</label>
          <input class="auth-modal__input" id="authLogin" type="text" required autocomplete="username">
        </div>
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="authPassword">Password</label>
          <input class="auth-modal__input" id="authPassword" type="password" required autocomplete="current-password">
        </div>
        <div class="auth-modal__error" id="authError"></div>
        <button class="auth-modal__submit button_orange" type="submit">Sign In</button>
      </form>
      <p class="auth-modal__footer">Don't have an account? <a href="#" id="authGoRegister">Register</a></p>`;
        document.getElementById('authGoRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
        const form = document.getElementById('authSignInForm');
        form?.addEventListener('submit', handleSignIn);
        openModal();
    }
    // ─── Render registration form inside modal ────────────────────────────────
    function showRegisterForm() {
        modalContent.innerHTML = `
      <h2 class="auth-modal__title">Registration</h2>
      <form class="auth-modal__form" id="authRegisterForm">
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="regName">Name</label>
          <input class="auth-modal__input" id="regName" type="text" required>
        </div>
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="regEmail">Email</label>
          <input class="auth-modal__input" id="regEmail" type="email" required>
        </div>
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="regLogin">Login</label>
          <input class="auth-modal__input" id="regLogin" type="text" required autocomplete="username">
        </div>
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="regPassword">Password</label>
          <input class="auth-modal__input" id="regPassword" type="password" required autocomplete="new-password">
        </div>
        <div class="auth-modal__error" id="authError"></div>
        <button class="auth-modal__submit button_orange" type="submit">Register</button>
      </form>
      <p class="auth-modal__footer">Already have an account? <a href="#" id="authGoSignIn">Sign In</a></p>`;
        document.getElementById('authGoSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            showSignInForm();
        });
        const form = document.getElementById('authRegisterForm');
        form?.addEventListener('submit', handleRegister);
        openModal();
    }
    // ─── Error display ────────────────────────────────────────────────────────
    function showError(msg) {
        const el = document.getElementById('authError');
        if (el) {
            el.textContent = msg;
            el.classList.add('is-visible');
        }
    }
    function clearError() {
        const el = document.getElementById('authError');
        if (el) {
            el.textContent = '';
            el.classList.remove('is-visible');
        }
    }
    // ─── API: Sign In ─────────────────────────────────────────────────────────
    async function handleSignIn(e) {
        e.preventDefault();
        clearError();
        const login = document.getElementById('authLogin').value.trim();
        const password = document.getElementById('authPassword').value;
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg = (body && typeof body['message'] === 'string') ? body['message'] : 'Invalid credentials';
                showError(msg);
                return;
            }
            const data = await res.json();
            setToken(data.token);
            closeModal();
            await loadProfile();
        }
        catch {
            showError('Network error. Please try again.');
        }
    }
    // ─── API: Register ────────────────────────────────────────────────────────
    async function handleRegister(e) {
        e.preventDefault();
        clearError();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const login = document.getElementById('regLogin').value.trim();
        const password = document.getElementById('regPassword').value;
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password, name, email }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg = (body && typeof body['message'] === 'string') ? body['message'] : 'Registration failed';
                showError(msg);
                return;
            }
            // Registration succeeded — switch to sign-in form
            showSignInForm();
            const el = document.getElementById('authError');
            if (el) {
                el.textContent = 'Account created! Please sign in.';
                el.classList.add('is-visible');
                el.style.backgroundColor = '#efe';
                el.style.color = '#070';
            }
        }
        catch {
            showError('Network error. Please try again.');
        }
    }
    // ─── Render user popup (logged-in dropdown) ───────────────────────────────
    function renderUserPopup(name, email) {
        if (!popup)
            return;
        popup.innerHTML = `
      <p class="header__user-popup__profile-name">${escapeHtml(name)}</p>
      <p class="header__user-popup__profile-email">${escapeHtml(email)}</p>
      <hr class="header__user-popup__divider">
      <button class="header__user-popup__signout" id="authSignOutBtn">Sign Out</button>`;
        document.getElementById('authSignOutBtn')?.addEventListener('click', () => {
            removeToken();
            if (userNameEl)
                userNameEl.textContent = '';
            setGuestMode();
            closePopup();
        });
    }
    // ─── Mode switching ──────────────────────────────────────────────────────
    let isLoggedIn = false;
    function setGuestMode() {
        isLoggedIn = false;
        if (popup)
            popup.innerHTML = '';
    }
    function setUserMode(name, email) {
        isLoggedIn = true;
        if (userNameEl)
            userNameEl.textContent = name;
        renderUserPopup(name, email);
    }
    // ─── User icon click handler ──────────────────────────────────────────────
    userBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            togglePopup();
        }
        else {
            showSignInForm();
        }
    });
    // ─── Load profile on init ────────────────────────────────────────────────
    async function loadProfile() {
        const token = getToken();
        if (!token) {
            setGuestMode();
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok)
                throw new Error('Unauthorized');
            const data = await res.json();
            const displayName = data.name ?? data.login ?? '';
            const email = data.email ?? '';
            setUserMode(displayName, email);
        }
        catch {
            removeToken();
            setGuestMode();
        }
    }
    void loadProfile();
})();
export {};
//# sourceMappingURL=auth.js.map