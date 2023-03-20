import { api } from './Api.js';

export default class UserInfo {
  constructor({ nameSelector, aboutSelector }) {
    console.log(nameSelector);
    console.log(aboutSelector);
    this._nameSelector = nameSelector;
    this._aboutSelector = aboutSelector;
  }

  getUserInfo() {
    console.log('getUserInfo called');
    return api.getUserProfile().then((data) => {
      console.log('profile data: ');
      console.log(data);
      return data;
    });
  }

  setUserInfo(newName, newAbout) {
    return api
      .requestUpdateProfileData(newName, newAbout)
      .then((data) => {
        this._updateUserInfo(data);
      })
      .catch((err) => {
        console.log(`EDIT PROFILE ERROR: ${err} \n ${err.stack}`);
      });
  }

  displayUserInfo(userData) {
    console.log(
      'name selector: ' + this._nameSelector + ', about selector: ',
      this._aboutSelector
    );
    document.querySelector(this._nameSelector).textContent = userData.name;
    document.querySelector(this._aboutSelector).textContent = userData.about;
  }
}
