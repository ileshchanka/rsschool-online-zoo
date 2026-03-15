(function () {
  'use strict';

  var API             = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
  var SAVED_CARDS_KEY = 'zoo_saved_cards';
  var AUTH_TOKEN_KEY  = 'zoo_auth_token';

  var selectedAmount  = null;
  var selectedPetId   = null;
  var selectedPetName = '';
  var petsCache       = null;

  var modalHTML =
    '<div class="dsm" id="donateStepsModal" role="dialog" aria-modal="true">'
  + '<div class="dsm__overlay" id="donateStepsOverlay"></div>'
  + '<div class="dsm__window">'
  + '<button class="dsm__close" id="donateStepsClose" aria-label="Close">&times;</button>'
  + '<div class="dsm__header"><h2 class="dsm__title">Make your donation</h2></div>'

  + '<div class="dsm__step dsm__step--active" data-step="1"><div class="dsm__body">'
  + '<p class="dsm__section-title">Donation Information:</p><hr class="dsm__divider">'
  + '<p class="dsm__label"><span class="dsm__req">*</span> Choose your donation amount:</p>'
  + '<div class="dsm__amounts-wrap"><div class="dsm__amounts" id="dsmAmounts">'
  + '<button class="dsm__amount" type="button" data-value="10">$10</button>'
  + '<button class="dsm__amount" type="button" data-value="20">$20</button>'
  + '<button class="dsm__amount" type="button" data-value="30">$30</button>'
  + '<button class="dsm__amount" type="button" data-value="50">$50</button>'
  + '<button class="dsm__amount" type="button" data-value="80">$80</button>'
  + '<button class="dsm__amount" type="button" data-value="100">$100</button>'
  + '</div></div>'
  + '<div class="dsm__row">'
  + '<button class="dsm__side-btn dsm__side-btn--dark" type="button" id="dsmOtherAmtBtn">Other amount</button>'
  + '<input class="dsm__side-input" id="dsmOtherAmt" type="number" min="0.01" step="0.01" placeholder="">'
  + '</div>'
  + '<div class="dsm__row">'
  + '<button class="dsm__side-btn" type="button">For special pet</button>'
  + '<div class="dsm__select" id="petSelect">'
  + '<div class="dsm__select-trigger" id="petSelectTrigger">'
  + '<span id="petSelectValue" class="dsm__select-placeholder">Choose your favourite</span>'
  + '<span class="dsm__select-arrow"></span>'
  + '</div>'
  + '<ul class="dsm__select-options" id="petSelectOptions"></ul>'
  + '</div>'
  + '</div>'
  + '<label class="dsm__checkbox-wrap">'
  + '<input class="dsm__checkbox" type="checkbox" id="dsmMonthly">'
  + '<span class="dsm__checkbox-label">Make this a monthly recurring gift</span>'
  + '</label>'
  + '<div class="dsm__footer">'
  + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot"></span><span class="dsm__dot"></span></div>'
  + '<button class="dsm__next" type="button" data-next="2" id="dsmStep1Next" disabled>Next</button>'
  + '</div></div></div>'

  + '<div class="dsm__step" data-step="2"><div class="dsm__body">'
  + '<p class="dsm__section-title">Billing Information:</p><hr class="dsm__divider">'
  + '<div class="dsm__field">'
  + '<label class="dsm__label"><span class="dsm__req">*</span> Your Name</label>'
  + '<input class="dsm__input" id="dsmName" type="text" placeholder="First and last name">'
  + '</div>'
  + '<div class="dsm__field">'
  + '<label class="dsm__label"><span class="dsm__req">*</span> Your Email Address</label>'
  + '<input class="dsm__input" id="dsmEmail" type="email" placeholder="Enter your email">'
  + '<p class="dsm__hint">You will receive emails from the Online Zoo, including updates and news on the latest discoveries. You can unsubscribe at any time.</p>'
  + '</div>'
  + '<div class="dsm__footer">'
  + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot"></span></div>'
  + '<a class="dsm__back" href="#" data-back="1">Back</a>'
  + '<button class="dsm__next" type="button" data-next="3" id="dsmStep2Next" disabled>Next</button>'
  + '</div></div></div>'

  + '<div class="dsm__step" data-step="3"><div class="dsm__body">'
  + '<p class="dsm__section-title">Payment Information:</p><hr class="dsm__divider">'
  + '<div id="dsmSavedCardsRow" class="dsm__field" style="display:none">'
  + '<label class="dsm__label">Saved cards</label>'
  + '<div class="dsm__select" id="dsmSavedCardsSelect">'
  + '<div class="dsm__select-trigger" id="dsmSavedCardsTrigger">'
  + '<span id="dsmSavedCardsValue" class="dsm__select-placeholder">Enter new card</span>'
  + '<span class="dsm__select-arrow"></span>'
  + '</div>'
  + '<ul class="dsm__select-options" id="dsmSavedCardsOptions"></ul>'
  + '</div>'
  + '</div>'
  + '<div class="dsm__field">'
  + '<label class="dsm__label"><span class="dsm__req">*</span> Credit Card Number</label>'
  + '<input class="dsm__input" id="dsmCardNumber" type="text" placeholder="1234 5678 9012 3456" data-validate="card" maxlength="19">'
  + '</div>'
  + '<div class="dsm__row dsm__row--fields">'
  + '<div class="dsm__field dsm__field--cvv">'
  + '<label class="dsm__label"><span class="dsm__req">*</span> CVV</label>'
  + '<input class="dsm__input" id="dsmCvv" type="text" placeholder="123" data-validate="cvv" maxlength="3">'
  + '</div>'
  + '<div class="dsm__field">'
  + '<label class="dsm__label"><span class="dsm__req">*</span> Expiration Date</label>'
  + '<div class="dsm__row dsm__row--exp" id="dsmExpRow"></div>'
  + '</div>'
  + '</div>'
  + '<label id="dsmSaveCardRow" class="dsm__checkbox-wrap" style="display:none">'
  + '<input class="dsm__checkbox" type="checkbox" id="dsmSaveCard">'
  + '<span class="dsm__checkbox-label">Save card for future donations</span>'
  + '</label>'
  + '<div class="dsm__footer">'
  + '<div class="dsm__dots"><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span><span class="dsm__dot dsm__dot--active"></span></div>'
  + '<a class="dsm__back" href="#" data-back="2">Back</a>'
  + '<button class="dsm__complete" type="button" id="dsmComplete" disabled>Complete donation</button>'
  + '</div></div></div>'

  + '<div class="dsm__step" data-step="4"><div class="dsm__body dsm__body--complete">'
  + '<div id="dsmCompleteContent" class="dsm__complete-content"></div>'
  + '<div class="dsm__footer dsm__footer--center">'
  + '<button class="dsm__complete" type="button" id="dsmCloseBtn">Close</button>'
  + '</div></div></div>'

  + '</div></div>';

  var container = document.createElement('div');
  container.innerHTML = modalHTML;
  document.body.appendChild(container.firstChild);

  var dsm        = document.getElementById('donateStepsModal');
  var dsmOverlay = document.getElementById('donateStepsOverlay');
  var dsmClose   = document.getElementById('donateStepsClose');

  function getToken()   { return localStorage.getItem(AUTH_TOKEN_KEY); }
  function isLoggedIn() { return !!getToken(); }

  function getSavedCards() {
    try { return JSON.parse(localStorage.getItem(SAVED_CARDS_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function cardLabel(number) {
    var d = (number || '').replace(/\D/g, '');
    return d.slice(0, 4) + ' **** **** ' + d.slice(12, 16);
  }

  function safeHtml(str) {
    var d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

  function shake(el) {
    el.classList.remove('dsm__shake');
    void el.offsetWidth;
    el.classList.add('dsm__shake');
    el.addEventListener('animationend', function () { el.classList.remove('dsm__shake'); }, { once: true });
  }

  function isValidCustomAmount(raw) {
    if (!raw || /[eE]/.test(raw)) return false;
    var v = parseFloat(raw);
    return !isNaN(v) && isFinite(v) && v > 0;
  }

  function validateName(v) {
    return /^[A-Za-z\s]+$/.test(v.trim()) && v.trim().length > 0;
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function isExpiryFuture(month, year) {
    if (!month || !year) return false;
    var now = new Date();
    var y   = parseInt(year,  10);
    var m   = parseInt(month, 10);
    return y > now.getFullYear() || (y === now.getFullYear() && m >= (now.getMonth() + 1));
  }

  function goToStep(n) {
    dsm.querySelectorAll('.dsm__step').forEach(function (s) { s.classList.remove('dsm__step--active'); });
    var target = dsm.querySelector('[data-step="' + n + '"]');
    if (target) target.classList.add('dsm__step--active');
  }

  function getEffectiveAmount() {
    if (selectedAmount !== null) return selectedAmount;
    var el = document.getElementById('dsmOtherAmt');
    return (el && isValidCustomAmount(el.value)) ? parseFloat(el.value) : null;
  }

  function updateStep1Next() {
    var btn = document.getElementById('dsmStep1Next');
    if (btn) btn.disabled = !(getEffectiveAmount() !== null && selectedPetId !== null);
  }

  function updateStep2Next() {
    var nameEl  = document.getElementById('dsmName');
    var emailEl = document.getElementById('dsmEmail');
    var btn     = document.getElementById('dsmStep2Next');
    if (!btn || !nameEl || !emailEl) return;
    btn.disabled = !(validateName(nameEl.value) && validateEmail(emailEl.value));
  }

  function updateCompleteBtn() {
    var cardEl  = document.getElementById('dsmCardNumber');
    var cvvEl   = document.getElementById('dsmCvv');
    var monthEl = document.getElementById('dsmExpMonth');
    var yearEl  = document.getElementById('dsmExpYear');
    var btn     = document.getElementById('dsmComplete');
    if (!btn) return;
    var cardOk = cardEl  && /^\d{16}$/.test(cardEl.value.replace(/\s/g, ''));
    var cvvOk  = cvvEl   && /^\d{3}$/.test(cvvEl.value);
    var expOk  = monthEl && yearEl && isExpiryFuture(monthEl.value, yearEl.value);
    btn.disabled = !(cardOk && cvvOk && expOk);
  }

  function populatePets(pets, preselectedId) {
    var list    = document.getElementById('petSelectOptions');
    var valueEl = document.getElementById('petSelectValue');
    if (!list) return;
    list.innerHTML = '';

    pets.forEach(function (pet) {
      var label = pet.name + ' the ' + pet.commonName;
      var li    = document.createElement('li');
      li.dataset.value = String(pet.id);
      li.textContent   = label;

      if (pet.id === preselectedId) {
        li.classList.add('is-selected');
        selectedPetId   = pet.id;
        selectedPetName = label;
        if (valueEl) {
          valueEl.textContent = label;
          valueEl.classList.remove('dsm__select-placeholder');
        }
      }

      li.addEventListener('click', function () {
        list.querySelectorAll('li').forEach(function (l) { l.classList.remove('is-selected'); });
        li.classList.add('is-selected');
        selectedPetId   = pet.id;
        selectedPetName = label;
        if (valueEl) {
          valueEl.textContent = label;
          valueEl.classList.remove('dsm__select-placeholder');
        }
        list.classList.remove('is-open');
        updateStep1Next();
      });

      list.appendChild(li);
    });

    updateStep1Next();
  }

  async function loadPets(preselectedId) {
    if (petsCache) { populatePets(petsCache, preselectedId); return; }
    try {
      var res  = await fetch(API + '/pets');
      if (!res.ok) throw new Error('Failed to load pets');
      var json = await res.json();
      petsCache = json.data || [];
      populatePets(petsCache, preselectedId);
    } catch (e) {
      var list = document.getElementById('petSelectOptions');
      if (list) list.innerHTML = '<li style="color:#e53935;cursor:default;padding:14px 16px">Could not load pets</li>';
    }
  }

  async function prefillProfile() {
    var token = getToken();
    if (!token) return;
    try {
      var res  = await fetch(API + '/auth/profile', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) return;
      var data = await res.json();
      var nameEl  = document.getElementById('dsmName');
      var emailEl = document.getElementById('dsmEmail');
      if (nameEl  && data.name)  nameEl.value  = data.name;
      if (emailEl && data.email) emailEl.value = data.email;
      updateStep2Next();
    } catch (e) {  }
  }

  function buildExpirySelects() {
    var expRow  = document.getElementById('dsmExpRow');
    if (!expRow) return;
    var curYear = new Date().getFullYear();

    var html = '<div class="dsm__select dsm__select--native">'
      + '<select class="dsm__select-el" id="dsmExpMonth">'
      + '<option value="" disabled selected>Month</option>';
    for (var m = 1; m <= 12; m++) {
      var mm = (m < 10 ? '0' : '') + m;
      html += '<option value="' + mm + '">' + mm + '</option>';
    }
    html += '</select><span class="dsm__select-arrow"></span></div>';

    html += '<div class="dsm__select dsm__select--native">'
      + '<select class="dsm__select-el" id="dsmExpYear">'
      + '<option value="" disabled selected>Year</option>';
    for (var y = curYear; y <= curYear + 9; y++) {
      html += '<option value="' + y + '">' + y + '</option>';
    }
    html += '</select><span class="dsm__select-arrow"></span></div>';

    expRow.innerHTML = html;
    document.getElementById('dsmExpMonth').addEventListener('change', updateCompleteBtn);
    document.getElementById('dsmExpYear').addEventListener('change',  updateCompleteBtn);
  }

  function clearCardFields() {
    ['dsmCardNumber', 'dsmCvv'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var m = document.getElementById('dsmExpMonth');
    var y = document.getElementById('dsmExpYear');
    if (m) m.value = '';
    if (y) y.value = '';
    updateCompleteBtn();
  }

  function prefillCard(card) {
    var cardEl  = document.getElementById('dsmCardNumber');
    var monthEl = document.getElementById('dsmExpMonth');
    var yearEl  = document.getElementById('dsmExpYear');
    if (cardEl)  cardEl.value  = card.number   || '';
    if (monthEl) monthEl.value = card.expMonth || '';
    if (yearEl)  yearEl.value  = card.expYear  || '';
    var cvvEl = document.getElementById('dsmCvv');
    if (cvvEl) cvvEl.value = '';
    updateCompleteBtn();
  }

  function setupSavedCards() {
    var savedRow = document.getElementById('dsmSavedCardsRow');
    var saveRow  = document.getElementById('dsmSaveCardRow');

    if (!isLoggedIn()) {
      if (savedRow) savedRow.style.display = 'none';
      if (saveRow)  saveRow.style.display  = 'none';
      return;
    }

    if (saveRow) {
      saveRow.style.display = '';
      var cb = document.getElementById('dsmSaveCard');
      if (cb) cb.checked = false;
    }

    var cards = getSavedCards();
    if (cards.length === 0) {
      if (savedRow) savedRow.style.display = 'none';
      return;
    }

    if (savedRow) savedRow.style.display = '';

    var list    = document.getElementById('dsmSavedCardsOptions');
    var valueEl = document.getElementById('dsmSavedCardsValue');
    if (!list) return;
    list.innerHTML = '';

    var newLi = document.createElement('li');
    newLi.textContent = 'Enter new card';
    newLi.classList.add('is-selected');
    newLi.addEventListener('click', function () {
      list.querySelectorAll('li').forEach(function (l) { l.classList.remove('is-selected'); });
      newLi.classList.add('is-selected');
      if (valueEl) { valueEl.textContent = 'Enter new card'; valueEl.classList.add('dsm__select-placeholder'); }
      clearCardFields();
      if (saveRow) saveRow.style.display = '';
      list.classList.remove('is-open');
    });
    list.appendChild(newLi);

    cards.forEach(function (card) {
      var li = document.createElement('li');
      li.textContent = cardLabel(card.number);
      li.addEventListener('click', function () {
        list.querySelectorAll('li').forEach(function (l) { l.classList.remove('is-selected'); });
        li.classList.add('is-selected');
        if (valueEl) { valueEl.textContent = cardLabel(card.number); valueEl.classList.remove('dsm__select-placeholder'); }
        prefillCard(card);
        if (saveRow) saveRow.style.display = 'none';
        list.classList.remove('is-open');
      });
      list.appendChild(li);
    });

    if (valueEl) { valueEl.textContent = 'Enter new card'; valueEl.classList.add('dsm__select-placeholder'); }
  }

  async function submitDonation() {
    var token      = getToken();
    var amount     = getEffectiveAmount();
    var nameEl     = document.getElementById('dsmName');
    var emailEl    = document.getElementById('dsmEmail');
    var cardEl     = document.getElementById('dsmCardNumber');
    var saveCardEl = document.getElementById('dsmSaveCard');
    var content    = document.getElementById('dsmCompleteContent');

    if (isLoggedIn() && saveCardEl && saveCardEl.checked && cardEl) {
      var monthEl2 = document.getElementById('dsmExpMonth');
      var yearEl2  = document.getElementById('dsmExpYear');
      var digits   = (cardEl.value || '').replace(/\s/g, '');
      var cards    = getSavedCards();
      var exists   = cards.some(function (c) { return (c.number || '').replace(/\s/g, '') === digits; });
      if (!exists) {
        cards.push({ number: cardEl.value.trim(), expMonth: monthEl2 ? monthEl2.value : '', expYear: yearEl2 ? yearEl2.value : '' });
        localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(cards));
      }
    }

    goToStep(4);
    if (content) content.innerHTML = '<div class="dsm__complete-spinner"></div>';

    var body    = {
      amount:  amount,
      petId:   selectedPetId,
      name:    nameEl  ? nameEl.value.trim()  : '',
      email:   emailEl ? emailEl.value.trim() : ''
    };
    var headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    try {
      var res = await fetch(API + '/donations', { method: 'POST', headers: headers, body: JSON.stringify(body) });
      if (!res.ok) {
        var errBody = null;
        try { errBody = await res.json(); } catch (e2) {  }
        if (res.status === 403) throw new Error('Please sign in to complete your donation.');
        throw new Error((errBody && errBody.message) ? errBody.message : 'Something went wrong. Please, try again later.');
      }
      var amtDisplay = '$' + (Number.isInteger(amount) ? amount : amount.toFixed(2));
      if (content) content.innerHTML =
          '<div class="dsm__complete-icon dsm__complete-icon--success">&#10003;</div>'
        + '<p class="dsm__complete-msg">Thank you for your donation of '
        + safeHtml(amtDisplay) + ' to ' + safeHtml(selectedPetName) + '!</p>';
    } catch (err) {
      if (content) content.innerHTML =
          '<div class="dsm__complete-icon dsm__complete-icon--error">&#10005;</div>'
        + '<p class="dsm__complete-msg dsm__complete-msg--error">'
        + safeHtml((err && err.message) || 'Something went wrong. Please, try again later.') + '</p>';
    }
  }

  function resetModal(preselectedPetId) {
    selectedAmount  = null;
    selectedPetId   = null;
    selectedPetName = '';

    dsm.querySelectorAll('.dsm__amount').forEach(function (b) { b.classList.remove('is-selected'); });
    var otherAmt = document.getElementById('dsmOtherAmt');
    if (otherAmt) otherAmt.value = '';
    var monthly = document.getElementById('dsmMonthly');
    if (monthly) monthly.checked = false;
    var petValueEl = document.getElementById('petSelectValue');
    if (petValueEl) { petValueEl.textContent = 'Choose your favourite'; petValueEl.classList.add('dsm__select-placeholder'); }
    if (!preselectedPetId) {
      var petOpts = document.getElementById('petSelectOptions');
      if (petOpts) petOpts.querySelectorAll('li').forEach(function (l) { l.classList.remove('is-selected'); });
    }
    updateStep1Next();

    clearCardFields();
    var saveCardEl2 = document.getElementById('dsmSaveCard');
    if (saveCardEl2) saveCardEl2.checked = false;
    var savedCardsValueEl = document.getElementById('dsmSavedCardsValue');
    if (savedCardsValueEl) { savedCardsValueEl.textContent = 'Enter new card'; savedCardsValueEl.classList.add('dsm__select-placeholder'); }
  }

  window.openDonateStepsModal = function (preselectedPetId) {
    resetModal(preselectedPetId || null);
    goToStep(1);
    dsm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    loadPets(preselectedPetId || null);
    prefillProfile();
    setupSavedCards();
  };

  window.closeDonateStepsModal = function () {
    dsm.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  buildExpirySelects();

  dsmClose.addEventListener('click',   window.closeDonateStepsModal);
  dsmOverlay.addEventListener('click', window.closeDonateStepsModal);

  dsm.addEventListener('click', function (e) {
    var amtBtn = e.target.closest('.dsm__amount');
    if (amtBtn) {
      dsm.querySelectorAll('.dsm__amount').forEach(function (b) { b.classList.remove('is-selected'); });
      amtBtn.classList.add('is-selected');
      selectedAmount = parseFloat(amtBtn.dataset.value);
      var otherEl = document.getElementById('dsmOtherAmt');
      if (otherEl) otherEl.value = '';
      updateStep1Next();
      return;
    }

    if (e.target.closest('#petSelectTrigger')) {
      e.stopPropagation();
      var opts = document.getElementById('petSelectOptions');
      if (opts) opts.classList.toggle('is-open');
      return;
    }

    if (e.target.closest('#dsmSavedCardsTrigger')) {
      e.stopPropagation();
      var savedOpts = document.getElementById('dsmSavedCardsOptions');
      if (savedOpts) savedOpts.classList.toggle('is-open');
      return;
    }

    var nextBtn = e.target.closest('[data-next]');
    if (nextBtn && !nextBtn.disabled) {
      goToStep(parseInt(nextBtn.dataset.next, 10));
      return;
    }

    var backBtn = e.target.closest('[data-back]');
    if (backBtn) {
      e.preventDefault();
      goToStep(parseInt(backBtn.dataset.back, 10));
      return;
    }

    var completeBtn = e.target.closest('#dsmComplete');
    if (completeBtn && !completeBtn.disabled) {
      submitDonation();
      return;
    }

    if (e.target.closest('#dsmCloseBtn')) {
      window.closeDonateStepsModal();
      return;
    }
  });

  dsm.addEventListener('input', function (e) {
    var el = e.target;

    if (el.id === 'dsmOtherAmt') {
      selectedAmount = null;
      dsm.querySelectorAll('.dsm__amount').forEach(function (b) { b.classList.remove('is-selected'); });
      updateStep1Next();
    }

    if (el.dataset.validate === 'card') {
      var digits = el.value.replace(/\D/g, '').slice(0, 16);
      el.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      updateCompleteBtn();
    }

    if (el.dataset.validate === 'cvv') {
      el.value = el.value.replace(/\D/g, '').slice(0, 3);
      updateCompleteBtn();
    }

    if (el.id === 'dsmName' || el.id === 'dsmEmail') {
      updateStep2Next();
    }
  });

  document.addEventListener('click', function () {
    var petOpts   = document.getElementById('petSelectOptions');
    if (petOpts)   petOpts.classList.remove('is-open');
    var savedOpts = document.getElementById('dsmSavedCardsOptions');
    if (savedOpts) savedOpts.classList.remove('is-open');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeDonateStepsModal();
  });

  document.querySelectorAll('.footer__donate, .pay-feed__btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.openDonateStepsModal(null);
    });
  });
}());
