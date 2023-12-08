const popupSelectors = {
  profileEdit: '.popup__for_profile-edit',
  avatarEdit: '.popup__for_avatar-edit',
  addPlace: '.popup__for_add-place',
  image: '.popup__for_image',
  deletePlace: '.popup__for_delete-place',
  login: '.popup__for_sign-in',
  register: '.popup__for_sign-up',
};

const formElementSelectors = {
  popupSelector: '.popup',
  formSelector: '.form',
  inputSelector: '.form__field',
  submitSelector: '.form__button',
  inactiveSubmitClass: 'form__button_inactive',
  inputErrorSelector: '.form__field-error',
  activeInputErrorClass: 'form__field-error_active',
};

const cardContainerSelector = '.cards';
const defaultCardSelector = '#card-template';

const processingMessage = 'Saving...';
const defaultConfirmMessage = 'Да';

const apiconfig = {
  //baseUrl: 'https://mesto.nomoreparties.co/v1/plus-cohort-21',
  baseUrl: 'https://mesto-project-plus.metsysfhtagn.repl.co',
  headers: {
    authorization: 'aeccfdf1-17cb-4e9d-8818-d4f10c28a16b',
    'Content-type': 'application/json',
  },
};

const userInfoSelectors = {
  nameSelector: '.profile__name',
  aboutSelector: '.profile__description',
  avatarSelector: '.profile__avatar-edit-button',
};

let sections = {
  cards: [],
};

let popups = {};

export {
  popupSelectors,
  formElementSelectors,
  cardContainerSelector,
  defaultCardSelector,
  processingMessage,
  defaultConfirmMessage,
  apiconfig,
  userInfoSelectors,
  sections,
  popups,
};
