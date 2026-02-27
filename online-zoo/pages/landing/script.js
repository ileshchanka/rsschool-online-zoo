const donateModal = document.getElementById('donateModal');
const donateModalClose = document.getElementById('donateModalClose');
const donateModalOverlay = document.getElementById('donateModalOverlay');
const donateFormBtn = document.querySelector('.donate-form__btn');

function openDonateModal() {
  donateModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDonateModal() {
  donateModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

donateFormBtn.addEventListener('click', function (e) {
  e.preventDefault();
  openDonateModal();
});

donateModalClose.addEventListener('click', closeDonateModal);
donateModalOverlay.addEventListener('click', closeDonateModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDonateModal();
  }
});
