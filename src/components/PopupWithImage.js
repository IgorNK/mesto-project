import Popup from './Popup.js';

export default class PopupWithImage extends Popup {
  constructor(selector) {
    super(selector);
    this.imageElement = this._popupElement.querySelector('.popup__image');
    this.imageCaption = this._popupElement.querySelector(
      '.popup__image-caption'
    );
  }
  open(data) {
    this.imageElement.src = data.link;
    this.imageElement.alt = data.name;
    this.imageCaption.textContent = data.name;

    super.open();
  }
}
