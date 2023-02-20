import { user } from './index.js';
import { requestLike, requestUnlike, requestDeletePlace } from './api.js';
import { showPopup } from './modal.js';
import { getLikedPlace } from './utils.js';

let places = [];

// ****** Places card template ****** //
const placeTemplate = document.querySelector('#card-template').content;
const placesContainer = document.querySelector('.cards');

function createPlace(place) {
  const placeElement = placeTemplate.querySelector('.card').cloneNode(true);
  const placeTitleElement = placeElement.querySelector('.card__name');
  const placeImageElement = placeElement.querySelector('.card__image');
  const placeLikeButton = placeElement.querySelector('.card__like-button');
  const placeLikeCount = placeElement.querySelector('.card__like-button-count');
  const placeDeleteButton = placeElement.querySelector('.card__delete-button');

  place.placeElement = placeElement;
  place.likeButton = placeLikeButton;
  place.likeCount = placeLikeCount;

  placeTitleElement.textContent = place.name;
  placeImageElement.src = place.link;
  placeImageElement.alt = place.name;
  placeLikeCount.textContent = place.likes.length;

  // Like button

  const liked = place.likes.reduce((me, profile) => {
    return profile._id == user._id;
  }, false);

  place.currentLikeCallback = function () {};

  if (liked) {
    placeLikeButton.classList.add('card__like-button_active');
    place.currentLikeCallback = removeLikeCallback;
  } else {
    placeLikeButton.classList.remove('card__like-button_active');
    place.currentLikeCallback = addLikeCallback;
  }
  placeLikeButton.addEventListener('click', onLike);

  // Delete button

  if (place.owner._id == user._id) {
    placeDeleteButton.addEventListener('click', () => {
      deletePlace(place);
      requestDeletePlace(place._id).catch((err) => {
        console.log(`ERROR: ${err}`);
        return null;
      });
    });
  } else {
    placeDeleteButton.classList.add('card__delete-button_hidden');
  }

  // Full image button

  placeImageElement.addEventListener('click', () => {
    showFullImage(place.link, place.name);
  });

  places.push(place);

  return placeElement;
}

function onLike(evt) {
  const likeButton = evt.target;
  const place = getLikedPlace(places, likeButton);
  place.currentLikeCallback(place);
}

function addLikeCallback(place) {
  place.likeCount.textContent = parseInt(place.likeCount.textContent) + 1;
  place.likeButton.classList.add('card__like-button_active');
  place.currentLikeCallback = removeLikeCallback;
  requestLike(place._id).catch((err) => {
    console.log(`LIKE REQUEST ERROR: ${err}`);
  });
}

function removeLikeCallback(place) {
  place.likeCount.textContent = parseInt(place.likeCount.textContent) - 1;
  place.likeButton.classList.remove('card__like-button_active');
  place.currentLikeCallback = addLikeCallback;
  requestUnlike(place._id).catch((err) => {
    console.log(`UNLIKE REQUEST ERROR: ${err}`);
  });
}

function addPlace(placeElement) {
  placesContainer.append(placeElement);
}

function deletePlace(place) {
  const placeElement = place.placeElement;
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

function renderCards(cards) {
  clearCards();
  cards.forEach((card) => {
    addPlace(createPlace(card));
  });
}

function renderCard(card) {
  placesContainer.prepend(createPlace(card));
}

function clearCards() {
  Array.from(placesContainer.children).forEach((place) => {
    place.remove();
  });
}

export { createPlace, addPlace, renderCards, renderCard };
