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

const dsm = document.getElementById('donateStepsModal');
const dsmOverlay = document.getElementById('donateStepsOverlay');
const dsmClose = document.getElementById('donateStepsClose');

function openDonateStepsModal() {
  dsm.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  goToStep(1);
}

function closeDonateStepsModal() {
  dsm.classList.remove('is-open');
  document.body.style.overflow = '';
}

function goToStep(n) {
  dsm.querySelectorAll('.dsm__step').forEach(function (s) {
    s.classList.remove('dsm__step--active');
  });
  const target = dsm.querySelector('[data-step="' + n + '"]');
  if (target) target.classList.add('dsm__step--active');
}

document.querySelectorAll('.pay-feed__btn, .footer__donate').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    openDonateStepsModal();
  });
});

dsmClose.addEventListener('click', closeDonateStepsModal);
dsmOverlay.addEventListener('click', closeDonateStepsModal);

function setInvalid(el, msg) {
  el.classList.add('is-invalid');
  let err = el.parentElement.querySelector('.dsm__error-msg');
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
  const err = el.parentElement.querySelector('.dsm__error-msg');
  if (err) err.classList.remove('is-visible');
}

function shake(el) {
  el.classList.remove('dsm__shake');
  void el.offsetWidth;
  el.classList.add('dsm__shake');
  el.addEventListener('animationend', function () { el.classList.remove('dsm__shake'); }, { once: true });
}

function validateStep(stepEl) {
  let valid = true;

  stepEl.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
  stepEl.querySelectorAll('.dsm__error-msg').forEach(function (el) { el.classList.remove('is-visible'); });
  stepEl.querySelectorAll('.dsm__amounts-wrap').forEach(function (el) { el.classList.remove('is-invalid'); });

  const amountsWrap = stepEl.querySelector('.dsm__amounts-wrap');
  if (amountsWrap) {
    const selected = amountsWrap.querySelector('.dsm__amount.is-selected');
    const otherInput = stepEl.querySelector('.dsm__side-input');
    if (!selected && (!otherInput || !otherInput.value.trim())) {
      amountsWrap.classList.add('is-invalid');
      shake(amountsWrap);
      let err = amountsWrap.querySelector('.dsm__error-msg');
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

  stepEl.querySelectorAll('.dsm__input[required], .dsm__input').forEach(function (input) {
    if (!input.closest('.dsm__field')) return;
    const validate = input.dataset.validate;
    const val = input.value.trim();

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
  const input = e.target.closest('.dsm__input, .dsm__side-input');
  if (input) {
    clearInvalid(input);

    if (input.dataset.validate === 'card') {
      const digits = input.value.replace(/\D/g, '').slice(0, 16);
      input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    if (input.dataset.validate === 'cvv') {
      input.value = input.value.replace(/\D/g, '').slice(0, 4);
    }
  }
});

dsm.addEventListener('change', function (e) {
  const sel = e.target.closest('.dsm__select-el');
  if (sel) sel.classList.remove('is-invalid');
});

dsm.addEventListener('click', function (e) {
  const nextBtn = e.target.closest('[data-next]');
  if (nextBtn) {
    const currentStep = nextBtn.closest('.dsm__step');
    if (!validateStep(currentStep)) return;
    goToStep(parseInt(nextBtn.dataset.next));
    return;
  }

  const backBtn = e.target.closest('[data-back]');
  if (backBtn) {
    e.preventDefault();
    goToStep(parseInt(backBtn.dataset.back));
    return;
  }

  const completeBtn = e.target.closest('.dsm__complete');
  if (completeBtn) {
    const currentStep = completeBtn.closest('.dsm__step');
    if (!validateStep(currentStep)) return;
    closeDonateStepsModal();
    return;
  }
});

dsm.addEventListener('click', function (e) {
  const amountBtn = e.target.closest('.dsm__amount');
  if (amountBtn) {
    dsm.querySelectorAll('.dsm__amount').forEach(function (b) {
      b.classList.remove('is-selected');
    });
    amountBtn.classList.add('is-selected');
  }
});

const petTrigger = document.getElementById('petSelectTrigger');
const petOptions = document.getElementById('petSelectOptions');
const petValue = document.getElementById('petSelectValue');

if (petTrigger) {
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
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDonateModal();
    closeDonateStepsModal();
  }
});
