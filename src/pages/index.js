'use strict';
// ** IMPORTS ** //
//---------------//
import '../pages/index.css';
import Api from '../components/Api.js';
import UserInfo from '../components/UserInfo.js';
import Card from '../components/Card.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithConfirmation from '../components/PopupWithConfirmation.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import {
  popupSelectors,
  formElementSelectors,
  cardContainerSelector,
  defaultCardSelector,
  apiconfig,
  userInfoSelectors,
  sections,
  popups,
} from '../utils/constants.js';

let api, userInfo;

// ** STUFF TO DO ON PAGE LOAD ** //
//--------------------------------//
function initialize() {
  api = new Api(apiconfig);
  userInfo = new UserInfo(userInfoSelectors);
}

function addEventListeners() {
  const avatarEditButton = document.querySelector(
    '.profile__avatar-edit-button'
  );
  avatarEditButton.addEventListener('click', () => {
    popups.avatarEdit.open();
  });

  const profileEditButton = document.querySelector('.profile__edit-button');
  profileEditButton.addEventListener('click', () => {
    populateProfileEditInputs();
    popups.profileEdit.open();
  });

  const placeAddButton = document.querySelector('.profile__add-button');
  placeAddButton.addEventListener('click', () => {
    popups.addPlace.open();
  });

  document.addEventListener('mouseup', (evt) => {
    const target = evt.target;
    if (target.classList.contains('popup')) {
      target.popupObj.close();
    }
  });
}

function populateProfileEditInputs() {
  popups.profileEdit.fillInputs(userInfo.getUserInfo());
}

function renderPage() {
  Promise.all([api.getUserProfile(), api.getInitialCards()])
    .then(([profileData, cardsData]) => {
      userInfo.setUserInfo({
        name: profileData.name,
        about: profileData.about,
        _id: profileData._id,
      });
      userInfo.setUserAvatar(profileData.avatar);
      sections.cards = createCards(cardsData, profileData);
      sections.cards.renderItems();
    })
    .catch((err) => {
      console.log(`ERROR RENDERING PAGE: ${err} \n ${err.stack}`);
    });
}

function initPopups(popups, selectors) {
  Object.keys(selectors).forEach((popupName) => {
    let newPopup;
    switch (popupName) {
      case 'image':
        newPopup = new PopupWithImage(selectors[popupName]);
        break;
      case 'deletePlace':
        newPopup = new PopupWithConfirmation(selectors[popupName]);
        break;
      case 'profileEdit':
        newPopup = new PopupWithForm(selectors[popupName], {
          callback: handleProfileEditFormSubmit.bind(newPopup),
          formElementSelectors: formElementSelectors,
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'avatarEdit':
        newPopup = new PopupWithForm(selectors[popupName], {
          callback: handleAvatarEditFormSubmit.bind(newPopup),
          formElementSelectors: formElementSelectors,
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'addPlace':
        newPopup = new PopupWithForm(selectors[popupName], {
          callback: handleAddPlaceFormSubmit.bind(newPopup),
          formElementSelectors: formElementSelectors,
        });
        assignValidator(newPopup).enableValidation();
        break;
    }
    popups[popupName] = newPopup;
  });
  return popups;
}

function assignValidator(popup) {
  popup.validator = new FormValidator(formElementSelectors, popup.form);
  return popup.validator;
}

function createCards(newCards, profileData) {
  let cards = new Section(
    {
      items: newCards,
      render: (item) => {
        cards._container.append(createCardElement(item, profileData));
      },
    },
    cardContainerSelector
  );
  return cards;
}

function createCardElement(cardData, profileData) {
  const card = new Card(cardData, defaultCardSelector);
  const cardElement = card.createCardElement({
    currentUserData: profileData,
    cardCallback: function () {
      popups.image.open(cardData);
    },
    deleteCallback: function () {
      popups.deletePlace.form.card = card;
      popups.deletePlace.open();
    },
    addLikeCallback: addLikeCallback.bind(card),
    removeLikeCallback: removeLikeCallback.bind(card),
  });
  return cardElement;
}

// ** FORM SUBMIT EVENT CALLBACKS ** //
//-----------------------------------//
function handleAvatarEditFormSubmit(values) {
  return api
    .requestUpdateAvatar(values.link)
    .then((data) => {
      userInfo.setUserAvatar(data.avatar);
    })
    .catch((err) => {
      console.log(`EDIT AVATAR ERROR: ${err} \n ${err.stack}`);
    });
}

function handleProfileEditFormSubmit(values) {
  return api
    .requestUpdateProfileData({
      username: values.username,
      description: values.description,
    })
    .then((data) => {
      userInfo.setUserInfo(data);
    })
    .catch((err) => {
      console.log(`EDIT PROFILE ERROR: ${err} \n ${err.stack}`);
    });
}

function handleAddPlaceFormSubmit(values) {
  return api
    .requestAddPlace({ title: values.title, link: values.link })
    .then((data) => {
      const newCardElement = createCardElement(data, userInfo.getUserInfo());
      sections.cards.addItem(newCardElement);
    })
    .catch((err) => console.log(`ADD PLACE ERROR: ${err} \n ${err.stack}`));
}

function handleDeletePlaceFormSubmit(values) {
  return api.requestDeletePlace(placeData._id).catch((err) => {
    console.log(`DELETE PLACE ERROR: ${err} \n ${err.stack}`);
  });
}

// ********* CARD CALLBACKS ******** //
//-----------------------------------//
function addLikeCallback() {
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

function removeLikeCallback() {
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

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
initialize(); // In this scope

addEventListeners(); // In this scope

initPopups(popups, popupSelectors); // In this scope
renderPage(); // In this scope
