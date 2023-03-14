'use strict';
// ** IMPORTS ** //
//---------------//
import '../pages/index.css';
import { api } from './Api.js';
import Card from './Card.js';
import Form from './Form.js';

let user;
let cards = [];
let forms;

const formNames = {
  'profile-edit': 'profileEdit',
  'avatar-edit': 'avatarEdit',
  'add-place': 'addPlace',
  'delete-place': 'deletePlace',
};

const formSelectors = {
  popupSelector: '.popup',
  formSelector: '.form',
  inputSelector: '.form__field',
  submitSelector: '.form__button',
  inactiveSubmitClass: 'form__button_inactive',
  inputErrorSelector: '.form__field-error',
  activeInputErrorClass: 'form__field-error_active',
};

// ** STUFF TO DO ON PAGE LOAD ** //
//--------------------------------//

function addEventListeners() {
  const avatarEditButton = document.querySelector(
    '.profile__avatar-edit-button'
  );
  avatarEditButton.addEventListener('click', () => {
    forms.avatarEdit.popup.open();
  });

  const profileEditButton = document.querySelector('.profile__edit-button');
  profileEditButton.addEventListener('click', () => {
    populateProfileEditInputs(user);
    forms.profileEdit.popup.open();
  });

  const placeAddButton = document.querySelector('.profile__add-button');
  placeAddButton.addEventListener('click', () => {
    forms.addPlace.popup.open();
  });

  document.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.classList.contains('popup')) {
      target.popupObj.close();
    }
  });
}

const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');
const profilePic = document.querySelector('.profile__avatar-edit-button');
function renderProfile(profile) {
  profileName.textContent = profile.name;
  profileDescription.textContent = profile.about;
  profilePic.style.backgroundImage = `url(${profile.avatar})`;
}

function populateProfileEditInputs(profile) {
  const profileFormObj = forms.profileEdit;
  const profileNameField = profileFormObj.fields[0];
  const profileDescriptionField = profileFormObj.fields[1];
  profileNameField.value = profile.name;
  profileDescriptionField.value = profile.about;

  profileFormObj.validator.checkInputValidity(profileNameField);
  profileFormObj.validator.checkInputValidity(profileDescriptionField);
}

function renderPage() {
  Promise.all([api.getUserProfile(), api.getInitialCards()])
    .then(([profileData, cardsData]) => {
      updateUser(profileData);
      updateCards(cardsData);
      renderProfile(user);
    })
    .catch((err) => {
      console.log(`ERROR GETTING DATA FROM SERVER: ${err}`);
    });
}

function initForms(selectors) {
  const forms = Array.from(document.forms);
  let formObjects = {};
  forms.forEach((formElement) => {
    const formName = formNames[formElement.name];
    const formObj = new Form({ formElement, formName }, selectors);
    formObj.enableValidation();
    formObjects[formName] = formObj;
  });
  return formObjects;
}

function updateUser(profile) {
  user = profile;
}

function updateCards(newCards) {
  newCards.forEach((item) => {
    const card = new Card(item, '#card-template');
    card.renderCard();
  });
}

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
addEventListeners(); // In this scope

forms = initForms(formSelectors); // In this scope

renderPage(); // In this scope

export {
  user,
  cards,
  forms,
  formSelectors,
  updateUser,
  updateCards,
  renderProfile,
};
