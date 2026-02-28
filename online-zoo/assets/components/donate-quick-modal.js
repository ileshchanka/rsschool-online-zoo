(function () {
  if (!document.getElementById('donateModal')) {
    var el = document.createElement('div');
    el.innerHTML = '<div class="donate-modal" id="donateModal" role="dialog" aria-modal="true" aria-labelledby="donateModalTitle">'
      + '<div class="donate-modal__overlay" id="donateModalOverlay"></div>'
      + '<div class="donate-modal__window">'
      + '<button class="donate-modal__close" id="donateModalClose" aria-label="Close">&times;</button>'
      + '<img class="donate-modal__image" src="' + (function () {
        var s = document.currentScript || (function () { var scripts = document.getElementsByTagName('script'); return scripts[scripts.length - 1]; })();
        var base = s.src.replace(/\/[^/]+$/, '/');
        return base + '../images/popup-header.jpg';
      })() + '" alt="Together we care">'
      + '<div class="donate-modal__body">'
      + '<h2 class="donate-modal__title" id="donateModalTitle">Together we care, save and protect!</h2>'
      + '<p class="donate-modal__text">Your most generous gift not only cares for countless animals, but it also offers hope and a vital lifeline to the world\'s most endangered wildlife relying on us to survive.</p>'
      + '<div class="donate-modal__amounts">'
      + '<button class="donate-modal__amount" type="button">$20</button>'
      + '<button class="donate-modal__amount" type="button">$30</button>'
      + '<button class="donate-modal__amount" type="button">$50</button>'
      + '<button class="donate-modal__amount" type="button">$80</button>'
      + '<button class="donate-modal__amount" type="button">$100</button>'
      + '<button class="donate-modal__amount donate-modal__amount--other" type="button">Other amount</button>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
    document.body.appendChild(el.firstChild);
  }

  var modal = document.getElementById('donateModal');
  var overlay = document.getElementById('donateModalOverlay');
  var closeBtn = document.getElementById('donateModalClose');

  function openDonateModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  window.closeDonateModal = function () {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.donate-form__btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openDonateModal();
    });
  });

  closeBtn.addEventListener('click', window.closeDonateModal);
  overlay.addEventListener('click', window.closeDonateModal);

  modal.addEventListener('click', function (e) {
    var amountBtn = e.target.closest('.donate-modal__amount');
    if (amountBtn) {
      window.closeDonateModal();
      alert('Thank you for your donation! 🐾');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeDonateModal();
    }
  });
}());
