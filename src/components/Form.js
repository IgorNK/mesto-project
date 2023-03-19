import FormValidator from './FormValidator.js';
import PopupWithForm from './PopupWithForm.js';
import PopupWithImage from './PopupWithImage.js';
import Card from './Card.js';
import { api } from './Api.js';
import { updateUser, renderProfile } from './index.js';

const formSubmitCallbacks = {
  'avatar-edit': handleAvatarEditFormSubmit,
  'profile-edit': handleProfileEditFormSubmit,
  'add-place': handleAddPlaceFormSubmit,
  'delete-place': handleDeletePlaceFormSubmit,
};

const processingMessage = 'Saving...';
const defaultSubmitMessage = 'Сохранить';
const confirmSubmitMessage = 'Да';

export default class Form {
  constructor({ formElement, formName }, selectors) {
    this._selectors = selectors;
    this.formName = formName;
    this.formElement = formElement;

    this.fields = Array.from(
      formElement.querySelectorAll(selectors.inputSelector)
    );

    this.submit = formElement.querySelector(selectors.submitSelector);

    if (this.submit){
      this.popup = new PopupWithForm(
        `${selectors.popupSelector}__for_${formElement.name}`, 
        () => formSubmitCallbacks[formElement.name].call(this)
      );
    }else{
      this.popup = new PopupWithImage(
        `${selectors.popupSelector}__for_${formElement.name}`
      );
    }
  }

  enableValidation() {
    this.validator = new FormValidator(this._selectors, this);
    this.validator.enableValidation();
  }

  _reset() {
    this.formElement.reset();
    if (this.fields == null) {
      return;
    }
    const fields = Object.values(this.fields);
    this.validator.toggleButtonState(this.submit, fields);
  }

  // ** SAVE PROCESS RENDERING ** //
  //------------------------------//
  _onProcessingStart() {
    this.submit.textContent = processingMessage;
    this.submit.disabled = true;
  }

  _onProcessingComplete(message) {
    this.submit.textContent = message;
    this._reset();
    this.submit.disabled = false;
  }
}

// ** EVENT HANDLERS ** //
//----------------------//
function handleAvatarEditFormSubmit() {
  const linkField = this.fields[0];
  const newAvatar = linkField.value;
  this._onProcessingStart();
  api
    .requestUpdateAvatar(newAvatar)
    .then((data) => {
      updateUser(data);
      renderProfile(data);
      this.popup.close();
    })
    .catch((err) => {
      console.log(`EDIT AVATAR ERROR: ${err} \n ${err.stack}`);
    })
    .finally(() => {
      this._onProcessingComplete(defaultSubmitMessage);
    });
}

function handleProfileEditFormSubmit() {
  const nameField = this.fields[0];
  const descriptField = this.fields[1];
  const newName = nameField.value;
  const newDescription = descriptField.value;
  this._onProcessingStart();
  api
    .requestUpdateProfileData(newName, newDescription)
    .then((data) => {
      updateUser(data);
      renderProfile(data);
      this.popup.close();
    })
    .catch((err) => {
      console.log(`EDIT PROFILE ERROR: ${err} \n ${err.stack}`);
    })
    .finally(() => {
      this._onProcessingComplete(defaultSubmitMessage);
    });
}

function handleAddPlaceFormSubmit() {
  const titleField = this.fields[0];
  const linkField = this.fields[1];
  const title = titleField.value;
  const link = linkField.value;
  this._onProcessingStart();
  api
    .requestAddPlace({ title: title, link: link })
    .then((data) => {
      const newCard = new Card(data, '#card-template');
      newCard.renderCardFront();
      this.popup.close();
    })
    .catch((err) => console.log(`ADD PLACE ERROR: ${err} \n ${err.stack}`))
    .finally(() => {
      this._onProcessingComplete(defaultSubmitMessage);
    });
}

function handleDeletePlaceFormSubmit() {
  this._onProcessingStart();
  const placeData = this.card._data;
  api
    .requestDeletePlace(placeData._id)
    .then((data) => {
      this.card.deleteCard();
      this.popup.close();
    })
    .catch((err) => {
      console.log(`DELETE PLACE ERROR: ${err} \n ${err.stack}`);
    })
    .finally(() => {
      this._onProcessingComplete(confirmSubmitMessage);
    });
}
