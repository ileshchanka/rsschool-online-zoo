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

  const modalOverlay = modal.querySelector<HTMLElement>('.auth-modal__overlay')!;
  const modalClose = modal.querySelector<HTMLButtonElement>('.auth-modal__close')!;
  const modalContent = modal.querySelector<HTMLElement>('.auth-modal__content')!;

  function openModal(): void {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function getToken(): string | null {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const token = raw.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
    return token || null;
  }

  function setToken(token: string): void {
    const clean = token.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
    if (!clean) return;
    localStorage.setItem(TOKEN_KEY, clean);
  }

  function extractToken(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') return null;
    const body = payload as Record<string, unknown>;
    if (typeof body['token'] === 'string') return body['token'];
    if (typeof body['accessToken'] === 'string') return body['accessToken'];
    if (typeof body['access_token'] === 'string') return body['access_token'];
    if (typeof body['jwt'] === 'string') return body['jwt'];

    const data = body['data'];
    if (data && typeof data === 'object') {
      const dataObj = data as Record<string, unknown>;
      if (typeof dataObj['token'] === 'string') return dataObj['token'];
      if (typeof dataObj['accessToken'] === 'string') return dataObj['accessToken'];
      if (typeof dataObj['access_token'] === 'string') return dataObj['access_token'];
      if (typeof dataObj['jwt'] === 'string') return dataObj['jwt'];
    }

    return null;
  }

  function extractTokenFromHeaders(res: Response): string | null {
    const headerCandidates = [
      res.headers.get('authorization'),
      res.headers.get('Authorization'),
      res.headers.get('x-access-token'),
      res.headers.get('x-auth-token'),
      res.headers.get('token'),
    ];

    for (const value of headerCandidates) {
      if (!value) continue;
      const clean = value.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
      if (clean) return clean;
    }

    return null;
  }

  function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  function saveCachedProfile(name: string, email: string): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email }));
  }

  function getCachedProfile(): { name: string; email: string } | null {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { name?: unknown; email?: unknown };
      const name = typeof parsed.name === 'string' ? parsed.name.trim() : '';
      const email = typeof parsed.email === 'string' ? parsed.email.trim() : '';
      if (!name && !email) return null;
      return { name, email };
    } catch {
      return null;
    }
  }

  function clearCachedProfile(): void {
    localStorage.removeItem(PROFILE_KEY);
  }

  function extractUserInfo(payload: unknown): { name: string; email: string } {
    if (!payload || typeof payload !== 'object') return { name: '', email: '' };

    const root = payload as Record<string, unknown>;
    const rootName =
      (typeof root['name'] === 'string' && root['name'])
      || (typeof root['login'] === 'string' && root['login'])
      || '';
    const rootEmail = typeof root['email'] === 'string' ? root['email'] : '';

    const data = root['data'];
    if (data && typeof data === 'object') {
      const dataObj = data as Record<string, unknown>;
      const dataName =
        (typeof dataObj['name'] === 'string' && dataObj['name'])
        || (typeof dataObj['login'] === 'string' && dataObj['login'])
        || '';
      const dataEmail = typeof dataObj['email'] === 'string' ? dataObj['email'] : '';

      const user = dataObj['user'];
      if (user && typeof user === 'object') {
        const userObj = user as Record<string, unknown>;
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

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Close header popup ────────────────────────────────────────────────────
  function closePopup(): void {
    popup?.classList.remove('is-open');
  }

  function togglePopup(): void {
    popup?.classList.toggle('is-open');
  }

  document.addEventListener('click', (e: MouseEvent) => {
    const userEl = document.getElementById('headerUser');
    if (userEl && !userEl.contains(e.target as Node)) {
      closePopup();
    }
  });

  // ─── Validation helpers for Sign In ─────────────────────────────────────
  function validateLogin(value: string): string {
    if (value.length < 3) return 'Login must be at least 3 characters long';
    if (!/^[a-zA-Z]/.test(value)) return 'Login must start with a letter';
    if (!/^[a-zA-Z]+$/.test(value)) return 'Only English alphabet letters are allowed';
    return '';
  }

  function validatePassword(value: string): string {
    if (value.length < 6) return 'Password must be at least 6 characters long';
    if (!/[^a-zA-Z0-9]/.test(value)) return 'Password must contain at least 1 special character';
    return '';
  }

  function setFieldError(input: HTMLInputElement, msg: string): void {
    const field = input.closest('.auth-modal__field');
    input.classList.add('is-invalid');
    let errEl = field?.querySelector<HTMLElement>('.auth-modal__field-error');
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

  function clearFieldError(input: HTMLInputElement): void {
    const field = input.closest('.auth-modal__field');
    input.classList.remove('is-invalid');
    const errEl = field?.querySelector<HTMLElement>('.auth-modal__field-error');
    if (errEl) errEl.classList.remove('is-visible');
  }

  function updateSignInButton(): void {
    const loginEl = document.getElementById('authLogin') as HTMLInputElement | null;
    const passEl  = document.getElementById('authPassword') as HTMLInputElement | null;
    const btn     = document.getElementById('authSignInBtn') as HTMLButtonElement | null;
    if (!loginEl || !passEl || !btn) return;
    btn.disabled = !(!validateLogin(loginEl.value) && !validatePassword(passEl.value));
  }

  function attachSignInFieldListeners(): void {
    const loginEl = document.getElementById('authLogin') as HTMLInputElement | null;
    const passEl  = document.getElementById('authPassword') as HTMLInputElement | null;
    if (!loginEl || !passEl) return;
    ([loginEl, passEl] as HTMLInputElement[]).forEach(input => {
      input.addEventListener('blur', () => {
        const msg = input.id === 'authLogin' ? validateLogin(input.value) : validatePassword(input.value);
        if (msg) setFieldError(input, msg);
        else     clearFieldError(input);
        updateSignInButton();
      });
      input.addEventListener('focus', () => { clearFieldError(input); });
      input.addEventListener('input', () => { updateSignInButton(); });
    });
  }

  // ─── Render sign-in form inside modal ─────────────────────────────────────
  function showSignInForm(): void {
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

    document.getElementById('authGoRegister')?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      showRegisterForm();
    });

    const form = document.getElementById('authSignInForm') as HTMLFormElement | null;
    form?.addEventListener('submit', handleSignIn);
    attachSignInFieldListeners();
    openModal();
  }

  // ─── Render registration form inside modal ────────────────────────────────
  function showRegisterForm(): void {
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

    document.getElementById('authGoSignIn')?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      showSignInForm();
    });

    const form = document.getElementById('authRegisterForm') as HTMLFormElement | null;
    form?.addEventListener('submit', handleRegister);
    openModal();
  }

  // ─── Error display ────────────────────────────────────────────────────────
  function showError(msg: string): void {
    const el = document.getElementById('authError');
    if (el) {
      el.textContent = msg;
      el.classList.add('is-visible');
    }
  }

  function clearError(): void {
    const el = document.getElementById('authError');
    if (el) {
      el.textContent = '';
      el.classList.remove('is-visible');
    }
  }

  // ─── API: Sign In ─────────────────────────────────────────────────────────
  async function handleSignIn(e: Event): Promise<void> {
    e.preventDefault();
    clearError();
    const login = (document.getElementById('authLogin') as HTMLInputElement).value.trim();
    const password = (document.getElementById('authPassword') as HTMLInputElement).value;

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

      const data = await res.json().catch(() => null) as unknown;
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
    } catch {
      showError('Network error. Please try again.');
    }
  }

  // ─── API: Register ────────────────────────────────────────────────────────
  async function handleRegister(e: Event): Promise<void> {
    e.preventDefault();
    clearError();
    const name = (document.getElementById('regName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('regEmail') as HTMLInputElement).value.trim();
    const login = (document.getElementById('regLogin') as HTMLInputElement).value.trim();
    const password = (document.getElementById('regPassword') as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, name, email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null) as Record<string, unknown> | null;
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
    } catch {
      showError('Network error. Please try again.');
    }
  }

  // ─── Render user popup (logged-in dropdown) ───────────────────────────────
  function renderUserPopup(name: string, email: string): void {
    if (!popup) return;
    popup.innerHTML = `
      <p class="header__user-popup__profile-name">${escapeHtml(name)}</p>
      <p class="header__user-popup__profile-email">${escapeHtml(email)}</p>
      <hr class="header__user-popup__divider">
      <button class="header__user-popup__signout" id="authSignOutBtn">Sign Out</button>`;

    document.getElementById('authSignOutBtn')?.addEventListener('click', () => {
      removeToken();
      clearCachedProfile();
      if (userNameEl) userNameEl.textContent = '';
      setGuestMode();
      closePopup();
    });
  }

  // ─── Mode switching ──────────────────────────────────────────────────────
  let isLoggedIn = false;

  function setGuestMode(): void {
    isLoggedIn = false;
    if (userNameEl) userNameEl.textContent = '';
    if (popup) {
      popup.innerHTML = `
        <a class="header__user-popup__link header__user-popup__link--primary" href="#" id="popupSignIn">Sign In</a>
        <a class="header__user-popup__link" href="#" id="popupRegister">Registration</a>`;
      document.getElementById('popupSignIn')?.addEventListener('click', (e: Event) => {
        e.preventDefault();
        closePopup();
        showSignInForm();
      });
      document.getElementById('popupRegister')?.addEventListener('click', (e: Event) => {
        e.preventDefault();
        closePopup();
        showRegisterForm();
      });
    }
  }

  function setUserMode(name: string, email: string): void {
    isLoggedIn = true;
    const safeName = name.trim() || 'Profile';
    const safeEmail = email.trim();
    if (userNameEl) userNameEl.textContent = safeName;
    saveCachedProfile(safeName, safeEmail);
    renderUserPopup(safeName, safeEmail);
  }

  // ─── User icon click handler ──────────────────────────────────────────────
  userBtn?.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    togglePopup();
  });

  // ─── Load profile on init ────────────────────────────────────────────────
  async function loadProfile(): Promise<void> {
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

      if (!res.ok) throw new Error('Server error');

      const data = await res.json() as unknown;
      const userInfo = extractUserInfo(data);
      setUserMode(userInfo.name, userInfo.email);
    } catch {
      if (!cachedProfile) setUserMode('Profile', '');
    }
  }

  void loadProfile();
})();
