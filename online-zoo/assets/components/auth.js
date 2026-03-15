(function () {
    const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
    const TOKEN_KEY = 'zoo_auth_token';
    const PROFILE_KEY = 'zoo_auth_profile';
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
        const raw = localStorage.getItem(TOKEN_KEY);
        if (!raw)
            return null;
        const token = raw.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
        return token || null;
    }
    function setToken(token) {
        const clean = token.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
        if (!clean)
            return;
        localStorage.setItem(TOKEN_KEY, clean);
    }
    function extractToken(payload) {
        if (!payload || typeof payload !== 'object')
            return null;
        const body = payload;
        if (typeof body['token'] === 'string')
            return body['token'];
        if (typeof body['accessToken'] === 'string')
            return body['accessToken'];
        if (typeof body['access_token'] === 'string')
            return body['access_token'];
        if (typeof body['jwt'] === 'string')
            return body['jwt'];
        const data = body['data'];
        if (data && typeof data === 'object') {
            const dataObj = data;
            if (typeof dataObj['token'] === 'string')
                return dataObj['token'];
            if (typeof dataObj['accessToken'] === 'string')
                return dataObj['accessToken'];
            if (typeof dataObj['access_token'] === 'string')
                return dataObj['access_token'];
            if (typeof dataObj['jwt'] === 'string')
                return dataObj['jwt'];
        }
        return null;
    }
    function extractTokenFromHeaders(res) {
        const headerCandidates = [
            res.headers.get('authorization'),
            res.headers.get('Authorization'),
            res.headers.get('x-access-token'),
            res.headers.get('x-auth-token'),
            res.headers.get('token'),
        ];
        for (const value of headerCandidates) {
            if (!value)
                continue;
            const clean = value.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
            if (clean)
                return clean;
        }
        return null;
    }
    function removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    }
    function saveCachedProfile(name, email) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email }));
    }
    function getCachedProfile() {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (!raw)
            return null;
        try {
            const parsed = JSON.parse(raw);
            const name = typeof parsed.name === 'string' ? parsed.name.trim() : '';
            const email = typeof parsed.email === 'string' ? parsed.email.trim() : '';
            if (!name && !email)
                return null;
            return { name, email };
        }
        catch {
            return null;
        }
    }
    function clearCachedProfile() {
        localStorage.removeItem(PROFILE_KEY);
    }
    function extractUserInfo(payload) {
        if (!payload || typeof payload !== 'object')
            return { name: '', email: '' };
        const root = payload;
        const rootName =
            (typeof root['name'] === 'string' && root['name'])
                || (typeof root['login'] === 'string' && root['login'])
                || '';
        const rootEmail = typeof root['email'] === 'string' ? root['email'] : '';
        const data = root['data'];
        if (data && typeof data === 'object') {
            const dataObj = data;
            const dataName =
                (typeof dataObj['name'] === 'string' && dataObj['name'])
                    || (typeof dataObj['login'] === 'string' && dataObj['login'])
                    || '';
            const dataEmail = typeof dataObj['email'] === 'string' ? dataObj['email'] : '';
            const user = dataObj['user'];
            if (user && typeof user === 'object') {
                const userObj = user;
                const userName =
                    (typeof userObj['name'] === 'string' && userObj['name'])
                        || (typeof userObj['login'] === 'string' && userObj['login'])
                        || '';
                const userEmail = typeof userObj['email'] === 'string' ? userObj['email'] : '';
                return { name: userName.trim(), email: userEmail.trim() };
            }
            if (dataName || dataEmail) {
                return { name: dataName.trim(), email: dataEmail.trim() };
            }
        }
        return { name: rootName.trim(), email: rootEmail.trim() };
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
    // ─── Validation helpers for Sign In ─────────────────────────────────────
    function validateLogin(value) {
        if (value.length < 3)
            return 'Login must be at least 3 characters long';
        if (!/^[a-zA-Z]/.test(value))
            return 'Login must start with a letter';
        if (!/^[a-zA-Z]+$/.test(value))
            return 'Only English alphabet letters are allowed';
        return '';
    }
    function validatePassword(value) {
        if (value.length < 6)
            return 'Password must be at least 6 characters long';
        if (!/[^a-zA-Z0-9]/.test(value))
            return 'Password must contain at least 1 special character';
        return '';
    }
    function setFieldError(input, msg) {
        const field = input.closest('.auth-modal__field');
        input.classList.add('is-invalid');
        let errEl = field?.querySelector('.auth-modal__field-error');
        if (!errEl && field) {
            errEl = document.createElement('span');
            errEl.className = 'auth-modal__field-error';
            field.appendChild(errEl);
        }
        if (errEl) {
            errEl.textContent = msg;
            errEl.classList.add('is-visible');
        }
    }
    function clearFieldError(input) {
        const field = input.closest('.auth-modal__field');
        input.classList.remove('is-invalid');
        const errEl = field?.querySelector('.auth-modal__field-error');
        if (errEl)
            errEl.classList.remove('is-visible');
    }
    function updateSignInButton() {
        const loginEl = document.getElementById('authLogin');
        const passEl = document.getElementById('authPassword');
        const btn = document.getElementById('authSignInBtn');
        if (!loginEl || !passEl || !btn)
            return;
        btn.disabled = !(!validateLogin(loginEl.value) && !validatePassword(passEl.value));
    }
    function attachSignInFieldListeners() {
        const loginEl = document.getElementById('authLogin');
        const passEl = document.getElementById('authPassword');
        if (!loginEl || !passEl)
            return;
        [loginEl, passEl].forEach(input => {
            input.addEventListener('blur', () => {
                const msg = input.id === 'authLogin' ? validateLogin(input.value) : validatePassword(input.value);
                if (msg)
                    setFieldError(input, msg);
                else
                    clearFieldError(input);
                updateSignInButton();
            });
            input.addEventListener('focus', () => { clearFieldError(input); });
            input.addEventListener('input', () => { updateSignInButton(); });
        });
    }
    // ─── Render sign-in form inside modal ─────────────────────────────────────
    function showSignInForm() {
        modalContent.innerHTML = `
      <h2 class="auth-modal__title">Sign In</h2>
      <form class="auth-modal__form" id="authSignInForm">
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="authLogin">Login</label>
          <input class="auth-modal__input" id="authLogin" type="text" autocomplete="username">
        </div>
        <div class="auth-modal__field">
          <label class="auth-modal__label" for="authPassword">Password</label>
          <input class="auth-modal__input" id="authPassword" type="password" autocomplete="current-password">
        </div>
        <div class="auth-modal__error" id="authError"></div>
        <button class="auth-modal__submit button_orange" type="submit" id="authSignInBtn" disabled>Sign In</button>
      </form>
      <p class="auth-modal__footer">Don't have an account? <a href="#" id="authGoRegister">Register</a></p>`;
        document.getElementById('authGoRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
        const form = document.getElementById('authSignInForm');
        form?.addEventListener('submit', handleSignIn);
        attachSignInFieldListeners();
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
                showError('Incorrect login or password');
                return;
            }
            const data = await res.json().catch(() => null);
            const token = extractToken(data) ?? extractTokenFromHeaders(res);
            if (token) {
                setToken(token);
            }
            const userInfo = extractUserInfo(data);
            if (userInfo.name || userInfo.email) {
                saveCachedProfile(userInfo.name, userInfo.email);
            }
            if (!getToken()) {
                showError('Unexpected server response. Please try again.');
                return;
            }
            closeModal();
            window.location.href = '../landing/';
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
            clearCachedProfile();
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
        if (userNameEl)
            userNameEl.textContent = '';
        if (popup) {
            popup.innerHTML = `
        <a class="header__user-popup__link header__user-popup__link--primary" href="#" id="popupSignIn">Sign In</a>
        <a class="header__user-popup__link" href="#" id="popupRegister">Registration</a>`;
            document.getElementById('popupSignIn')?.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                showSignInForm();
            });
            document.getElementById('popupRegister')?.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                showRegisterForm();
            });
        }
    }
    function setUserMode(name, email) {
        isLoggedIn = true;
        const safeName = name.trim() || 'Profile';
        const safeEmail = email.trim();
        if (userNameEl)
            userNameEl.textContent = safeName;
        saveCachedProfile(safeName, safeEmail);
        renderUserPopup(safeName, safeEmail);
    }
    // ─── User icon click handler ──────────────────────────────────────────────
    userBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopup();
    });
    // ─── Load profile on init ────────────────────────────────────────────────
    async function loadProfile() {
        const token = getToken();
        if (!token) {
            clearCachedProfile();
            setGuestMode();
            return;
        }
        const cachedProfile = getCachedProfile();
        if (cachedProfile) {
            setUserMode(cachedProfile.name, cachedProfile.email);
        }
        try {
            const res = await fetch(`${API_BASE}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.status === 401 || res.status === 403) {
                removeToken();
                clearCachedProfile();
                setGuestMode();
                return;
            }
            if (!res.ok)
                throw new Error('Server error');
            const data = await res.json();
            const userInfo = extractUserInfo(data);
            setUserMode(userInfo.name, userInfo.email);
        }
        catch {
            if (!cachedProfile)
                setUserMode('Profile', '');
        }
    }
    void loadProfile();
})();
export {};
//# sourceMappingURL=auth.js.map