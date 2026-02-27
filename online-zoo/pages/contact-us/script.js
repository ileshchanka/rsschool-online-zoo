const form = document.querySelector('.contact-form');

const rules = {
  name: {
    validate: (v) => v.trim().length >= 2,
    message: 'Please enter your name (at least 2 characters)',
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Please enter a valid email address',
  },
  subject: {
    validate: (v) => v.trim().length >= 2,
    message: 'Please enter a subject (at least 2 characters)',
  },
  message: {
    validate: (v) => v.trim().length >= 10,
    message: 'Please enter a message (at least 10 characters)',
  },
};

function getField(id) {
  return document.getElementById(id);
}

function setError(input, message) {
  const field = input.closest('.contact-form__field');
  field.classList.add('contact-form__field--error');
  input.classList.add('contact-form__input--error');

  let errorEl = field.querySelector('.contact-form__error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'contact-form__error';
    field.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(input) {
  const field = input.closest('.contact-form__field');
  field.classList.remove('contact-form__field--error');
  input.classList.remove('contact-form__input--error');
}

Object.keys(rules).forEach((id) => {
  const input = getField(id);
  if (!input) return;
  input.addEventListener('input', () => {
    if (rules[id].validate(input.value)) {
      clearError(input);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  Object.keys(rules).forEach((id) => {
    const input = getField(id);
    if (!input) return;
    if (!rules[id].validate(input.value)) {
      setError(input, rules[id].message);
      isValid = false;
    } else {
      clearError(input);
    }
  });

  if (isValid) {
    form.reset();
    alert('Your message has been sent!');
  }
});
