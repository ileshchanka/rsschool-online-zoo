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

// Contact form validation
(function () {
  type FieldId = 'name' | 'email' | 'subject' | 'message';

  interface FieldRule {
    required: boolean;
    pattern?: RegExp;
    errorMessage: string;
  }

  const rules: Record<FieldId, FieldRule> = {
    name: {
      required: true,
      errorMessage: 'Please enter your full name.',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Please enter a valid email address.',
    },
    subject: {
      required: true,
      errorMessage: 'Please enter a subject.',
    },
    message: {
      required: true,
      errorMessage: 'Please enter your message.',
    },
  };

  function getInput(id: FieldId): HTMLInputElement | HTMLTextAreaElement | null {
    return document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  }

  function showError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    input.classList.add('contact-form__input--error');
    let err = input.parentElement?.querySelector('.contact-form__error');
    if (!err) {
      err = document.createElement('span');
      err.classList.add('contact-form__error');
      input.after(err);
    }
    err.textContent = message;
  }

  function clearError(input: HTMLInputElement | HTMLTextAreaElement): void {
    input.classList.remove('contact-form__input--error');
    input.parentElement?.querySelector('.contact-form__error')?.remove();
  }

  function validateField(id: FieldId): boolean {
    const input = getInput(id);
    if (!input) return true;
    const rule = rules[id];
    const value = input.value.trim();

    if (rule.required && value === '') {
      showError(input, rule.errorMessage);
      return false;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      showError(input, rule.errorMessage);
      return false;
    }
    clearError(input);
    return true;
  }

  const form = document.querySelector<HTMLFormElement>('.contact-form');
  if (form) {
    const fieldIds: FieldId[] = ['name', 'email', 'subject', 'message'];

    // Live validation on blur
    fieldIds.forEach((id) => {
      getInput(id)?.addEventListener('blur', () => validateField(id));
    });

    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const allValid = fieldIds.map(validateField).every(Boolean);
      if (allValid) {
        alert('Thank you! Your message has been sent.');
        form.reset();
      }
    });
  }
})();
