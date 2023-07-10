const url = 'http://www.mocky.io/v2/5dfcef48310000ee0ed2c281'; // API

const getSelector = selector => document.querySelector(selector);

let isLoginFormShow = false; // state for login form

const validateFieldEmail = email => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(email);
};

const validateFieldEmpty = field => {
  return field.length > 0;
};

const validateFieldPassword = field => {
  return field.length > 6;
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

// Submit Login Form
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

// RegForm

const fields = document.querySelectorAll('[data-step-field]');
const stepItems = document.querySelectorAll('.step');
const stepBtnNext = getSelector('.step__btn--next');
const stepBtnBack = getSelector('.step__btn--prev');

// Custom Select

const customSelect = element => {
  const select = document.createElement('div');
  select.classList.add('select');
  select.setAttribute('name', element.getAttribute('name'));

  const selectOption = document.createElement('div');
  selectOption.classList.add('select__option');

  selectOption.textContent = 'Select';

  const selectList = document.createElement('ul');
  selectList.classList.add('select__list');

  const selectOptionsArray = Array.from(element.options);

  selectOptionsArray.forEach(item => {
    const selectItem = document.createElement('li');
    selectItem.classList.add('select__item');

    if (!item.hasAttribute('disabled')) {
      selectItem.textContent = item.innerText;
      selectList.appendChild(selectItem);
    }
  });

  selectOption.addEventListener('click', () => {
    select.classList.toggle('select--show');
  });

  const selectOptionItems = selectList.querySelectorAll('.select__item');

  selectOptionItems.forEach((item, index) => {
    item.addEventListener('click', event => {
      selectOption.textContent = event.target.innerText;

      selectOptionItems.forEach(element => {
        element.classList.remove('select__item--selected');
      });

      item.classList.add('select__item--selected');

      select.classList.remove('select--show');

      element.selectedIndex = index + 1;
    });
  });

  element.insertAdjacentElement('afterend', select);
  select.appendChild(selectOption);
  select.appendChild(selectList);
};

// End Custom Select

const initializeSelects = () => {
  const selectElements = document.querySelectorAll('.step__select');

  selectElements.forEach(item => {
    customSelect(item);
  });
};

let currentStep = 0;

const error = (element, error) => {
  const errorBlock = document.createElement('div');
  errorBlock.classList.add('error');

  errorBlock.textContent = error;
  element.classList.add('step--error');
  element.appendChild(errorBlock);
};

const validationData = [
  {
    step: 0,
    element: fields[0],
    errorMessage: 'Please select your profession',
  },
  {
    step: 1,
    element: fields[1],
    errorMessage: 'Please select your age',
  },
  {
    step: 2,
    element: fields[2],
    errorMessage: 'Enter your postal code to find local matches',
  },
  {
    step: 3,
    element: fields[3],
    errorMessage: 'Please enter a valid email address',
  },
  {
    step: 4,
    element: fields[4],
    errorMessage: 'Please enter a password to secure your account',
  },
];

const validateStep = () => {
  let isValid = false;
  const { element, errorMessage } = validationData[currentStep];
  const value = element.value;
  const stepItemElement = stepItems[currentStep];

  const errorBlock = getSelector('.error');
  if (errorBlock) {
    stepItemElement.classList.remove('step--error');
    errorBlock.remove();
  }

  switch (currentStep) {
    case 0:
    case 1:
    case 2:
      if (!validateFieldEmpty(value)) {
        error(stepItems[currentStep], errorMessage);
      } else {
        isValid = true;
      }
      break;
    case 3:
      if (!validateFieldEmpty(value) || !validateFieldEmail(value)) {
        error(stepItems[currentStep], errorMessage);
      } else {
        isValid = true;
      }
      break;
    case 4:
      if (!validateFieldEmpty(value) || !validateFieldPassword(value)) {
        error(stepItems[currentStep], errorMessage);
      } else {
        isValid = true;
      }
      break;
    default:
      break;
  }

  return isValid;
};

const handleNextButton = () => {
  const progressItems = document.querySelectorAll('.progress-item');

  if (validateStep()) {
    stepItems.forEach(item => {
      item.classList.remove('step--active');
    });

    if (currentStep < stepItems.length - 1) {
      stepItems[currentStep].classList.add('step--completed');
      progressItems[currentStep].classList.add('progress-item--completed');
      stepItems[currentStep].classList.remove('step--error');
      currentStep++;
      stepItems[currentStep].classList.add('step--active');
    } else if (currentStep === stepItems.length - 1) {
      stepItems[currentStep].classList.add('step--active');
      progressItems[currentStep].classList.add('progress-item--completed');
      stepBtnNext.querySelector('.step__btn-text').textContent = 'Start now';
      stepBtnNext.classList.add('step__btn--success');
    }

    // Sending a request to the server
    sendRequest()
      .then(() => {
        // Request sent successfully
        console.log('Request sent successfully');
      })
      .catch(() => {
        // Error sending request
        console.log('Error Sending Request');
      });
  }
};

const handlePrevButton = () => {
  const progressItems = document.querySelectorAll('.progress-item');

  if (currentStep > 0) {
    stepItems[currentStep].classList.remove('step--active');
    currentStep--;
    stepItems[currentStep].classList.add('step--active');
    progressItems[currentStep].classList.remove('progress-item--completed');

    stepBtnNext.querySelector('.step__btn-text').textContent = 'Next step';
    stepBtnNext.classList.remove('step__btn--success');
  }
};

const initializeStepButtons = () => {
  stepBtnNext.addEventListener('click', handleNextButton);
  stepBtnBack.addEventListener('click', handlePrevButton);
};

const sendRequest = () => {
  const profession = fields[0].value;
  const age = fields[1].value;
  const address = fields[2].value;
  const email = fields[3].value;
  const password = fields[4].value;

  const data = {
    profession,
    age,
    address,
    email,
    password,
  };

  return fetch('http://www.mocky.io/v2/5dfcef48310000ee0ed2c281', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Progress Indicators

const progressIndicators = () => {
  const progress = getSelector('.progress');

  for (let i = 0; i < stepItems.length; i++) {
    const progressItem = document.createElement('span');
    progressItem.classList.add('progress-item');
    progress.appendChild(progressItem);
  }

  stepItems[0].classList.add('step--active');
};

// Initialize RegForm

const initializeForm = () => {
  initializeSelects();
  progressIndicators();
  initializeStepButtons();
};

// Call the initialization function
initializeForm();
