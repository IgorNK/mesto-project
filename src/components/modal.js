// ** IMPORTS ** //
//---------------//
import {
  requestAddPlace,
  requestUpdateAvatar,
  requestUpdateProfileData,
  requestDeletePlace,
} from './api.js';
import { cards, updateUser, updateCards, renderProfile } from './index.js';
import { renderCard, deletePlace } from './cards.js';
import { toggleButtonState } from './validate.js';

const formSubmitCallabcks = {
  'avatar-edit': handleAvatarEditFormSubmit,
  'profile-edit': handleProfileEditFormSubmit,
  'add-place': handleAddPlaceFormSubmit,
  'delete-place': handleDeletePlaceFormSubmit,
};

const processingMessage = 'Saving...';
const defaultSubmitMessage = 'Сохранить';
const confirmSubmitMessage = 'Да';

// ** EVENT LISTENING ** //
//-----------------------//
function addCloseButtonListeners() {
  const buttons = document.querySelectorAll('.popup__close-button');
  buttons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
      hidePopup(popup);
    });
  });
}

function addFormSubmitListeners(forms) {
  for (const formName in forms) {
    forms[formName].form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      forms[formName].callback(forms[formName]);
    });
  }
}

// ** EVENT HANDLERS ** //
//----------------------//
function handleAvatarEditFormSubmit(form) {
  const linkField = form.fields[0];
  const newAvatar = linkField.value;
  onProcessingStart(form);
  requestUpdateAvatar(newAvatar)
    .then((data) => {
      updateUser(data);
      renderProfile(data);
    })
    .catch((err) => {
      console.log(`EDIT AVATAR ERROR: ${err}`);
    })
    .finally(() => {
      onProcessingComplete(form, defaultSubmitMessage);
    });
}

function handleProfileEditFormSubmit(form) {
  const nameField = form.fields[0];
  const descriptField = form.fields[1];
  const newName = nameField.value;
  const newDescription = descriptField.value;
  onProcessingStart(form);
  requestUpdateProfileData(newName, newDescription)
    .then((data) => {
      updateUser(data);
      renderProfile(data);
    })
    .catch((err) => {
      console.log(`EDIT PROFILE ERROR: ${err}`);
    })
    .finally(() => {
      onProcessingComplete(form, defaultSubmitMessage);
    });
}

function handleAddPlaceFormSubmit(form) {
  const titleField = form.fields[0];
  const linkField = form.fields[1];
  const title = titleField.value;
  const link = linkField.value;
  onProcessingStart(form);
  requestAddPlace({ title: title, link: link })
    .then((data) => {
      renderCard(data);
      updateCards(cards.concat(data));
    })
    .catch((err) => console.log(`ADD PLACE ERROR: ${err}`))
    .finally(() => {
      onProcessingComplete(form, defaultSubmitMessage);
    });
}

function handleDeletePlaceFormSubmit(form) {
  onProcessingStart(form);
  const place = form.place;
  requestDeletePlace(place._id)
    .then((data) => {
      deletePlace(place);
    })
    .catch((err) => {
      console.log(`DELETE PLACE ERROR: ${err}`);
    })
    .finally(() => {
      onProcessingComplete(form, confirmSubmitMessage);
    });
}

// ** SAVE PROCESS RENDERING ** //
//------------------------------//
function onProcessingStart(form) {
  form.submit.textContent = processingMessage;
}

function onProcessingComplete(form, message) {
  form.submit.textContent = message;
  hidePopup(form.popup);
  resetForm(form);
}

// ** ELEMENT MANIPULATION ** //
//----------------------------//
let keyDownCallback;

function addEscapeListener(popup) {
  document.addEventListener(
    'keydown',
    (keyDownCallback = function (evt) {
      if (evt.key === 'Escape') {
        document.activeElement.blur();
        hidePopup(popup);
      }
    })
  );
}

function showPopup(popup) {
  popup.classList.add('popup_opened');
  addEscapeListener(popup);
}

function hidePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', keyDownCallback);
}

function resetForm(formObj) {
  formObj.form.reset();
  if (formObj.fields == null) {
    return;
  }
  const fields = Object.values(formObj.fields);
  toggleButtonState(formObj.submit, fields);
}

// ** This one is called from scipt.js for initialization ** //
//-----------------------------------------------------------//
function enableForms(forms) {
  addFormSubmitListeners(forms);
}

// ** EXPORT ** //
//--------------//
export {
  enableForms,
  addCloseButtonListeners,
  showPopup,
  hidePopup,
  formSubmitCallabcks,
};
