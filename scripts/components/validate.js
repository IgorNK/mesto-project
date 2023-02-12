// ** IMPORTS ** //
//---------------//
import { forms } from './modal.js';
import { getErrorElement } from './utils.js';

// ** VALIDITY CHECKING ** //
//-------------------------//

function enableValidation() {
  for (const formName in forms) {
    const formObj = forms[formName];
    formObj.form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    addFieldInputListeners(formObj);
  }
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
function addFieldInputListeners(formObj) {
  const fields = Object.values(formObj.fields);
  const button = formObj.submit;
  const form = formObj.form;
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
export { enableValidation, checkInputValidity, toggleButtonState };
