'use strict';
// ** IMPORTS ** //
//---------------//
import '../../pages/index.css';
import { fetchProfile, fetchCards } from './api.js';
import { renderCards } from './cards.js';
import { forms, enableForms, showPopup, hidePopup } from './modal.js';
import { enableValidation, checkInputValidity } from './validate.js';

let user;

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
    fetchProfile();
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

function renderProfile(profile) {
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  const profilePic = document.querySelector('.profile__avatar-edit-button');
  profileName.textContent = profile.name;
  profileDescription.textContent = profile.about;
  profilePic.style.backgroundImage = `url(${profile.avatar})`;

  const profileEditForm = forms.profileEdit.form;
  const profileNameField = forms.profileEdit.fields.name;
  const profileDescriptionField = forms.profileEdit.fields.description;
  profileNameField.value = profile.name;
  profileDescriptionField.value = profile.about;
  checkInputValidity(profileEditForm, profileNameField);
  checkInputValidity(profileEditForm, profileDescriptionField);
}

function getProfile() {
  fetchProfile()
    .then((data) => {
      // console.log(data);
      renderProfile(data);
      user = data;
    })
    .then(() => getCards())
    .catch((err) => console.log(`PROFILE REQUEST ERROR: ${err}`));
}

function getCards() {
  fetchCards()
    .then((data) => {
      // console.log(data);
      renderCards(data);
    })
    .catch((err) => {
      console.log(`CARDS REQUEST ERROR: ${err}`);
      return null;
    });
}

// function fetchProfileEditFormInputs() {
//   const profileEditForm = forms.profileEdit.form;
//   const profileNameField = forms.profileEdit.fields.name;
//   const profileDescriptionField = forms.profileEdit.fields.description;
//   const profileName = document.querySelector('.profile__name');
//   const profileDescription = document.querySelector('.profile__description');
//   profileNameField.value = profileName.textContent;
//   profileDescriptionField.value = profileDescription.textContent;
//   checkInputValidity(profileEditForm, profileNameField);
//   checkInputValidity(profileEditForm, profileDescriptionField);
// }

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
addEventListeners(); // In this scope

enableForms(); // Imported from ./modal.js

enableValidation(forms); // Imported from ./validate.js

getProfile();

export { user, getCards, renderProfile };
