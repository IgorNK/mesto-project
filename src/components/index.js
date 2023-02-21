'use strict';
// ** IMPORTS ** //
//---------------//
import '../pages/index.css';
import { fetchProfile, fetchCards } from './api.js';
import { renderCards } from './cards.js';
import {
  enableForms,
  addCloseButtonListeners,
  showPopup,
  hidePopup,
  formSubmitCallabcks,
} from './modal.js';
import { enableFormValidation, checkInputValidity } from './validate.js';

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
    showPopup(forms.avatarEdit.popup);
  });

  const profileEditButton = document.querySelector('.profile__edit-button');
  profileEditButton.addEventListener('click', () => {
    populateProfileEditInputs(user);
    showPopup(forms.profileEdit.popup);
  });

  const placeAddButton = document.querySelector('.profile__add-button');
  placeAddButton.addEventListener('click', () => {
    showPopup(forms.addPlace.popup);
  });

  document.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.classList.contains('popup')) {
      hidePopup(target);
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
  const profileEditForm = profileFormObj.form;
  const profileNameField = profileFormObj.fields[0];
  const profileDescriptionField = profileFormObj.fields[1];
  profileNameField.value = profile.name;
  profileDescriptionField.value = profile.about;
  checkInputValidity(profileEditForm, profileNameField, formSelectors);
  checkInputValidity(profileEditForm, profileDescriptionField, formSelectors);
}

function renderPage() {
  Promise.all([fetchProfile(), fetchCards()])
    .then((data) => {
      const profileData = data[0];
      const cardsData = data[1];
      updateUser(profileData);
      updateCards(cardsData);
    })
    .catch((err) => {
      console.log(`ERROR GETTING DATA FROM SERVER: ${err}`);
    })
    .finally(() => {
      renderProfile(user);
      renderCards(cards);
    });
}

function grabForms(selectors) {
  const forms = Array.from(document.forms);
  let formObjects = {};
  forms.forEach((form) => {
    const name = formNames[form.name];
    const formObj = {
      form: form,
      popup: form.closest(selectors.popupSelector),
      fields: Array.from(form.querySelectorAll(selectors.inputSelector)),
      submit: form.querySelector(selectors.submitSelector),
      callback: formSubmitCallabcks[form.name],
    };
    formObjects[name] = formObj;
  });
  return formObjects;
}

function updateUser(profile) {
  user = profile;
}

function updateCards(newCards) {
  cards = newCards;
}

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
addEventListeners(); // In this scope

forms = grabForms(formSelectors); // In this scope

enableForms(forms); // Imported from ./modal.js
addCloseButtonListeners(); // Imported from ./modal.js

enableFormValidation(forms, formSelectors); // Imported from ./validate.js
// enableValidation(forms); // Imported from ./validate.js

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
