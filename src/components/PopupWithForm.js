import Popup from './Popup.js';
import { processingMessage } from '../utils/constants.js';

export default class PopupWithForm extends Popup {
  constructor(selector, { formElementSelectors }) {
    super(selector);
    this._formElementSelectors = formElementSelectors;
    this.form = this._popupElement.querySelector(
      formElementSelectors.formSelector
    );
    this._inputs = Array.from(
      this.form.querySelectorAll(formElementSelectors.inputSelector)
    );
    this._submit = this.form.querySelector(formElementSelectors.submitSelector);
    this._defaultSubmitMessage = this._submit.textContent;
  }

  assignCallback({ callback }) {
    this._callback = callback;
  }

  _setEventListeners() {
    super._setEventListeners();
    this._addSubmitButtonListener();
  }

  _addSubmitButtonListener() {
    this._popupElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._onProcessingStart();
      this._callback(this._getInputValues());
    });
  }

  close() {
    this._inputs.forEach((field) => {
      this.validator.checkInputValidity(field);
    });
    this._resetForm();
    super.close();
  }

  fillInputs(values) {
    Object.keys(values).forEach((key) => {
      const input = this.form.elements.namedItem(key);
      if (input) {
        this.form.elements.namedItem(key).value = values[key];
      }
    });
  }

  _getInputValues() {
    const inputValues = {};
    this._inputs.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  _resetForm() {
    this.form.reset();
    if (this._inputs == null) {
      return;
    }
    this.validator.clearValidation();
  }

  // ** SAVE PROCESS RENDERING ** //
  //------------------------------//
  _onProcessingStart() {
    this._submit.textContent = processingMessage;
    this._submit.disabled = true;
  }

  _onProcessingComplete() {
    this._submit.textContent = this._defaultSubmitMessage;
    this._resetForm();
    this._submit.disabled = false;
  }
}
