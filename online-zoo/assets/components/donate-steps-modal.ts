declare global {
  interface Window {
    openDonateStepsModal: ((prefilledAmount?: number) => void) | undefined;
    closeDonateStepsModal: () => void;
  }
}

(function () {
  interface Pet {
    id: number;
    name: string;
    commonName: string;
    description: string;
  }

  interface PetsApiResponse {
    data: Pet[];
  }

  interface DonationPayload {
    name: string;
    email: string;
    amount: number;
    petId: number;
  }

  const API_BASE = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

  const PRESET_AMOUNTS = [20, 30, 50, 80, 100];

  // ─── Build modal HTML ─────────────────────────────────────────────────────────

  function buildModalHtml(): string {
    const amounts = PRESET_AMOUNTS.map(
      (a) => `<button class="dsm__amount" type="button" data-amount="${a}">$${a}</button>`,
    ).join('');

    return `
<div class="dsm" id="donateStepsModal" role="dialog" aria-modal="true" aria-label="Donate">
  <div class="dsm__overlay"></div>
  <div class="dsm__window">
    <button class="dsm__close" id="dsmClose" aria-label="Close">&times;</button>
    <div class="dsm__header">
      <h2 class="dsm__title">Make a Donation</h2>
    </div>

    <!-- Step 1 -->
    <div class="dsm__step dsm__step--active" data-step="1">
      <div class="dsm__body">
        <p class="dsm__section-title">Choose amount</p>
        <hr class="dsm__divider">
        <div class="dsm__amounts-wrap" id="dsmAmountsWrap">
          <div class="dsm__amounts" id="dsmAmounts">${amounts}</div>
        </div>
        <p class="dsm__section-title" style="margin-top:18px">Custom amount</p>
        <hr class="dsm__divider">
        <div class="dsm__row">
          <input class="dsm__side-input" id="dsmCustomAmount" type="number" min="0.02" step="0.01" placeholder="Enter amount">
          <button class="dsm__side-btn" id="dsmApplyAmount" type="button">Apply</button>
        </div>
        <p class="dsm__error-msg" id="dsmAmountError">Please select or enter a donation amount.</p>

        <p class="dsm__section-title">Your details</p>
        <hr class="dsm__divider">
        <div class="dsm__row dsm__row--fields">
          <div class="dsm__field">
            <label class="dsm__label" for="dsmName"><span class="dsm__req">*</span> Name</label>
            <input class="dsm__input" id="dsmName" type="text" placeholder="First and last name" autocomplete="name">
            <p class="dsm__error-msg" id="dsmNameError">Please enter your name.</p>
          </div>
          <div class="dsm__field">
            <label class="dsm__label" for="dsmEmail"><span class="dsm__req">*</span> Email</label>
            <input class="dsm__input" id="dsmEmail" type="email" placeholder="your@email.com" autocomplete="email">
            <p class="dsm__error-msg" id="dsmEmailError">Please enter a valid email.</p>
          </div>
        </div>

        <p class="dsm__section-title">Select pet to support</p>
        <hr class="dsm__divider">
        <div class="dsm__row">
          <div class="dsm__select" id="dsmPetSelect" style="width:100%">
            <div class="dsm__select-trigger" id="dsmPetTrigger" tabindex="0" role="button" aria-haspopup="listbox">
              <span id="dsmPetValue">Loading pets…</span>
              <span class="dsm__select-arrow"></span>
            </div>
            <ul class="dsm__select-options" id="dsmPetOptions" role="listbox"></ul>
          </div>
        </div>
        <p class="dsm__error-msg" id="dsmPetError">Please select a pet.</p>

        <div class="dsm__footer">
          <div class="dsm__dots">
            <span class="dsm__dot dsm__dot--active" data-step-dot="1"></span>
            <span class="dsm__dot" data-step-dot="2"></span>
          </div>
          <button class="dsm__next" id="dsmNext1" type="button">Next</button>
        </div>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="dsm__step" data-step="2">
      <div class="dsm__body">
        <p class="dsm__section-title">Payment details</p>
        <hr class="dsm__divider">

        <div class="dsm__field">
          <label class="dsm__label" for="dsmCard"><span class="dsm__req">*</span> Card number</label>
          <input class="dsm__input" id="dsmCard" type="text" placeholder="1234 5678 9012 3456" maxlength="19" autocomplete="cc-number">
          <p class="dsm__error-msg" id="dsmCardError">Please enter a valid 16-digit card number.</p>
        </div>

        <div class="dsm__row dsm__row--exp">
          <div class="dsm__field" style="flex:1">
            <label class="dsm__label" for="dsmExpMonth"><span class="dsm__req">*</span> Expiry month</label>
            <select class="dsm__input" id="dsmExpMonth" autocomplete="cc-exp-month">
              <option value="">MM</option>
              ${Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                return `<option value="${m}">${m}</option>`;
              }).join('')}
            </select>
            <p class="dsm__error-msg" id="dsmExpMonthError">Required.</p>
          </div>
          <div class="dsm__field" style="flex:1">
            <label class="dsm__label" for="dsmExpYear"><span class="dsm__req">*</span> Expiry year</label>
            <select class="dsm__input" id="dsmExpYear" autocomplete="cc-exp-year">
              <option value="">YYYY</option>
              ${Array.from({ length: 10 }, (_, i) => {
                const y = new Date().getFullYear() + i;
                return `<option value="${y}">${y}</option>`;
              }).join('')}
            </select>
            <p class="dsm__error-msg" id="dsmExpYearError">Required.</p>
          </div>
          <div class="dsm__field dsm__field--cvv" style="flex:1">
            <label class="dsm__label" for="dsmCvv"><span class="dsm__req">*</span> CVV</label>
            <input class="dsm__input" id="dsmCvv" type="text" placeholder="123" maxlength="4" autocomplete="cc-csc">
            <p class="dsm__error-msg" id="dsmCvvError">Please enter a valid CVV.</p>
          </div>
        </div>

        <p class="dsm__hint" id="dsmSummary"></p>

        <div class="dsm__footer">
          <div class="dsm__dots">
            <span class="dsm__dot" data-step-dot="1"></span>
            <span class="dsm__dot dsm__dot--active" data-step-dot="2"></span>
          </div>
          <span class="dsm__back" id="dsmBack" role="button" tabindex="0">Back</span>
          <button class="dsm__complete" id="dsmComplete" type="button">Complete Donation</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
  }

  // ─── State ────────────────────────────────────────────────────────────────────

  let selectedAmount: number | null = null;
  let selectedPetId: number | null = null;
  let selectedPetName = '';
  let pets: Pet[] = [];

  // ─── DOM helpers ──────────────────────────────────────────────────────────────

  function getInput(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  function getSelect(id: string): HTMLSelectElement {
    return document.getElementById(id) as HTMLSelectElement;
  }

  function showError(inputId: string, errorId: string): void {
    const el = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    el?.classList.add('is-invalid');
    err?.classList.add('is-visible');
  }

  function clearError(inputId: string, errorId: string): void {
    const el = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    el?.classList.remove('is-invalid');
    err?.classList.remove('is-visible');
  }

  function shake(el: HTMLElement): void {
    el.classList.remove('dsm__shake');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('dsm__shake');
    el.addEventListener('animationend', () => el.classList.remove('dsm__shake'), { once: true });
  }

  // ─── Inject modal into DOM ────────────────────────────────────────────────────

  const container = document.createElement('div');
  container.innerHTML = buildModalHtml();
  document.body.appendChild(container);

  const modal = document.getElementById('donateStepsModal') as HTMLElement;

  // ─── Open / Close ─────────────────────────────────────────────────────────────

  function openModal(prefilledAmount?: number): void {
    goToStep(1);
    if (prefilledAmount !== undefined) preselectAmount(prefilledAmount);
    modal.classList.add('is-open');
    document.body.classList.add('body--modal-open');
  }

  function closeModal(): void {
    modal.classList.remove('is-open');
    document.body.classList.remove('body--modal-open');
  }

  window.openDonateStepsModal = openModal;
  window.closeDonateStepsModal = closeModal;

  document.getElementById('dsmClose')?.addEventListener('click', closeModal);
  modal.querySelector('.dsm__overlay')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // ─── Trigger buttons ──────────────────────────────────────────────────────────

  document.querySelectorAll<HTMLButtonElement>('.pay-feed__btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal());
  });

  document.querySelectorAll<HTMLButtonElement>('.zoos-content__donate-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal());
  });

  // ─── Step navigation ─────────────────────────────────────────────────────────

  function goToStep(step: 1 | 2): void {
    modal.querySelectorAll<HTMLElement>('.dsm__step').forEach((s) => {
      s.classList.remove('dsm__step--active');
    });
    modal.querySelector<HTMLElement>(`[data-step="${step}"]`)?.classList.add('dsm__step--active');

    modal.querySelectorAll<HTMLElement>('[data-step-dot]').forEach((dot) => {
      const dotStep = Number(dot.dataset['stepDot']);
      dot.classList.toggle('dsm__dot--active', dotStep === step);
    });

    if (step === 2) {
      const pet = selectedPetName ? ` for ${selectedPetName}` : '';
      const amountStr = selectedAmount !== null ? `$${selectedAmount}` : '(no amount selected)';
      const summary = document.getElementById('dsmSummary');
      if (summary) {
        summary.textContent = `You are about to donate ${amountStr}${pet}. Payment is simulated — no real charge will occur.`;
      }
    }
  }

  document.getElementById('dsmNext1')?.addEventListener('click', () => {
    if (!validateStep1()) return;
    goToStep(2);
  });

  const backBtn = document.getElementById('dsmBack');
  backBtn?.addEventListener('click', () => goToStep(1));
  backBtn?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') goToStep(1);
  });

  // ─── Amount selection ────────────────────────────────────────────────────────

  function preselectAmount(amount: number): void {
    selectedAmount = amount;
    modal.querySelectorAll<HTMLButtonElement>('.dsm__amount').forEach((btn) => {
      const btnAmount = Number(btn.dataset['amount']);
      btn.classList.toggle('is-selected', btnAmount === amount);
    });
    const customInput = getInput('dsmCustomAmount');
    const isPreset = PRESET_AMOUNTS.includes(amount);
    if (!isPreset) {
      customInput.value = String(amount);
    } else {
      customInput.value = '';
    }
    clearError('dsmAmountsWrap', 'dsmAmountError');
  }

  document.getElementById('dsmAmounts')?.addEventListener('click', (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.dsm__amount');
    if (!btn) return;
    const amount = Number(btn.dataset['amount']);
    preselectAmount(amount);
    getInput('dsmCustomAmount').value = '';
  });

  document.getElementById('dsmApplyAmount')?.addEventListener('click', () => {
    const raw = parseFloat(getInput('dsmCustomAmount').value);
    if (!Number.isFinite(raw) || raw < 0.02) {
      shake(getInput('dsmCustomAmount'));
      return;
    }
    preselectAmount(raw);
    // deselect preset buttons
    modal.querySelectorAll<HTMLButtonElement>('.dsm__amount').forEach((b) => b.classList.remove('is-selected'));
  });

  // ─── Custom pet select ────────────────────────────────────────────────────────

  const petTrigger = document.getElementById('dsmPetTrigger') as HTMLElement;
  const petOptions = document.getElementById('dsmPetOptions') as HTMLUListElement;
  const petValue = document.getElementById('dsmPetValue') as HTMLSpanElement;

  petTrigger.addEventListener('click', () => {
    const isOpen = petOptions.classList.toggle('is-open');
    petTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  petTrigger.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      petTrigger.click();
    }
  });

  document.addEventListener('click', (e: Event) => {
    if (!document.getElementById('dsmPetSelect')?.contains(e.target as Node)) {
      petOptions.classList.remove('is-open');
    }
  });

  function populatePetOptions(petList: Pet[]): void {
    petOptions.innerHTML = petList
      .map(
        (p) =>
          `<li role="option" data-pet-id="${p.id}" data-pet-name="${p.name} (${p.commonName})">${p.name} — ${p.commonName}</li>`,
      )
      .join('');

    petOptions.addEventListener('click', (e: Event) => {
      const li = (e.target as HTMLElement).closest<HTMLLIElement>('li[data-pet-id]');
      if (!li) return;
      selectedPetId = Number(li.dataset['petId']);
      selectedPetName = li.dataset['petName'] ?? '';
      petValue.textContent = selectedPetName;
      petOptions.querySelectorAll('li').forEach((el) => el.classList.remove('is-selected'));
      li.classList.add('is-selected');
      petOptions.classList.remove('is-open');
      clearError('dsmPetTrigger', 'dsmPetError');
    });
  }

  // ─── Step 1 validation ────────────────────────────────────────────────────────

  function validateStep1(): boolean {
    let valid = true;

    if (selectedAmount === null || selectedAmount < 0.02) {
      document.getElementById('dsmAmountsWrap')?.classList.add('is-invalid');
      const err = document.getElementById('dsmAmountError');
      err?.classList.add('is-visible');
      shake(document.getElementById('dsmAmountsWrap') as HTMLElement);
      valid = false;
    } else {
      document.getElementById('dsmAmountsWrap')?.classList.remove('is-invalid');
      document.getElementById('dsmAmountError')?.classList.remove('is-visible');
    }

    const name = getInput('dsmName').value.trim();
    if (!name) {
      showError('dsmName', 'dsmNameError');
      if (valid) shake(getInput('dsmName'));
      valid = false;
    } else {
      clearError('dsmName', 'dsmNameError');
    }

    const email = getInput('dsmEmail').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showError('dsmEmail', 'dsmEmailError');
      if (valid) shake(getInput('dsmEmail'));
      valid = false;
    } else {
      clearError('dsmEmail', 'dsmEmailError');
    }

    if (selectedPetId === null) {
      petTrigger.classList.add('is-invalid');
      document.getElementById('dsmPetError')?.classList.add('is-visible');
      if (valid) shake(petTrigger);
      valid = false;
    } else {
      petTrigger.classList.remove('is-invalid');
      document.getElementById('dsmPetError')?.classList.remove('is-visible');
    }

    return valid;
  }

  // ─── Step 2 validation ────────────────────────────────────────────────────────

  function validateStep2(): boolean {
    let valid = true;

    const card = getInput('dsmCard').value.replace(/\s/g, '');
    if (!/^\d{16}$/.test(card)) {
      showError('dsmCard', 'dsmCardError');
      if (valid) shake(getInput('dsmCard'));
      valid = false;
    } else {
      clearError('dsmCard', 'dsmCardError');
    }

    const expMonth = getSelect('dsmExpMonth').value;
    if (!expMonth) {
      showError('dsmExpMonth', 'dsmExpMonthError');
      valid = false;
    } else {
      clearError('dsmExpMonth', 'dsmExpMonthError');
    }

    const expYear = getSelect('dsmExpYear').value;
    if (!expYear) {
      showError('dsmExpYear', 'dsmExpYearError');
      valid = false;
    } else {
      clearError('dsmExpYear', 'dsmExpYearError');
    }

    const cvv = getInput('dsmCvv').value;
    if (!/^\d{3,4}$/.test(cvv)) {
      showError('dsmCvv', 'dsmCvvError');
      if (valid) shake(getInput('dsmCvv'));
      valid = false;
    } else {
      clearError('dsmCvv', 'dsmCvvError');
    }

    return valid;
  }

  // Card number formatting
  getInput('dsmCard').addEventListener('input', () => {
    const input = getInput('dsmCard');
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });

  // ─── Submit donation ──────────────────────────────────────────────────────────

  async function submitDonation(payload: DonationPayload): Promise<void> {
    const completeBtn = document.getElementById('dsmComplete') as HTMLButtonElement;
    completeBtn.disabled = true;
    completeBtn.textContent = 'Processing…';

    try {
      const res = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      closeModal();
      alert(`Thank you, ${payload.name}! Your donation of $${payload.amount} has been received.`);
      resetForm();
    } catch (err) {
      console.error('Donation failed:', err);
      alert('Sorry, your donation could not be processed. Please try again.');
    } finally {
      completeBtn.disabled = false;
      completeBtn.textContent = 'Complete Donation';
    }
  }

  function resetForm(): void {
    selectedAmount = null;
    selectedPetId = null;
    selectedPetName = '';
    petValue.textContent = 'Select a pet…';
    modal.querySelectorAll<HTMLButtonElement>('.dsm__amount').forEach((b) => b.classList.remove('is-selected'));
    ['dsmName', 'dsmEmail', 'dsmCustomAmount', 'dsmCard', 'dsmCvv'].forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = '';
    });
    const expMonth = document.getElementById('dsmExpMonth') as HTMLSelectElement | null;
    if (expMonth) expMonth.selectedIndex = 0;
    const expYear = document.getElementById('dsmExpYear') as HTMLSelectElement | null;
    if (expYear) expYear.selectedIndex = 0;
  }

  document.getElementById('dsmComplete')?.addEventListener('click', () => {
    if (!validateStep2()) return;
    if (selectedAmount === null || selectedPetId === null) return;

    const payload: DonationPayload = {
      name: getInput('dsmName').value.trim(),
      email: getInput('dsmEmail').value.trim(),
      amount: selectedAmount,
      petId: selectedPetId,
    };

    void submitDonation(payload);
  });

  // ─── Fetch pets for dropdown ──────────────────────────────────────────────────

  async function loadPets(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/pets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PetsApiResponse;
      pets = json.data;
      populatePetOptions(pets);
      petValue.textContent = 'Select a pet…';
    } catch (err) {
      console.error('Failed to load pets for dropdown:', err);
      petValue.textContent = 'Could not load pets';
    }
  }

  void loadPets();
})();
