import { api } from './Api.js';

export default class UserInfo {
  constructor({ nameSelector, aboutSelector, avatarSelector }) {
    this.nameElement = document.querySelector(nameSelector);
    this.aboutElement = document.querySelector(aboutSelector);
    this.avatarElement = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return api
      .getUserProfile()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(`ERROR GETTING USER INFO: ${err} \n ${err.stack}`);
      });
  }

  setUserInfo(newName, newAbout) {
    return api
      .requestUpdateProfileData(newName, newAbout)
      .then((data) => {
        this.displayUserInfo(data);
      })
      .catch((err) => {
        console.log(`EDIT PROFILE ERROR: ${err} \n ${err.stack}`);
      });
  }

  setUserAvatar(newAvatar) {
    return api
      .requestUpdateAvatar(newAvatar)
      .then((data) => {
        this.displayAvatar(data.avatar);
      })
      .catch((err) => {
        console.log(`EDIT AVATAR ERROR: ${err} \n ${err.stack}`);
      });
  }

  render(userData) {
    this.displayUserInfo(userData);
    this.displayAvatar(userData.avatar);
  }

  displayUserInfo(userData) {
    this.nameElement.textContent = userData.name;
    this.aboutElement.textContent = userData.about;
  }

  displayAvatar(avatarLink) {
    this.avatarElement.style.backgroundImage = `url(${avatarLink})`;
  }
}

const user = new UserInfo({
  nameSelector: '.profile__name',
  aboutSelector: '.profile__description',
  avatarSelector: '.profile__avatar-edit-button',
});

export { user };
