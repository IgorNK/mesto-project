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

  const loginButton = document.querySelector('.header__sign-in-button');
  loginButton.addEventListener('click', () => {
    popups.login.open();
  });

  const registerButton = document.querySelector('.header__register-button');
  registerButton.addEventListener('click', () => {
    popups.register.open();
  })

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
  api.getUserProfile()
    .then((profile) => {
      userInfo.seetUserInfo({
        name: profile.name,
        about: profile.about,
        _id: profile._id,
      });
      userInfo.setUserAvatar(profileData.avatar);
    })
    .catch((err) => {
      console.log(`ERROR GETTING PROFILE: ${err}`);
    })
  
  api.getInitialCards()
    .then((cards) => {
      sections.cards = createCards(cards);
      sections.cards.renderItems();
    })
    .catch((err) => {
      console.log(`ERROR GETTING CARDS: ${err}`);
    })
  
  // Promise.all([api.getUserProfile(), api.getInitialCards()])
  //   .then(([profileData, cardsData]) => {
  //     userInfo.setUserInfo({
  //       name: profileData.name,
  //       about: profileData.about,
  //       _id: profileData._id,
  //     });
  //     userInfo.setUserAvatar(profileData.avatar);
  //     sections.cards = createCards(cardsData);
  //     sections.cards.renderItems();
  //   })
  //   .catch((err) => {
  //     console.log(`ERROR RENDERING PAGE: ${err} \n ${err.stack}`);
  //   });
}

function initPopups(popups, selectors) {
  Object.keys(selectors).forEach((popupName) => {
    let newPopup;
    switch (popupName) {
      case 'image':
        newPopup = new PopupWithImage(selectors[popupName]);
        break;
      case 'deletePlace':
        newPopup = new PopupWithConfirmation(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleDeletePlaceFormSubmit.bind(newPopup),
        });
        break;
      case 'profileEdit':
        newPopup = new PopupWithForm(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleProfileEditFormSubmit.bind(newPopup),
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'avatarEdit':
        newPopup = new PopupWithForm(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleAvatarEditFormSubmit.bind(newPopup),
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'addPlace':
        newPopup = new PopupWithForm(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleAddPlaceFormSubmit.bind(newPopup),
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'login':
        newPopup = new PopupWithForm(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleLoginFormSubmit.bind(newPopup),
        });
        assignValidator(newPopup).enableValidation();
        break;
      case 'register':
        newPopup = new PopupWithForm(selectors[popupName], {
          formElementSelectors: formElementSelectors,
        });
        newPopup.assignCallback({
          callback: handleRegisterFormSubmit.bind(newPopup),
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

function createCards(newCards) {
  const cards = new Section(
    {
      items: newCards,
      render: (item) => {
        cards.container.append(createCardElement(item));
      },
    },
    cardContainerSelector
  );
  return cards;
}

function createCardElement(cardData) {
  const card = new Card(cardData, defaultCardSelector);
  const cardElement = card.createCardElement({
    currentUserId: userInfo.getUserId(),
    cardCallback: function () {
      popups.image.open(cardData);
    },
    addLikeCallback: addLikeCallback.bind(card),
    removeLikeCallback: removeLikeCallback.bind(card),
    deleteCardCallback: deleteCardCallback.bind(card),
  });
  return cardElement;
}

// ** FORM SUBMIT EVENT CALLBACKS ** //
//-----------------------------------//
function handleAvatarEditFormSubmit(values) {
  // console.log('handle avatar edit this:');
  // console.log(this);
  api
    .requestUpdateAvatar(values.link)
    .then((data) => {
      userInfo.setUserAvatar(data.avatar);
      this.close();
    })
    .catch((err) => {
      console.log(`EDIT AVATAR ERROR: ${err} \n ${err.stack}`);
    })
    .finally(() => {
      this.onProcessingComplete();
    });
}

function handleProfileEditFormSubmit(values) {
  // console.log('handle profile edit this:');
  // console.log(this);
  api
    .requestUpdateProfileData({
      username: values.username,
      description: values.description,
    })
    .then((data) => {
      userInfo.setUserInfo(data);
      this.close();
    })
    .catch((err) => {
      console.log(`EDIT PROFILE ERROR: ${err} \n ${err.stack}`);
    })
    .finally(() => {
      this.onProcessingComplete();
    });
}

function handleAddPlaceFormSubmit(values) {
  // console.log('handle add place this:');
  // console.log(this);
  api
    .requestAddPlace({ title: values.title, link: values.link })
    .then((data) => {
      const newCardElement = createCardElement(data, userInfo.getUserId());
      sections.cards.addItem(newCardElement);
      this.close();
    })
    .catch((err) => console.log(`ADD PLACE ERROR: ${err} \n ${err.stack}`))
    .finally(() => {
      this.onProcessingComplete();
    });
}

function handleDeletePlaceFormSubmit(card) {
  // console.log('handle delete place this:');
  // console.log(this);
  api
    .requestDeletePlace(card.cardId)
    .then((data) => {
      card.deleteCard();
      card = null;
      this.close();
    })
    .catch((err) => {
      console.log(`DELETE PLACE ERROR: ${err} \n ${err.stack}`);
    })
    .then(() => {
      this.onProcessingComplete();
    });
}

function handleLoginFormSubmit(values) {
  console.log('login form submit');
  api
    .requestLogin({ email: values.email, password: values.password })
    .then((user) => {
      userInfo.setUserInfo(user);
      this.close();
    })
    .catch((err) => {
      console.log(`LOGIN ERROR: ${err} \n ${err.stack}`);
    })
    .then(() => {
      this.onProcessingComplete();
    });
}

function handleRegisterFormSubmit(values) {
  console.log('register form submit');
  api
  .requestRegister({ email: values.email, password: values.password })
  .then((user) => {
    userInfo.setUserInfo(user);
    this.close();
  })
  .catch((err) => {
    console.log(`LOGIN ERROR: ${err} \n ${err.stack}`);
  })
  .then(() => {
    this.onProcessingComplete();
  });
}

// ********* CARD CALLBACKS ******** //
//-----------------------------------//
function addLikeCallback(card) {
  // console.log('add like this:');
  // console.log(this);
  card.currentLikeCallback = removeLikeCallback.bind(card);
  api
    .requestLike(card.cardId)
    .then((data) => {
      card.updateLikesCount(data.likes);
    })
    .catch((err) => {
      console.log(`LIKE REQUEST ERROR: ${err} \n ${err.stack}`);
    });
}

function removeLikeCallback(card) {
  card.currentLikeCallback = addLikeCallback.bind(card);
  api
    .requestUnlike(card.cardId)
    .then((data) => {
      card.updateLikesCount(data.likes);
    })
    .catch((err) => {
      console.log(`UNLIKE REQUEST ERROR: ${err} \n ${err.stack}`);
    });
}

function deleteCardCallback() {
  popups.deletePlace.setCard(this);
  popups.deletePlace.open();
}

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
initialize(); // In this scope

addEventListeners(); // In this scope

initPopups(popups, popupSelectors); // In this scope
renderPage(); // In this scope
