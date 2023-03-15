import Popup from "./Popup";

export default class PopupWithForm extends Popup{
    constructor(selector, callback){
        super(selector)
        this.callback = callback;
    }
    _getInputValues(){
        this.callback
    }
    _setEventListeners(){
        this._addCloseButtonListener();

    }
    close(){
        this._popupElement.classList.remove('popup_opened');
        document.removeEventListener('keydown', this._handleEscClose);
        this._popupElement.reset()
    }
}