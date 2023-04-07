import Popup from './Popup.js';
import {
  processingMessage,
  defaultConfirmMessage,
} from '../utils/constants.js';

export default class PopupWithConfirmation extends Popup {
  constructor(selector, { formElementSelectors }) {
    super(selector);
    this._submit = this._popupElement.querySelector(
      formElementSelectors.submitSelector
    );
  }

  assignCallback({ callback }) {
    this._callback = callback;
  }

  setCard(card) {
    this._card = card;
  }

  _setEventListeners() {
    super._setEventListeners();
    this._addSubmitButtonListener();
  }

  _addSubmitButtonListener() {
    this._popupElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._onProcessingStart();
      this._callback(this._card);
    });
  }

  // ** SAVE PROCESS RENDERING ** //
  //------------------------------//
  _onProcessingStart() {
    this._submit.textContent = processingMessage;
    this._submit.disabled = true;
  }

  onProcessingComplete() {
    this._submit.textContent = defaultConfirmMessage;
    this._submit.disabled = false;
  }
}
