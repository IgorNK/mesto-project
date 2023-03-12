import { user, cards, forms } from './index.js';
import { requestLike, requestUnlike } from './api.js';
import { showPopup } from './modal.js';
import { getLikedPlace } from './utils.js';

const placesContainer = document.querySelector('.cards');

const popupImage = document.querySelector('.popup__for_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__image-caption');

export default class Card {
    constructor(data, cardSelector) {
        this._selector = cardSelector;
        this._cardElement = data.placeElement;
        this._likeButton = data.likeButton;
        this._cardLikeCount = data.likeCount;
        this._cardTitle = data.name;
        this._cardImage = data.link;
        this._cardLikeCountElement = data.likes;
        this._cardId = data._id;

        this._data = data;

        this._currentLikeCallback = data.currentLikeCallback;
        this._owner = data.owner;

    }
    
    _createCard() {
        const card = document
            .querySelector(this._selector)
            .content
            .querySelector('.card')
            .cloneNode(true);

        this.cardTitleElement = card.querySelector('.card__name');
        this.cardImageElement = card.querySelector('.card__image');
        this.cardLikeButton = card.querySelector('.card__like-button');
        this.cardLikeCount = card.querySelector('.card__like-button-count');
        this.cardDeleteButton = card.querySelector('.card__delete-button');

        this._cardElement = card;
        this._likeButton = cardLikeButton;
        this._cardLikeCount = cardLikeCount;

        this.cardTitleElement.textContent = this._cardTitle;
        this.cardImageElement.src = this._cardImage;
        this.cardImageElement.alt = this._cardTitle;
        this.cardLikeCount.textContent = this._cardLikeCountElement.length

        const liked = this._cardLikeCountElement.reduce((me, profile) => {
            return profile._id == user._id;
        }, false);

        this._currentLikeCallback = function () { };

        if (liked) {
            this._likeButton.classList.add('card__like-button_active');
            this._currentLikeCallback = this.removeLikeCallback;
        } else {
            this._likeButton.classList.remove('card__like-button_active');
            this._currentLikeCallback = this.addLikeCallback;
        }

        return card;

    }

    onLike(evt) {
        this.likeButton = evt.target;
        const place = getLikedPlace(cards, likeButton);
        this._currentLikeCallback(place);
    }

    addLikeCallback() {
        this._currentLikeCallback = this.removeLikeCallback;
        requestLike(this._cardId)
            .then(() => {
                this._likeButton.classList.add('card__like-button_active');
                this._cardLikeCount.textContent = parseInt(this._cardLikeCount.textContent) + 1;
                //по поводу этих строчек, не совсем понимаю тебя, для чего ты это делаешь, 
                //ты же когда с сервера колбек заюираешь, он сам убавляет и прибавляет количество лайков
            })
            .catch((err) => {
                console.log(`LIKE REQUEST ERROR: ${err}`);
            });
    }

    removeLikeCallback() {
        this._currentLikeCallback = this.addLikeCallback;
        requestUnlike(this._cardId)
            .then(() => {
                this._likeButton.classList.remove('card__like-button_active');
                this._cardLikeCount.textContent = parseInt(this._cardLikeCount.textContent) - 1;
            })
            .catch((err) => {
                console.log(`UNLIKE REQUEST ERROR: ${err}`);
            });
    }

    offerDeletePlace() {
        forms.deletePlace.place = this._data;
        showPopup(forms.deletePlace.popup);
    }

    showFullImage() {
        popupImageElement.src = this._cardImageUrl;
        popupImageElement.alt = this._cardTitle;
        popupImageCaption.textContent = this._cardTitle;
        showPopup(popupImage);
    }

    _setEventListeners() {
        this._likeButton.addEventListener('click', this.onLike());

        if (this._owner._id == user._id) {
            this.cardDeleteButton.addEventListener('click', () => {
                this.offerDeletePlace();
            });
        } else {
            this.cardDeleteButton.classList.add('card__delete-button_hidden');
        }
    
        this._cardImage.addEventListener('click', () => {
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
        this.addCard(this._createPlace());
    }
}



