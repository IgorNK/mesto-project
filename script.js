'use strict';

const profileEditButton = document.querySelector('.profile__edit-button');
const placeAddButton = document.querySelector('.profile__add-button');

const popup = document.querySelector('.popup');
const popupCloseButton = popup.querySelector('.popup__close-button');

const profileEditForm = document.querySelector('.form_profile-edit');
const profileNameField = document.querySelector('.form__field_name');
const profileDescriptionField = document.querySelector(
  '.form__field_description'
);

const addPlaceForm = document.querySelector('.form_add-place');
const placeTitleField = document.querySelector('.form__field_title');
const placeLinkField = document.querySelector('.form__field_link');

const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');

const profileEditFormTitle = 'Редактировать\xa0Профиль';
const addPlaceFormTitle = 'Добавить\xa0Место';

const placesContainer = document.querySelector('.cards');

const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
  },
];

initialize();

updateFormData();

addInitialCards();

function addInitialCards() {
  initialCards.forEach((card) => addPlace(createPlace(card.name, card.link)));
}

function initialize() {
  profileEditButton.addEventListener('click', showProfileEditForm);
  placeAddButton.addEventListener('click', showPlaceAddForm);

  popupCloseButton.addEventListener('click', hidePopup);

  profileEditForm.addEventListener('submit', (evt) => {
    handleUpdateProfileButton(evt);
    hidePopup();
  });

  addPlaceForm.addEventListener('submit', (evt) => {
    handleAddPlaceButton(evt);
    hidePopup();
  });
}

function showPopup(title) {
  popup.classList.add('popup_opened');
  const popupHeading = popup.querySelector('.popup__heading');
  popupHeading.textContent = title;
}

function hidePopup() {
  popup.classList.remove('popup_opened');
}

function showForm(form) {
  clearForms();
  form.classList.remove('form_hidden');
}

function hideForm(form) {
  form.classList.add('form_hidden');
}

function clearForms() {
  const forms = popup.querySelectorAll('.form');
  forms.forEach((form) => hideForm(form));
}

function showProfileEditForm() {
  showForm(profileEditForm);
  showPopup(profileEditFormTitle);
}

function showPlaceAddForm() {
  showForm(addPlaceForm);
  showPopup(addPlaceFormTitle);
}

function updateFormData() {
  profileNameField.value = profileName.textContent;
  profileDescriptionField.value = profileDescription.textContent;
}

function handleUpdateProfileButton(evt) {
  evt.preventDefault();

  const newName = profileNameField.value;
  const newDescription = profileDescriptionField.value;
  updateProfileData(newName, newDescription);
}

function updateProfileData(newName, newDescription) {
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
}

function handleAddPlaceButton(evt) {
  evt.preventDefault();

  const title = placeTitleField.value;
  const link = placeLinkField.value;
  addPlace(createPlace(title, link));
}

function createPlace(title, link) {
  const placeTemplate = document.querySelector('#card-template').content;
  const placeElement = placeTemplate.querySelector('.card').cloneNode(true);
  const placeTitleElement = placeElement.querySelector('.card__name');
  const placeImageElement = placeElement.querySelector('.card__image');
  const placeLikeButton = placeElement.querySelector('.card__like-button');

  placeTitleElement.textContent = title;
  placeImageElement.src = link;
  placeImageElement.alt = title;

  placeLikeButton.addEventListener('click', () =>
    placeLikeButton.classList.toggle('card__like-button_active')
  );

  return placeElement;
}

function addPlace(placeElement) {
  placesContainer.append(placeElement);
}
