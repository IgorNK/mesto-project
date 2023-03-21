export default class UserInfo {
  constructor({ nameSelector, aboutSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._aboutElement = document.querySelector(aboutSelector);
    this._avatarElement = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return {
      username: this._nameElement.textContent,
      description: this._aboutElement.textContent,
      _id: this._id,
    };
  }

  setUserInfo({ name, about, _id }) {
    this._nameElement.textContent = name;
    this._aboutElement.textContent = about;
    this._id = _id;
  }

  setUserAvatar(newAvatar) {
    this._avatarElement.style.backgroundImage = `url(${newAvatar})`;
  }
}
