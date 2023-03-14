import { user, forms } from './index.js';
import { api } from './Api.js';
import Popup from './Popup.js';
// import { showPopup } from './modal.js';

const placesContainer = document.querySelector('.cards');

// const popupImage = document.querySelector('.popup__for_image');
const popupImage = new Popup('.popup__for_image');

export default class Card {
  constructor(data, cardSelector) {
    this._selector = cardSelector;

    this._cardTitle = data.name;
    this._cardImageUrl = data.link;
    this._cardLikeCountElement = data.likes;
    this._cardId = data._id;

    this._data = data;

    this._owner = data.owner;
  }

  _createCard() {
    const card = document
      .querySelector(this._selector)
      .content.querySelector('.card')
      .cloneNode(true);

    this.cardTitleElement = card.querySelector('.card__name');
    this.cardImageElement = card.querySelector('.card__image');
    this._likeButton = card.querySelector('.card__like-button');
    this._cardLikeCount = card.querySelector('.card__like-button-count');
    this.cardDeleteButton = card.querySelector('.card__delete-button');

    this._cardElement = card;

    this.cardTitleElement.textContent = this._cardTitle;
    this.cardImageElement.src = this._cardImageUrl;
    this.cardImageElement.alt = this._cardTitle;
    this._cardLikeCount.textContent = this._cardLikeCountElement.length;

    const liked = this._cardLikeCountElement.reduce((me, profile) => {
      return profile._id == user._id;
    }, false);

    this._currentLikeCallback = function () {};

    if (liked) {
      this._likeButton.classList.add('card__like-button_active');
      this._currentLikeCallback = this.removeLikeCallback;
    } else {
      this._likeButton.classList.remove('card__like-button_active');
      this._currentLikeCallback = this.addLikeCallback;
    }

    this._setEventListeners();

    return card;
  }

  addLikeCallback() {
    this._currentLikeCallback = this.removeLikeCallback;
    api
      .requestLike(this._cardId)
      .then(() => {
        this._likeButton.classList.add('card__like-button_active');
        this._cardLikeCount.textContent =
          parseInt(this._cardLikeCount.textContent) + 1;
      })
      .catch((err) => {
        console.log(`LIKE REQUEST ERROR: ${err} \n ${err.stack}`);
      });
  }

  removeLikeCallback() {
    this._currentLikeCallback = this.addLikeCallback;
    api
      .requestUnlike(this._cardId)
      .then(() => {
        this._likeButton.classList.remove('card__like-button_active');
        this._cardLikeCount.textContent =
          parseInt(this._cardLikeCount.textContent) - 1;
      })
      .catch((err) => {
        console.log(`UNLIKE REQUEST ERROR: ${err} \n ${err.stack}`);
      });
  }

  offerDeletePlace() {
    // forms.deletePlace.place = this._data;
    forms.deletePlace.card = this;
    // showPopup(forms.deletePlace.popup);
    forms.deletePlace.popup.open();
  }

  showFullImage() {
    popupImage.imageElement.src = this._cardImageUrl;
    popupImage.imageElement.alt = this._cardTitle;
    popupImage.imageCaption.textContent = this._cardTitle;
    // showPopup(popupImage);
    popupImage.open();
  }

  _setEventListeners() {
    this._likeButton.addEventListener('click', () => {
      this._currentLikeCallback();
    });

    if (this._owner._id == user._id) {
      this.cardDeleteButton.addEventListener('click', () => {
        this.offerDeletePlace();
      });
    } else {
      this.cardDeleteButton.classList.add('card__delete-button_hidden');
    }

    this.cardImageElement.addEventListener('click', () => {
      this.showFullImage();
    });
  }

  addCard(card) {
    placesContainer.append(card);
  }

  deleteCard() {
    this._cardElement.remove();
  }

  renderCard() {
    this.addCard(this._createCard());
  }

  renderCardFront() {
    placesContainer.prepend(this._createCard());
  }
}
