(function () {
  var modalHTML = '<div class="dsm" id="donateStepsModal" role="dialog" aria-modal="true">'
    + '<div class="dsm__overlay" id="donateStepsOverlay"></div>'
    + '<div class="dsm__window">'
    + '<button class="dsm__close" id="donateStepsClose" aria-label="Close">&times;</button>'
    + '<div class="dsm__header"><h2 class="dsm__title">Make your donation</h2></div>'

    + '<div class="dsm__step dsm__step--active" data-step="1">'
    + '<div class="dsm__body">'
    + '<p class="dsm__section-title">Donation Information:</p>'
    + '<hr class="dsm__divider">'
    + '<p class="dsm__label"><span class="dsm__req">*</span> Choose your donation amount:</p>'
    + '<div class="dsm__amounts-wrap"><div class="dsm__amounts">'
    + '<button class="dsm__amount" type="button">$10</button>'
    + '<button class="dsm__amount" type="button">$20</button>'
    + '<button class="dsm__amount" type="button">$30</button>'
    + '<button class="dsm__amount" type="button">$50</button>'
    + '<button class="dsm__amount" type="button">$80</button>'
    + '<button class="dsm__amount" type="button">$100</button>'
    + '</div></div>'
    + '<div class="dsm__row">'
    + '<button class="dsm__side-btn dsm__side-btn--dark" type="button">Other amount</button>'
    + '<input class="dsm__side-input" type="number" placeholder="">'
    + '</div>'
    + '<div class="dsm__row">'
    + '<button class="dsm__side-btn" type="button">For special pet</button>'
    + '<div class="dsm__select" id="petSelect">'
    + '<div class="dsm__select-trigger" id="petSelectTrigger">'
    + '<span id="petSelectValue">Choose your favourite</span>'
    + '<span class="dsm__select-arrow"></span>'
    + '</div>'
    + '<ul class="dsm__select-options" id="petSelectOptions">'
    + '<li data-value="lucas">Lukas the Panda</li>'
    + '<li data-value="andy">Andy the Lemur</li>'
    + '<li data-value="glen">Glen the Gorilla</li>'
    + '<li data-value="mike">Mike the Alligator</li>'
    + '<li data-value="sam">Sam &amp; Lora the eagles family</li>'
    + '<li data-value="liz">Liz the Koala</li>'
    + '<li data-value="shake">Shake the Lion</li>'
    + '<li data-value="senja">Senja the Tiger</li>'
    + '</ul>'
    + '</div>'
    + '</div>'
    + '<label class="dsm__checkbox-wrap">'
    + '<input class="dsm__checkbox" type="checkbox">'
    + '<span class="dsm__checkbox-label">Make this a monthly recurring gift</span>'
    + '</label>'
    + '<div class="dsm__footer">'
    + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot"></span><span class="dsm__dot"></span></div>'
    + '<button class="dsm__next" type="button" data-next="2">Next</button>'
    + '</div>'
    + '</div></div>'

    + '<div class="dsm__step" data-step="2">'
    + '<div class="dsm__body">'
    + '<p class="dsm__section-title">Billing Information:</p>'
    + '<hr class="dsm__divider">'
    + '<div class="dsm__field"><label class="dsm__label"><span class="dsm__req">*</span> Your Name</label><input class="dsm__input" type="text" placeholder="First and last name"></div>'
    + '<div class="dsm__field"><label class="dsm__label"><span class="dsm__req">*</span> Your Email Address</label><input class="dsm__input" type="email" placeholder="Enter your email"><p class="dsm__hint">You will receive emails from the Online Zoo, including updates and news on the latest discoveries and translations. You can unsubscribe at any time.</p></div>'
    + '<div class="dsm__footer">'
    + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot"></span></div>'
    + '<a class="dsm__back" href="#" data-back="1">Back</a>'
    + '<button class="dsm__next" type="button" data-next="3">Next</button>'
    + '</div>'
    + '</div></div>'

    + '<div class="dsm__step" data-step="3">'
    + '<div class="dsm__body">'
    + '<p class="dsm__section-title">Payment Information:</p>'
    + '<hr class="dsm__divider">'
    + '<div class="dsm__field"><label class="dsm__label"><span class="dsm__req">*</span> Credit Card Number</label><input class="dsm__input" type="text" placeholder="1234 5678 9012 3456" data-validate="card" maxlength="19"></div>'
    + '<div class="dsm__field dsm__field--cvv"><label class="dsm__label"><span class="dsm__req">*</span> CVV Number</label><input class="dsm__input" type="text" placeholder="123" data-validate="cvv" maxlength="4"></div>'
    + '<div class="dsm__field"><label class="dsm__label"><span class="dsm__req">*</span> Expiration Date</label>'
    + '<div class="dsm__row dsm__row--exp">'
    + '<div class="dsm__select dsm__select--native"><select class="dsm__select-el"><option value="" disabled selected>Month</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select><span class="dsm__select-arrow"></span></div>'
    + '<div class="dsm__select dsm__select--native"><select class="dsm__select-el"><option value="" disabled selected>Year</option><option>2026</option><option>2027</option><option>2028</option><option>2029</option><option>2030</option><option>2031</option><option>2032</option><option>2033</option><option>2034</option></select><span class="dsm__select-arrow"></span></div>'
    + '</div></div>'
    + '<div class="dsm__footer">'
    + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span></div>'
    + '<a class="dsm__back" href="#" data-back="2">Back</a>'
    + '<button class="dsm__complete" type="button">Complete donation</button>'
    + '</div>'
    + '</div></div>'

    + '</div></div>';

  var container = document.createElement('div');
  container.innerHTML = modalHTML;
  document.body.appendChild(container.firstChild);

  var dsm = document.getElementById('donateStepsModal');
  var dsmOverlay = document.getElementById('donateStepsOverlay');
  var dsmClose = document.getElementById('donateStepsClose');

  function openDonateStepsModal() {
    dsm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    goToStep(1);
  }

  window.closeDonateStepsModal = function () {
    dsm.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  function goToStep(n) {
    dsm.querySelectorAll('.dsm__step').forEach(function (s) {
      s.classList.remove('dsm__step--active');
    });
    var target = dsm.querySelector('[data-step="' + n + '"]');
    if (target) target.classList.add('dsm__step--active');
  }

  document.querySelectorAll('.footer__donate, .pay-feed__btn, .zoos-content__donate-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openDonateStepsModal();
    });
  });

  dsmClose.addEventListener('click', window.closeDonateStepsModal);
  dsmOverlay.addEventListener('click', window.closeDonateStepsModal);

  function setInvalid(el, msg) {
    el.classList.add('is-invalid');
    var err = el.parentElement.querySelector('.dsm__error-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'dsm__error-msg';
      el.parentElement.appendChild(err);
    }
    err.textContent = msg || 'This field is required';
    err.classList.add('is-visible');
  }

  function clearInvalid(el) {
    el.classList.remove('is-invalid');
    var err = el.parentElement.querySelector('.dsm__error-msg');
    if (err) err.classList.remove('is-visible');
  }

  function shake(el) {
    el.classList.remove('dsm__shake');
    void el.offsetWidth;
    el.classList.add('dsm__shake');
    el.addEventListener('animationend', function () { el.classList.remove('dsm__shake'); }, { once: true });
  }

  function validateStep(stepEl) {
    var valid = true;

    stepEl.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
    stepEl.querySelectorAll('.dsm__error-msg').forEach(function (el) { el.classList.remove('is-visible'); });
    stepEl.querySelectorAll('.dsm__amounts-wrap').forEach(function (el) { el.classList.remove('is-invalid'); });

    var amountsWrap = stepEl.querySelector('.dsm__amounts-wrap');
    if (amountsWrap) {
      var selected = amountsWrap.querySelector('.dsm__amount.is-selected');
      var otherInput = stepEl.querySelector('.dsm__side-input');
      if (!selected && (!otherInput || !otherInput.value.trim())) {
        amountsWrap.classList.add('is-invalid');
        shake(amountsWrap);
        var err = amountsWrap.querySelector('.dsm__error-msg');
        if (!err) {
          err = document.createElement('span');
          err.className = 'dsm__error-msg';
          amountsWrap.appendChild(err);
        }
        err.textContent = 'Please choose or enter a donation amount';
        err.classList.add('is-visible');
        valid = false;
      }
    }

    stepEl.querySelectorAll('.dsm__input').forEach(function (input) {
      if (!input.closest('.dsm__field')) return;
      var validate = input.dataset.validate;
      var val = input.value.trim();

      if (!val) {
        setInvalid(input, 'This field is required');
        shake(input);
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setInvalid(input, 'Please enter a valid email address');
        shake(input);
        valid = false;
      } else if (validate === 'card' && !/^\d{16}$/.test(val.replace(/\s/g, ''))) {
        setInvalid(input, 'Enter a valid 16-digit card number');
        shake(input);
        valid = false;
      } else if (validate === 'cvv' && !/^\d{3,4}$/.test(val)) {
        setInvalid(input, 'CVV must be 3 or 4 digits');
        shake(input);
        valid = false;
      } else {
        clearInvalid(input);
      }
    });

    stepEl.querySelectorAll('.dsm__select-el').forEach(function (sel) {
      if (!sel.value) {
        sel.classList.add('is-invalid');
        shake(sel.closest('.dsm__select--native'));
        valid = false;
      } else {
        sel.classList.remove('is-invalid');
      }
    });

    return valid;
  }

  dsm.addEventListener('input', function (e) {
    var input = e.target.closest('.dsm__input, .dsm__side-input');
    if (input) {
      clearInvalid(input);
      if (input.dataset.validate === 'card') {
        var digits = input.value.replace(/\D/g, '').slice(0, 16);
        input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      }
      if (input.dataset.validate === 'cvv') {
        input.value = input.value.replace(/\D/g, '').slice(0, 4);
      }
    }
  });

  dsm.addEventListener('change', function (e) {
    var sel = e.target.closest('.dsm__select-el');
    if (sel) sel.classList.remove('is-invalid');
  });

  dsm.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('[data-next]');
    if (nextBtn) {
      var currentStep = nextBtn.closest('.dsm__step');
      if (!validateStep(currentStep)) return;
      goToStep(parseInt(nextBtn.dataset.next));
      return;
    }

    var backBtn = e.target.closest('[data-back]');
    if (backBtn) {
      e.preventDefault();
      goToStep(parseInt(backBtn.dataset.back));
      return;
    }

    var completeBtn = e.target.closest('.dsm__complete');
    if (completeBtn) {
      var currentStep = completeBtn.closest('.dsm__step');
      if (!validateStep(currentStep)) return;
      window.closeDonateStepsModal();
      alert('Thank you for your donation! 🐾');
      return;
    }

    var amountBtn = e.target.closest('.dsm__amount');
    if (amountBtn) {
      dsm.querySelectorAll('.dsm__amount').forEach(function (b) { b.classList.remove('is-selected'); });
      amountBtn.classList.add('is-selected');
      return;
    }
  });

  var petTrigger = document.getElementById('petSelectTrigger');
  var petOptions = document.getElementById('petSelectOptions');
  var petValue = document.getElementById('petSelectValue');

  petTrigger.addEventListener('click', function (e) {
    e.stopPropagation();
    petOptions.classList.toggle('is-open');
  });

  petOptions.querySelectorAll('li').forEach(function (li) {
    li.addEventListener('click', function () {
      petOptions.querySelectorAll('li').forEach(function (l) { l.classList.remove('is-selected'); });
      li.classList.add('is-selected');
      petValue.textContent = li.textContent;
      petOptions.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function () {
    petOptions.classList.remove('is-open');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeDonateStepsModal();
    }
  });
}());
