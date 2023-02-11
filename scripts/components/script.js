'use strict';
// ** IMPORTS ** //
import '../../pages/index.css';
import { initialCards } from './data.js';
import { createPlace, addPlace } from './cards.js';
import {
  enableForms,
  showPopup,
  hidePopup,
  popupAddPlace,
  popupAvatarEdit,
  popupProfileEdit,
} from './modal.js';
import { enableValidation } from './validate.js';

// ** GLOBALS ** //
//---------------//
// ****** Form show-up buttons ****** //
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
const profileEditButton = document.querySelector('.profile__edit-button');
const placeAddButton = document.querySelector('.profile__add-button');
// ****** Profile info on page ****** //

function addInitialCards() {
  initialCards.forEach((card) => addPlace(createPlace(card.name, card.link)));
}

function addEventListeners() {
  avatarEditButton.addEventListener('click', () => {
    showPopup(popupAvatarEdit);
  });

  profileEditButton.addEventListener('click', () => {
    fetchProfileEditFormInputs();
    showPopup(popupProfileEdit);
  });

  placeAddButton.addEventListener('click', () => {
    showPopup(popupAddPlace);
  });

  document.addEventListener('click', (evt) => {
    const target = evt.target;
    if (target.classList.contains('popup')) {
      hidePopup(target);
    }
  });
}

function fetchProfileEditFormInputs() {
  const profileEditForm = document.forms['profile-edit'];
  const profileNameField = profileEditForm.elements['name'];
  const profileDescriptionField = profileEditForm.elements['description'];
  const profileName = document.querySelector('.profile__name');
  const profileDescription = document.querySelector('.profile__description');
  profileNameField.value = profileName.textContent;
  profileDescriptionField.value = profileDescription.textContent;
}

addEventListeners();

enableForms();

enableValidation();

addInitialCards();
