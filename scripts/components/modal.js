// ** IMPORTS ** //
//---------------//
import { createPlace, addPlace } from './cards.js';
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
      forms[formName].callback();
      hidePopup(forms[formName].popup);
      resetForm(forms[formName]);
    });
  }
}

// ** EVENT HANDLERS ** //
//----------------------//
function handleAvatarEditFormSubmit() {
  const newAvatar = avatarLinkField.value;
  updateAvatar(newAvatar);
}

function handleProfileEditFormSubmit() {
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  updateProfileData(newName, newDescription);
}

function handleAddPlaceFormSubmit() {
  const title = placeTitleField.value;
  const link = placeLinkField.value;
  addPlace(createPlace(title, link));
}

function updateAvatar(newAvatar) {
  const avatarEditButton = document.querySelector(
    '.profile__avatar-edit-button'
  );
  avatarEditButton.style.backgroundImage = 'url(' + newAvatar + ')';
}

function updateProfileData(newName, newDescription) {
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
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
function enableForms(forms) {
  addFormSubmitListeners(forms);
  addCloseButtonListeners();
}

// ** EXPORT ** //
//--------------//
export {
  forms,
  enableForms,
  showPopup,
  hidePopup,
  popupAddPlace,
  popupAvatarEdit,
  popupProfileEdit,
  profileEditForm,
};
