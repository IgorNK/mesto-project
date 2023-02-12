'use strict';
// ** IMPORTS ** //
//---------------//
import '../../pages/index.css';
import { addInitialCards } from './cards.js';
import { forms, enableForms, showPopup, hidePopup } from './modal.js';
import { enableValidation, checkInputValidity } from './validate.js';

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
    fetchProfileEditFormInputs();
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

function fetchProfileEditFormInputs() {
  const profileEditForm = forms.profileEdit.form;
  const profileNameField = forms.profileEdit.fields.name;
  const profileDescriptionField = forms.profileEdit.fields.description;
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  profileNameField.value = profileName.textContent;
  profileDescriptionField.value = profileDescription.textContent;
  checkInputValidity(profileEditForm, profileNameField);
  checkInputValidity(profileEditForm, profileDescriptionField);
}

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
addEventListeners(); // In this scope

enableForms(); // Imported from ./modal.js

enableValidation(forms); // Imported from ./validate.js

addInitialCards(); // Imported from ./cards.js
