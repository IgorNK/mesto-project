// ** IMPORTS ** //
//---------------//
import { createPlace, addPlace } from './cards.js';

// ** GLOBALS ** //
//---------------//
const popupAddPlace = document.querySelector('.popup__for_add-place');
const popupProfileEdit = document.querySelector('.popup__for_profile-edit');
const popupAvatarEdit = document.querySelector('.popup__for_avatar-edit');

const profileEditForm = document.forms['profile-edit'];
const addPlaceForm = document.forms['add-place'];
const avatarEditForm = document.forms['avatar-edit'];

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

function addFormSubmitListeners() {
  avatarEditForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleAvatarEditFormSubmit();
    hidePopup(popupAvatarEdit);
    avatarEditForm.reset();
  });

  profileEditForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleProfileEditFormSubmit();
    hidePopup(popupProfileEdit);
    profileEditForm.reset();
  });

  addPlaceForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleAddPlaceFormSubmit();
    hidePopup(popupAddPlace);
    addPlaceForm.reset();
  });
}

// ** EVENT HANDLERS ** //
//----------------------//
function handleAvatarEditFormSubmit() {
  const avatarLinkField = avatarEditForm.elements['link'];
  const newAvatar = avatarLinkField.value;
  updateAvatar(newAvatar);
}

function handleProfileEditFormSubmit() {
  const profileNameField = profileEditForm.elements['name'];
  const profileDescriptionField = profileEditForm.elements['description'];
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  updateProfileData(newName, newDescription);
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

function handleAddPlaceFormSubmit() {
  const placeTitleField = addPlaceForm.elements['title'];
  const placeLinkField = addPlaceForm.elements['link'];
  const title = placeTitleField.value;
  const link = placeLinkField.value;
  addPlace(createPlace(title, link));
}

// ** ELEMENT MANIPULATION ** //
//----------------------------//
let keyDownCallback;

function addEscapeListener(popup) {
  document.addEventListener(
    'keydown',
    (keyDownCallback = function (evt) {
      if (evt.key === 'Escape') {
        console.log('Escape!');
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

function enableForms() {
  addFormSubmitListeners();
  addCloseButtonListeners();
}

// ** EXPORT ** //
//--------------//
export {
  enableForms,
  showPopup,
  hidePopup,
  popupAddPlace,
  popupAvatarEdit,
  popupProfileEdit,
};
