// ** IMPORTS ** //
//---------------//
import { getErrorElement } from './utils.js';

// ** VALIDITY CHECKING ** //
//-------------------------//

function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.form'));
  formList.forEach((form) => {
    // Prevent default page reload on submit for each form
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    addFieldInputListeners(form);
  });
}

function checkInputValidity(form, field) {
  if (!field.validity.valid) {
    showInputError(form, field, field.validationMessage);
  } else {
    hideInputError(form, field);
  }
}

function toggleButtonState(button, fields) {
  if (hasInvalidInput(fields)) {
    disableButton(button);
  } else {
    enableButton(button);
  }
}

function hasInvalidInput(fields) {
  return fields.some((field) => {
    return !field.validity.valid;
  });
}

// ** EVENT LISTENING ** //
//-----------------------//
function addFieldInputListeners(form) {
  const fields = Array.from(form.querySelectorAll('.form__field'));
  const button = form.querySelector('.form__button');
  toggleButtonState(button, fields);
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      checkInputValidity(form, field);
      toggleButtonState(button, fields);
    });
  });
}

// ** ELEMENT MANIPULATION ** //
//----------------------------//
function showInputError(form, field, message) {
  const errorMessageElement = getErrorElement(form, field);
  field.classList.add('form__field_type_error');
  errorMessageElement.textContent = message;
  errorMessageElement.classList.add('form__field-error_active');
}

function hideInputError(form, field) {
  const errorMessageElement = getErrorElement(form, field);
  field.classList.remove('form__field_type_error');
  errorMessageElement.textContent = '';
  errorMessageElement.classList.remove('form__field-error_active');
}

function enableButton(button) {
  button.disabled = false;
  button.classList.remove('form__button_inactive');
}

function disableButton(button) {
  button.disabled = true;
  button.classList.add('form__button_inactive');
}

// ** EXPORT ** //
//--------------//
export { enableValidation };
