declare global {
  interface Window {
    openDonateModal: () => void;
    closeDonateModal: () => void;
    openDonateStepsModal: ((prefilledAmount?: number) => void) | undefined;
  }
}

(function () {
  const modal = document.getElementById('donateModal');
  const overlay = document.getElementById('donateModalOverlay');
  const closeBtn = document.getElementById('donateModalClose');

  function openModal(): void {
    modal?.classList.add('is-open');
    document.body.classList.add('body--modal-open');
  }

  function closeModal(): void {
    modal?.classList.remove('is-open');
    document.body.classList.remove('body--modal-open');
  }

  window.openDonateModal = openModal;
  window.closeDonateModal = closeModal;

  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  });

  // Amount buttons → close this modal, open steps modal with pre-filled amount
  modal?.addEventListener('click', (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.donate-modal__amount');
    if (!btn) return;

    const text = btn.textContent?.trim() ?? '';
    const isOther = btn.classList.contains('donate-modal__amount--other');
    const amount = isOther ? undefined : parseFloat(text.replace(/[^0-9.]/g, ''));

    closeModal();

    if (typeof window.openDonateStepsModal === 'function') {
      window.openDonateStepsModal(amount);
    }
  });

  // Hook up trigger buttons in the page
  document.querySelectorAll<HTMLButtonElement>('.donate-form__btn').forEach((btn) => {
    btn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      openModal();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.footer__donate').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  document.querySelectorAll<HTMLButtonElement>('.pay-feed__btn').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  document.querySelectorAll<HTMLButtonElement>('.zoos-content__donate-btn').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });
})();
