// ** IMPORTS ** //
//---------------//
import {
  requestAddPlace,
  requestUpdateAvatar,
  requestUpdateProfileData,
  requestDeletePlace,
} from './api.js';
import { renderProfile } from './index.js';
import { renderCard, deletePlace } from './cards.js';
import { checkInputValidity, toggleButtonState } from './validate.js';

// ** GLOBALS ** //
//---------------//
const popupAddPlace = document.querySelector('.popup__for_add-place');
const popupProfileEdit = document.querySelector('.popup__for_profile-edit');
const popupAvatarEdit = document.querySelector('.popup__for_avatar-edit');
const popupDeletePlace = document.querySelector('.popup__for_delete-place');

const profileEditForm = document.forms['profile-edit'];
const addPlaceForm = document.forms['add-place'];
const deletePlaceForm = document.forms['delete-place'];
const avatarEditForm = document.forms['avatar-edit'];

const profileNameField = profileEditForm.elements['name'];
const profileDescriptionField = profileEditForm.elements['description'];
const avatarLinkField = avatarEditForm.elements['link'];
const placeTitleField = addPlaceForm.elements['title'];
const placeLinkField = addPlaceForm.elements['link'];

const profileEditSubmit = profileEditForm.querySelector('.form__button');
const addPlaceSubmit = addPlaceForm.querySelector('.form__button');
const deletePlaceSubmit = deletePlaceForm.querySelector('.form__button');
const avatarEditSubmit = avatarEditForm.querySelector('.form__button');

const forms = {
  profileEdit: {
    form: profileEditForm,
    popup: popupProfileEdit,
    fields: {
      name: profileNameField,
      description: profileDescriptionField,
    },
    callback: handleProfileEditFormSubmit,
    submit: profileEditSubmit,
  },
  addPlace: {
    form: addPlaceForm,
    popup: popupAddPlace,
    fields: {
      title: placeTitleField,
      link: placeLinkField,
    },
    callback: handleAddPlaceFormSubmit,
    submit: addPlaceSubmit,
  },
  deletePlace: {
    form: deletePlaceForm,
    popup: popupDeletePlace,
    place: null,
    callback: handleDeletePlaceFormSubmit,
    submit: deletePlaceSubmit,
  },
  avatarEdit: {
    form: avatarEditForm,
    popup: popupAvatarEdit,
    fields: {
      link: avatarLinkField,
    },
    callback: handleAvatarEditFormSubmit,
    submit: avatarEditSubmit,
  },
};

const processingMessage = 'Saving...';
const defaultSubmitMessage = 'Сохранить';
const confirmSubmitMessage = 'Да';

// ** EVENT LISTENING ** //
//-----------------------//
function addCloseButtonListeners() {
  const buttons = document.querySelectorAll('.popup__close-button');
  buttons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
      hidePopup(popup);
    });
  });
}

function addFormSubmitListeners(forms) {
  for (const formName in forms) {
    forms[formName].form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      // console.log('submit!', forms[formName].callback);
      forms[formName].callback(forms[formName]);
      // console.log('after callback');
      // hidePopup(forms[formName].popup);
      // resetForm(forms[formName]);
    });
  }
}

// ** EVENT HANDLERS ** //
//----------------------//
function handleAvatarEditFormSubmit(form) {
  const newAvatar = avatarLinkField.value;
  onProcessingStart(form);
  requestUpdateAvatar(newAvatar)
    .then((data) => {
      renderProfile(data);
      onProcessingComplete(form);
    })
    .catch((err) => {
      console.log(`EDIT AVATAR ERROR: ${err}`);
    });
}

function handleProfileEditFormSubmit(form) {
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  onProcessingStart(form);
  requestUpdateProfileData(newName, newDescription)
    .then((data) => {
      // console.log('updated profile data: ');
      renderProfile(data);
      onProcessingComplete(form, defaultSubmitMessage);
    })
    .catch((err) => {
      console.log(`EDIT PROFILE ERROR: ${err}`);
    });
}

function handleAddPlaceFormSubmit(form) {
  const title = placeTitleField.value;
  const link = placeLinkField.value;
  onProcessingStart(form);
  requestAddPlace({ title: title, link: link })
    .then((data) => {
      renderCard(data);
      onProcessingComplete(form, defaultSubmitMessage);
    })
    .catch((err) => console.log(`ADD PLACE ERROR: ${err}`));
}

function handleDeletePlaceFormSubmit(form) {
  onProcessingStart(form);
  const place = form.place;
  requestDeletePlace(place._id)
    .then((data) => {
      deletePlace(place);
      onProcessingComplete(form, confirmSubmitMessage);
    })
    .catch((err) => {
      console.log(`DELETE PLACE ERROR: ${err}`);
    });
}

// ** SAVE PROCESS RENDERING ** //
//------------------------------//
function onProcessingStart(form) {
  form.submit.textContent = processingMessage;
}

function onProcessingComplete(form, message) {
  form.submit.textContent = message;
  hidePopup(form.popup);
  resetForm(form);
}

// ** ELEMENT MANIPULATION ** //
//----------------------------//
let keyDownCallback;

function addEscapeListener(popup) {
  document.addEventListener(
    'keydown',
    (keyDownCallback = function (evt) {
      if (evt.key === 'Escape') {
        document.activeElement.blur();
        hidePopup(popup);
      }
    })
  );
}

function showPopup(popup) {
  popup.classList.add('popup_opened');
  addEscapeListener(popup);
}

function hidePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', keyDownCallback);
}

function resetForm(formObj) {
  formObj.form.reset();
  if (formObj.fields == null) {
    return;
  }
  const fields = Object.values(formObj.fields);
  toggleButtonState(formObj.submit, fields);
}

// ** This one is called from scipt.js for initialization ** //
//-----------------------------------------------------------//
function enableForms() {
  addFormSubmitListeners(forms);
  addCloseButtonListeners();
}

// ** EXPORT ** //
//--------------//
export { forms, enableForms, showPopup, hidePopup };
