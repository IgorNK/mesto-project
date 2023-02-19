import { user, cards } from './index.js';
import { requestLike, requestUnlike } from './api.js';
import { showPopup } from './modal.js';

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

  place['likeButton'] = placeLikeButton;
  place['likeCount'] = placeLikeCount;

  placeTitleElement.textContent = place.name;
  placeImageElement.src = place.link;
  placeImageElement.alt = place.name;
  placeLikeCount.textContent = place.likes.length;

  // const liked = false;
  const liked = place.likes.reduce((me, profile) => {
    return profile._id == user._id;
  }, false);

  // console.log(place.likes);
  // console.log(liked);

  place['currentLikeCallback'] = function () {};

  if (liked) {
    placeLikeButton.classList.add('card__like-button_active');
    place.currentLikeCallback = () => {
      placeLikeButton.classList.toggle('card__like-button_active');
      removeLike(place);
    };
  } else {
    placeLikeButton.classList.remove('card__like-button_active');
    place.currentLikeCallback = () => {
      placeLikeButton.classList.toggle('card__like-button_active');
      addLike(place);
    };
  }

  placeLikeButton.addEventListener('click', place.currentLikeCallback);
  console.log('callback: ' + place.currentLikeCallback);

  if (place.owner._id == user._id) {
    placeDeleteButton.addEventListener('click', () => {
      requestDeletePlace(place._id);
    });
  } else {
    placeDeleteButton.classList.add('card__delete-button_hidden');
  }

  placeImageElement.addEventListener('click', () => {
    showFullImage(place.link, place.name);
  });

  return placeElement;
}

function addLike(place) {
  const placeLikeButton = place.likeButton;
  const likeCount = place.likeCount;
  const id = place._id;
  requestLike(id)
    .then((card) => {
      likeCount.textContent = card.likes.length;
    })
    .then(() => {
      placeLikeButton.removeEventListener('click', place.currentLikeCallback);
      place.currentLikeCallback = () => {
        placeLikeButton.classList.toggle('card__like-button_active');
        removeLike(place);
      };
      placeLikeButton.addEventListener('click', place.currentLikeCallback);
      // console.log(place);
    })
    .catch((err) => {
      console.log(`LIKE REQUEST ERROR: ${err}`);
      return null;
    });
}

function removeLike(place) {
  const placeLikeButton = place.likeButton;
  const likeCount = place.likeCount;
  const id = place._id;
  requestUnlike(id)
    .then((card) => {
      likeCount.textContent = card.likes.length;
    })
    .then(() => {
      placeLikeButton.removeEventListener('click', place.currentLikeCallback);
      place.currentLikeCallback = () => {
        placeLikeButton.classList.toggle('card__like-button_active');
        addLike(place);
      };
      placeLikeButton.addEventListener('click', place.currentLikeCallback);
      // console.log(place);
    })
    .catch((err) => {
      console.log(`UNLIKE REQUEST ERROR: ${err}`);
      return null;
    });
}

function addPlace(placeElement) {
  placesContainer.append(placeElement);
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

function clearCards() {
  Array.from(placesContainer.children).forEach((place) => {
    place.remove();
  });
}

export { createPlace, addPlace, renderCards, cards };
