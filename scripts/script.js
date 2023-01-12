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
const popupImageElement = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__image-caption');
// ****** Forms ****** //
// ** Profile Edit form ** //
const profileEditForm = document.forms['profile-edit'];
const profileNameField = popupProfileEdit.querySelector('.form__field_name');
const profileDescriptionField = popupProfileEdit.querySelector(
  '.form__field_description'
);
// ** Add Place form ** //
const addPlaceForm = document.forms['add-place'];
const placeTitleField = popupAddPlace.querySelector('.form__field_title');
const placeLinkField = popupAddPlace.querySelector('.form__field_link');
// ****** Profile info on page ****** //
const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');
// ****** Places container on page ****** //
const placesContainer = document.querySelector('.cards');
// ****** Places card template ****** //
const placeTemplate = document.querySelector('#card-template').content;

function addInitialCards() {
  initialCards.forEach((card) => addPlace(createPlace(card.name, card.link)));
}

function addEventListeners() {
  profileEditButton.addEventListener('click', () => {
    fetchProfileEditFormInputs();
    showPopup(popupProfileEdit);
  });

  placeAddButton.addEventListener('click', () => {
    showPopup(popupAddPlace);
  });

  popupCloseButtons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
      hidePopup(popup);
    });
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

function showPopup(popup) {
  popup.classList.add('popup_opened');
}

function hidePopup(popup) {
  popup.classList.remove('popup_opened');
}

function fetchProfileEditFormInputs() {
  profileNameField.value = profileName.textContent;
  profileDescriptionField.value = profileDescription.textContent;
}

function handleProfileEditFormSubmit() {
  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  updateProfileData(newName, newDescription);
}

function updateProfileData(newName, newDescription) {
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
}

function handleAddPlaceFormSubmit() {
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
    showFullImage(link, title);
  });

  return placeElement;
}

function addPlace(placeElement) {
  placesContainer.prepend(placeElement);
}

function deletePlace(placeElement) {
  placeElement.remove();
}

function showFullImage(link, title) {
  popupImageElement.src = link;
  popupImageElement.alt = title;
  popupImageCaption.textContent = title;
  showPopup(popupImage);
}

addEventListeners();

addInitialCards();
