import { getErrorElement } from '../utils/utils.js';

export default class FormValidator {
  constructor(formElementSelectors, formElement) {
    this._selectors = formElementSelectors;
    this._form = formElement;
    this._inputs = Array.from(
      this._form.querySelectorAll(formElementSelectors.inputSelector)
    );
    this._submit = this._form.querySelector(
      formElementSelectors.submitSelector
    );
    this._error = this._form.querySelector(
      formElementSelectors.inputErrorSelector
    );
  }

  enableValidation() {
    this._form.addEventListener('submit', (e) => {
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
    const errorElement = getErrorElement(this._form, field);

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
    if (this._inputs.length == 0) {
      return;
    }

    this.toggleButtonState(this._submit, this._inputs);
    this._inputs.forEach((field) => {
      field.addEventListener('input', () => {
        this.checkInputValidity(field);
        this.toggleButtonState(this._submit, this._inputs);
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
