'use strict';
// ****** Imports ******* //
import { initialCards } from './data.js';
// ****** Form show-up buttons ****** //
const profileEditButton = document.querySelector('.profile__edit-button');
const placeAddButton = document.querySelector('.profile__add-button');
// ****** Popups ****** //
const popupProfileEdit = document.querySelector('.popup__for_profile-edit');
const popupAddPlace = document.querySelector('.popup__for_add-place');
const popupImage = document.querySelector('.popup__for_image');
const popupCloseButtons = document.querySelectorAll('.popup__close-button');
// ****** Forms ****** //
// ** Profile Edit form ** //
const profileEditForm = popupProfileEdit.querySelector(
  '.form_type_profile-edit'
);
const profileNameField = popupProfileEdit.querySelector('.form__field_name');
const profileDescriptionField = popupProfileEdit.querySelector(
  '.form__field_description'
);
// ** Add Place form ** //
const addPlaceForm = popupAddPlace.querySelector('.form_type_add-place');
const placeTitleField = popupAddPlace.querySelector('.form__field_title');
const placeLinkField = popupAddPlace.querySelector('.form__field_link');
// ** Image form ** //
const popupImageElement = popupImage.querySelector('.form_type_image');
// ****** Profile info on page ****** //
const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');
// ****** Places container on page ****** //
const placesContainer = document.querySelector('.cards');
// ****** Places card template ****** //
const placeTemplate = document.querySelector('#card-template').content;

assignInput();

initFormData();

addInitialCards();

function addInitialCards() {
  initialCards.forEach((card) => addPlace(createPlace(card.name, card.link)));
}

function assignInput() {
  profileEditButton.addEventListener('click', () => {
    showPopup(popupProfileEdit);
  });

  placeAddButton.addEventListener('click', () => {
    showPopup(popupAddPlace);
  });

  popupCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      hidePopup(popup);
    });
  });

  profileEditForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleUpdateProfileButton();
    hidePopup(popupProfileEdit);
  });

  addPlaceForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleAddPlaceButton();
    hidePopup(popupAddPlace);
  });
}

function showPopup(popup) {
  popup.classList.add('popup_opened');
}

function hidePopup(popup) {
  popup.classList.remove('popup_opened');
}

function initFormData() {
  profileNameField.value = profileName.textContent;
  profileDescriptionField.value = profileDescription.textContent;
}

function handleUpdateProfileButton() {
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  updateProfileData(newName, newDescription);
}

function updateProfileData(newName, newDescription) {
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
}

function handleAddPlaceButton() {
  const title = placeTitleField.value;
  const link = placeLinkField.value;
  addPlace(createPlace(title, link));
}

function createPlace(title, link) {
  const placeElement = placeTemplate.querySelector('.card').cloneNode(true);
  const placeTitleElement = placeElement.querySelector('.card__name');
  const placeImageElement = placeElement.querySelector('.card__image');
  const placeLikeButton = placeElement.querySelector('.card__like-button');
  const placeDeleteButton = placeElement.querySelector('.card__delete-button');

  placeTitleElement.textContent = title;
  placeImageElement.src = link;
  placeImageElement.alt = title;

  placeLikeButton.addEventListener('click', () =>
    placeLikeButton.classList.toggle('card__like-button_active')
  );

  placeDeleteButton.addEventListener('click', () => {
    deletePlace(placeElement);
  });

  placeImageElement.addEventListener('click', () => {
    showFullImage(link);
  });

  return placeElement;
}

function addPlace(placeElement) {
  placesContainer.append(placeElement);
}

function deletePlace(placeElement) {
  if (placesContainer.contains(placeElement)) {
    placesContainer.removeChild(placeElement);
  } else {
    console.log('EXCEPTION: trying to delete non-existing card');
  }
}

function showFullImage(link) {
  popupImageElement.src = link;
  showPopup(popupImage);
}
