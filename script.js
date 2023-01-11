'use strict';
// ****** Imports ******* //
import { initialCards } from './data.js';
// ****** Form show-up buttons ****** //
const profileEditButton = document.querySelector('.profile__edit-button');
const placeAddButton = document.querySelector('.profile__add-button');
// ****** Modal window elements ****** //
const popup = document.querySelector('.popup');
const popupCloseButton = popup.querySelector('.popup__close-button');
// ****** Forms ****** //
// ** Profile Edit form ** //
const profileEditForm = document.querySelector('.form_type_profile-edit');
const profileNameField = document.querySelector('.form__field_name');
const profileDescriptionField = document.querySelector(
  '.form__field_description'
);
// ** Add Place form ** //
const addPlaceForm = document.querySelector('.form_type_add-place');
const placeTitleField = document.querySelector('.form__field_title');
const placeLinkField = document.querySelector('.form__field_link');
// ** Image pseudo-form ** //
const popupImage = popup.querySelector('.form_type_image');
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
    showForm(profileEditForm);
    showPopup();
  });

  placeAddButton.addEventListener('click', () => {
    showForm(addPlaceForm);
    showPopup();
  });

  popupCloseButton.addEventListener('click', hidePopup);

  profileEditForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleUpdateProfileButton();
    hidePopup();
  });

  addPlaceForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleAddPlaceButton();
    hidePopup();
  });
}

function showPopup() {
  console.log('showing popup');
  popup.classList.add('popup_opened');
}

function hidePopup() {
  console.log('hiding popup');
  popup.classList.remove('popup_opened');
}

function showForm(form) {
  console.log('showing form');
  clearForms();
  form.classList.remove('form_hidden');
}

function hideForm(form) {
  console.log('hiding form');
  form.classList.add('form_hidden');
}

function clearForms() {
  const forms = popup.querySelectorAll('.form');
  forms.forEach((form) => hideForm(form));
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
  popupImage.src = link;
  showForm(popupImage);
  showPopup();
}
