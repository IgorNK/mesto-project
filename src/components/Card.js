export default class Card {
  constructor(data, cardSelector) {
    this._selector = cardSelector;

    this._cardTitle = data.name;
    this._cardImageUrl = data.link;
    this._cardLikeCountElement = data.likes;
    this._cardId = data._id;

    this._owner = data.owner;
  }

  createCardElement({
    currentUserData,
    cardCallback,
    addLikeCallback,
    removeLikeCallback,
    deleteCardCallback,
  }) {
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
      return profile._id == currentUserData._id;
    }, false);

    this._currentLikeCallback = function () {};

    if (liked) {
      this._likeButton.classList.add('card__like-button_active');
      this._currentLikeCallback = removeLikeCallback;
    } else {
      this._likeButton.classList.remove('card__like-button_active');
      this._currentLikeCallback = addLikeCallback;
    }

    this._setEventListeners(currentUserData, cardCallback, deleteCardCallback);

    return card;
  }

  _setEventListeners(currentUserData, cardCallback, deleteCardCallback) {
    this._likeButton.addEventListener('click', () => {
      this._currentLikeCallback();
    });

    if (this._owner._id == currentUserData._id) {
      this.cardDeleteButton.addEventListener('click', deleteCardCallback);
    } else {
      this.cardDeleteButton.classList.add('card__delete-button_hidden');
    }

    this.cardImageElement.addEventListener('click', cardCallback);
  }

  _updateLikesCount(likes) {
    this._likeButton.classList.toggle('card__like-button_active');
    this._cardLikeCount.textContent = likes.length;
  }

  deleteCard() {
    this._cardElement.remove();
  }
}
