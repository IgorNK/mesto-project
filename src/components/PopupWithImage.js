import Popup from "./Popup";

export default class PopupWithForm extends Popup{
    constructor(selector){
        super(selector)
        this.imageElement = this._popupElement.querySelector('.popup__image');
        this.imageCaption = this._popupElement.querySelector('.popup__image-caption');
    }
    open(data){
        this.imageElement.src = data._cardImageUrl;
        this.imageElement.alt = data._cardTitle;
        this.imageCaption.textContent = data._cardTitle;

        this._popupElement.classList.add('popup_opened');
        this._addEscapeListener(this);
    }
}