const getSelector = selector => document.querySelector(selector);

let isLoginFormShow = false; // state

const validateFieldEmail = email => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(email);
};

// Show Login Form
const showLoginForm = () => {
  const loginForm = getSelector('.login');

  loginForm.classList.add('login--show');

  isLoginFormShow = !isLoginFormShow;
};

// Hide Login Form
const hideLoginForm = () => {
  const loginForm = getSelector('.login');

  loginForm.classList.remove('login--show');
  isLoginFormShow = !isLoginFormShow;
};

// Validate Login Form
const validateLoginForm = () => {
  const emailField = getSelector('.field__input[type="email"]');
  const passField = getSelector('.field__input[type="password"]');

  const emailFieldValue = emailField.value;
  const passFieldValue = passField.value;

  const isValidateFieldEmail = validateFieldEmail(emailFieldValue);

  if (!isValidateFieldEmail) {
    emailField.parentNode.classList.add('field--error');
  } else {
    emailField.parentNode.classList.remove('field--error');
  }

  return isValidateFieldEmail && passFieldValue !== '';
};

const submitLoginForm = () => {
  const isValidForm = validateLoginForm();

  if (!isValidForm) {
    return;
  }

  hideLoginForm();

  console.log('🫡 ----> Request');
};

const loginBtn = getSelector('.login__btn');

loginBtn.addEventListener('click', () => {
  if (!isLoginFormShow) {
    showLoginForm();
  } else {
    const emailValue = getSelector('.field__input[type="email"]').value;
    const passwordValue = getSelector('.field__input[type="password"]').value;

    if (emailValue === '' && passwordValue === '') {
      hideLoginForm();
    } else {
      submitLoginForm();
    }
  }
});
