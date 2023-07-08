const url = 'http://www.mocky.io/v2/5dfcef48310000ee0ed2c281'; // API

const getSelector = selector => document.querySelector(selector);

let isLoginFormShow = false; // state

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

// Regform

const fields = document.querySelectorAll('[data-step-field]');
const stepItemElements = document.querySelectorAll('.step');
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

const initializeCustomSelects = () => {
  const selectElements = document.querySelectorAll('.step__select');

  selectElements.forEach(item => {
    customSelect(item);
  });
};

const validationData = [
  {
    step: 0,
    element: fields[0],
    errorMessage: 'Please select a profession',
  },
  {
    step: 1,
    element: fields[1],
    errorMessage: 'Please select an age',
  },
  {
    step: 2,
    element: fields[2],
    errorMessage: 'Please enter your address',
  },
  {
    step: 3,
    element: fields[3],
    errorMessage: 'Please enter your email',
  },
  {
    step: 4,
    element: fields[4],
    errorMessage: 'Please enter your password',
  },
];

let currentStep = 0;

const error = (element, error) => {
  const errorBlock = document.createElement('div');
  errorBlock.classList.add('error');

  errorBlock.textContent = error;
  element.classList.add('step--error');
  element.appendChild(errorBlock);
};

const validateStep = () => {
  const { element, errorMessage } = validationData[currentStep];
  const value = element.value;

  switch (currentStep) {
    case 0:
    case 1:
    case 2:
      if (!validateFieldEmpty(value)) {
        error(stepItemElements[currentStep], errorMessage);
        return false;
      }
      break;
    case 3:
      if (!validateFieldEmpty(value) || !validateFieldEmail(value)) {
        error(stepItemElements[currentStep], errorMessage);
        return false;
      }
      break;
    case 4:
      if (!validateFieldEmpty(value) || !validateFieldPassword(value)) {
        error(stepItemElements[currentStep], errorMessage);
        return false;
      }
      break;
    default:
      break;
  }

  return true;
};

const initializeProgressIndicator = () => {
  const progress = getSelector('.step__progress');

  for (let i = 0; i < stepItemElements.length; i++) {
    const progressItem = document.createElement('span');
    progressItem.classList.add('step__progress-item');
    progress.appendChild(progressItem);
  }

  stepItemElements[0].classList.add('step--active');
};

const handleNextButtonClick = () => {
  const progressItems = document.querySelectorAll('.step__progress-item');

  if (validateStep()) {
    stepItemElements.forEach(item => {
      item.classList.remove('step--active');
    });

    if (currentStep < stepItemElements.length - 1) {
      stepItemElements[currentStep].classList.add('step--completed');
      progressItems[currentStep].classList.add(
        'step__progress-item--completed'
      );
      stepItemElements[currentStep].classList.remove('step--error');
      currentStep++;
      stepItemElements[currentStep].classList.add('step--active');
    } else if (currentStep === stepItemElements.length - 1) {
      stepItemElements[currentStep].classList.add('step--active');
      progressItems[currentStep].classList.add(
        'step__progress-item--completed'
      );
      // Sending a request to the server
      sendRequest()
        .then(() => {
          // Request sent successfully

          stepBtnNext.querySelector('.step__btn-text').textContent =
            'Start now';
          stepBtnNext.classList.add('step__btn--success');
        })
        .catch(() => {
          // Error sending request
          console.log('Error Sending Request');
        });
    }
  }
};

const handleBackButtonClick = () => {
  const progressItems = document.querySelectorAll('.step__progress-item');

  if (currentStep > 0) {
    stepItemElements[currentStep].classList.remove('step--active');
    currentStep--;
    stepItemElements[currentStep].classList.add('step--active');
    progressItems[currentStep].classList.remove(
      'step__progress-item--completed'
    );

    stepBtnNext.querySelector('.step__btn-text').textContent = 'Next step';
    stepBtnNext.classList.remove('step__btn--success');
  }
};

const initializeEventListeners = () => {
  stepBtnNext.addEventListener('click', handleNextButtonClick);
  stepBtnBack.addEventListener('click', handleBackButtonClick);
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

const initializeForm = () => {
  initializeCustomSelects();
  initializeProgressIndicator();
  initializeEventListeners();
};

// Call the initialization function
initializeForm();
