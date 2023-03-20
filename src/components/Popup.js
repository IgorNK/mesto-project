export default class Popup {
  constructor(selector) {
    this._popupElement = document.querySelector(selector);
    this._popupElement.popupObj = this;
    this._setEventListeners();
  }

  open() {
    this._popupElement.classList.add('popup_opened');
    this._addEscapeListener(this);
  }

  close() {
    this._popupElement.classList.remove('popup_opened');
    document.removeEventListener('keydown', this._handleEscClose);
  }

  _setEventListeners() {
    this._addCloseButtonListener();
  }

  _handleEscClose(evt) { }

  _addEscapeListener(popup) {
    document.addEventListener(
      'keydown',
      (this._handleEscClose = function (evt) {
        if (evt.key === 'Escape') {
          document.activeElement.blur();
          popup.close();
        }
      })
    );
  }

  _addCloseButtonListener() {
    const closeButton = this._popupElement.querySelector(
      '.popup__close-button'
    );
    closeButton.addEventListener('click', () => {
      this.close();
    });
  }
}
