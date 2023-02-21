// ** IMPORTS ** //
//---------------//
import { getErrorElement } from './utils.js';

// ** VALIDITY CHECKING ** //
//-------------------------//

// ** This one is called from scipt.js for initialization ** //
//-----------------------------------------------------------//
function enableFormValidation(forms, formSelectors) {
  Object.keys(forms).forEach((formName) => {
    forms[formName].form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    addFieldInputListeners(forms[formName], formSelectors);
  });
}

function checkInputValidity(form, field, formSelectors) {
  const errorElement = getErrorElement(form, field);

  if (field.validity.patternMismatch) {
    field.setCustomValidity(field.dataset.errorMessage);
  } else {
    field.setCustomValidity('');
  }

  if (!field.validity.valid) {
    showInputError(
      errorElement,
      formSelectors.activeInputErrorClass,
      field.validationMessage
    );
  } else {
    hideInputError(errorElement, formSelectors.activeInputErrorClass);
  }
}

function toggleButtonState(button, fields, formSelectors) {
  if (hasInvalidInput(fields)) {
    disableButton(button, formSelectors.inactiveSubmitClass);
  } else {
    enableButton(button, formSelectors.inactiveSubmitClass);
  }
}

//This function is only used when checking button state.
//Regular input checking is done in checkInputValidity method.
function hasInvalidInput(fields) {
  return fields.some((field) => {
    if (!field.validity.valid) {
      return true;
    }
  });
}

// ** EVENT LISTENING ** //
//-----------------------//
function addFieldInputListeners(formObj, formSelectors) {
  console.log('addFieldListeners:' + formSelectors);
  if (formObj.fields.length == 0) {
    return;
  }

  toggleButtonState(formObj.submit, formObj.fields, formSelectors);
  formObj.fields.forEach((field) => {
    field.addEventListener('input', () => {
      checkInputValidity(formObj.form, field, formSelectors);
      toggleButtonState(formObj.submit, formObj.fields, formSelectors);
    });
  });
}

// ** ELEMENT MANIPULATION ** //
//----------------------------//
function showInputError(errorMessageElement, errorMessageClass, message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.add(errorMessageClass);
}

function hideInputError(errorMessageElement, errorMessageClass) {
  errorMessageElement.textContent = '';
  errorMessageElement.classList.remove(errorMessageClass);
}

function enableButton(button, buttonInactiveClass) {
  button.disabled = false;
  button.classList.remove(buttonInactiveClass);
}

function disableButton(button, buttonInactiveClass) {
  button.disabled = true;
  button.classList.add(buttonInactiveClass);
}

// ** EXPORT ** //
//--------------//
export { enableFormValidation, checkInputValidity, toggleButtonState };
