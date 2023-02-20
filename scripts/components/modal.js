// ** IMPORTS ** //
//---------------//
import {
  requestAddPlace,
  requestUpdateAvatar,
  requestUpdateProfileData,
} from './api.js';
import { renderProfile } from './index.js';
import { renderCard } from './cards.js';
import { checkInputValidity, toggleButtonState } from './validate.js';

// ** GLOBALS ** //
//---------------//
const popupAddPlace = document.querySelector('.popup__for_add-place');
const popupProfileEdit = document.querySelector('.popup__for_profile-edit');
const popupAvatarEdit = document.querySelector('.popup__for_avatar-edit');

const profileEditForm = document.forms['profile-edit'];
const addPlaceForm = document.forms['add-place'];
const avatarEditForm = document.forms['avatar-edit'];

const profileNameField = profileEditForm.elements['name'];
const profileDescriptionField = profileEditForm.elements['description'];
const avatarLinkField = avatarEditForm.elements['link'];
const placeTitleField = addPlaceForm.elements['title'];
const placeLinkField = addPlaceForm.elements['link'];

const profileEditSubmit = profileEditForm.querySelector('.form__button');
const addPlaceSubmit = addPlaceForm.querySelector('.form__button');
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
      console.log(`ERROR: ${err}`);
    });
}

function handleProfileEditFormSubmit(form) {
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  form.submit.textContent = processingMessage;
  requestUpdateProfileData(newName, newDescription)
    .then((data) => {
      // console.log('updated profile data: ');
      renderProfile(data);
      onProcessingComplete(form);
    })
    .catch((err) => {
      console.log(`ERROR: ${err}`);
    });
}

function handleAddPlaceFormSubmit(form) {
  const title = placeTitleField.value;
  const link = placeLinkField.value;
  form.submit.textContent = processingMessage;
  requestAddPlace({ title: title, link: link })
    .then((data) => {
      renderCard(data);
      onProcessingComplete(form);
    })
    .catch((err) => console.log(`ERROR: ${err}`));
}

// ** SAVE PROCESS RENDERING ** //
//------------------------------//
function onProcessingStart(form) {
  form.submit.textContent = processingMessage;
}

function onProcessingComplete(form) {
  form.submit.textContent = defaultSubmitMessage;
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
