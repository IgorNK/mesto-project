import Popup from './Popup';

export default class PopupWithForm extends Popup {
  constructor(selector, callback) {
    super(selector);
    this.callback = callback;
  }

  _setEventListeners() {
    super._setEventListeners();
    this._addSubmitButtonListener();
  }

  _addSubmitButtonListener() {
    this._popupElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.callback();
    });
  }

  close() {
    this.form.fields.forEach((field) => {
      this.form.validator.checkInputValidity(field);
    });
    this.form.formElement.reset();
    super.close();
  }
}
