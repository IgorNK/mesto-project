'use strict';
// ** IMPORTS ** //
//---------------//
import '../pages/index.css';
import { api } from '../components/Api.js';
import { user } from '../components/UserInfo.js';
import Card from '../components/Card.js';
import Form from '../components/Form.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import Section from '../components/Section.js';

let cards = [];
let popups;

const popupSelectors = {
  profileEdit: '.popup__for_profile-edit',
  avatarEdit: '.popup__for_avatar-edit',
  addPlace: '.popup__for_add-place',
  image: '.popup__for_image',
  deletePlace: '.popup__for_delete-place',
};

const formSelectors = {
  profileEdit: 'profile-edit',
  avatarEdit: 'avatar-edit',
  addPlace: 'add-place',
  deletePlace: 'delete-place',
};

const cardContainerSelector = '.cards';
const defaultCardSelector = '#card-template';

const formElementSelectors = {
  popupSelector: '.popup',
  formSelector: '.form',
  inputSelector: '.form__field',
  submitSelector: '.form__button',
  inactiveSubmitClass: 'form__button_inactive',
  inputErrorSelector: '.form__field-error',
  activeInputErrorClass: 'form__field-error_active',
};

// ** STUFF TO DO ON PAGE LOAD ** //
//--------------------------------//

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
  const profileFormObj = popups.profileEdit.form;
  const profileNameField = profileFormObj.fields[0];
  const profileDescriptionField = profileFormObj.fields[1];
  profileNameField.value = user.nameElement.textContent;
  profileDescriptionField.value = user.aboutElement.textContent;

  profileFormObj.validator.checkInputValidity(profileNameField);
  profileFormObj.validator.checkInputValidity(profileDescriptionField);
}

function renderPage() {
  Promise.all([user.getUserInfo(), api.getInitialCards()])
    .then(([profileData, cardsData]) => {
      renderCards(cardsData, profileData);
      user.render(profileData);
    })
    .catch((err) => {
      console.log(`ERROR RENDERING PAGE: ${err} \n ${err.stack}`);
    });
}

function initPopups(selectors) {
  let popups = {};
  Object.keys(selectors).forEach((popupName) => {
    if (popupName == 'image') {
      popups[popupName] = new PopupWithImage(selectors[popupName]);
    } else {
      const formElement = document.forms[formSelectors[popupName]];
      const formObj = new Form(
        { formElement: formElement, formName: popupName },
        formElementSelectors
      );
      formObj.enableValidation();
      popups[popupName] = new PopupWithForm(selectors[popupName], () => {
        formObj.callback().then(() => renderPage());
      });
      popups[popupName].form = formObj;
      formObj.popup = popups[popupName];
    }
  });
  return popups;
}

function renderCards(newCards, profileData) {
  cards = new Section(
    {
      items: newCards,
      render: (item) => {
        const card = new Card(item, defaultCardSelector);
        const cardElement = card.createCardElement({
          currentUserData: profileData,
          cardCallback: function () {
            popups.image.open(item);
          },
          deleteCallback: function () {
            popups.deletePlace.form.card = card;
            popups.deletePlace.open();
          },
        });
        cards._container.append(cardElement);
      },
    },
    cardContainerSelector
  );
  cards.renderItems();
}

// ** ACTUAL PAGE INITIALIZATION ** //
//----------------------------------//
addEventListeners(); // In this scope

//forms = initForms(formSelectors); // In this scope
popups = initPopups(popupSelectors); // In this scope

renderPage(); // In this scope

export { user, cards };
