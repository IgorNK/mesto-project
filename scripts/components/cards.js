import { initialCards } from './data.js';
import { showPopup } from './modal.js';

// ****** Places card template ****** //
const placeTemplate = document.querySelector('#card-template').content;

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
  const placesContainer = document.querySelector('.cards');
  placesContainer.prepend(placeElement);
}

function deletePlace(placeElement) {
  placeElement.remove();
}

function showFullImage(link, title) {
  const popupImage = document.querySelector('.popup__for_image');
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupImageCaption = popupImage.querySelector('.popup__image-caption');
  popupImageElement.src = link;
  popupImageElement.alt = title;
  popupImageCaption.textContent = title;
  showPopup(popupImage);
}

function addInitialCards() {
  initialCards.forEach((card) => addPlace(createPlace(card.name, card.link)));
}

export { createPlace, addPlace, addInitialCards };
