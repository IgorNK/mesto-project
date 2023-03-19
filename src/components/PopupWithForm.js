import Popup from "./Popup";

export default class PopupWithForm extends Popup{
    constructor(selector, callback){
        super(selector);
        this.formElement = this._popupElement.querySelector('.form');
        this.callback = callback;
    }
    _getInputValues(){
        this.callback
    }
    _setEventListeners(){
        this._addCloseButtonListener();
        this._addSubmitButtonListener();
    }

    _addSubmitButtonListener() {
        this._popupElement.addEventListener('submit', (evt) => {
          evt.preventDefault();
        });
    }

    close(){
        this._popupElement.classList.remove('popup_opened');
        document.removeEventListener('keydown', this._handleEscClose);
        this.formElement.reset()
    }
}