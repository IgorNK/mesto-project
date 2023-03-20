import { getErrorElement } from './utils.js';

export default class FormValidator {
  constructor(formSelectors, formObj) {
    this._selectors = formSelectors;
    this._formObj = formObj;
  }

  enableValidation() {
    this._formObj.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    this._addFieldInputListeners();
  }

  toggleButtonState(button, fields) {
    if (this._hasInvalidInput(fields)) {
      this._disableButton(button, this._selectors.inactiveSubmitClass);
    } else {
      this._enableButton(button, this._selectors.inactiveSubmitClass);
    }
  }

  checkInputValidity(field) {
    const errorElement = getErrorElement(this._formObj.formElement, field);

    if (field.validity.patternMismatch) {
      field.setCustomValidity(field.dataset.errorMessage);
    } else {
      field.setCustomValidity('');
    }

    if (!field.validity.valid) {
      this._showInputError(
        errorElement,
        this._selectors.activeInputErrorClass,
        field.validationMessage
      );
    } else {
      this._hideInputError(errorElement, this._selectors.activeInputErrorClass);
    }
  }

  //This method is only used when checking button state.
  //Regular input checking is done in checkInputValidity method.
  _hasInvalidInput(fields) {
    return fields.some((field) => {
      if (!field.validity.valid) {
        return true;
      }
    });
  }

  _addFieldInputListeners() {
    if (this._formObj.fields.length == 0) {
      return;
    }

    this.toggleButtonState(this._formObj.submit, this._formObj.fields);
    this._formObj.fields.forEach((field) => {
      field.addEventListener('input', () => {
        this.checkInputValidity(field);
        this.toggleButtonState(this._formObj.submit, this._formObj.fields);
      });
    });
  }

  // ** ELEMENT MANIPULATION ** //
  //----------------------------//
  _showInputError(errorMessageElement, errorMessageClass, message) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add(errorMessageClass);
  }

  _hideInputError(errorMessageElement, errorMessageClass) {
    errorMessageElement.textContent = '';
    errorMessageElement.classList.remove(errorMessageClass);
  }

  _enableButton(button, buttonInactiveClass) {
    button.disabled = false;
    button.classList.remove(buttonInactiveClass);
  }

  _disableButton(button, buttonInactiveClass) {
    button.disabled = true;
    button.classList.add(buttonInactiveClass);
  }
}
