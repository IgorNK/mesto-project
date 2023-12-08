export default class Api {
  constructor(options) {
    this._config = options;
  }

  getInitialCards() {
    return fetch(`${this._config.baseUrl}/cards`, {
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  getUserProfile() {
    return fetch(`${this._config.baseUrl}/users/me`, {
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestLogin({email, password}) {
    return fetch(`${this._config.baseurl}/signin}`, {
      method: 'POST',
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    })
  }

  requestRegister({email, password}) {
    return fetch(`${this._config.baseurl}/signup}`, {
      method: 'POST',
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    })
  }

  requestLike(cardId) {
    return fetch(`${this._config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUnlike(cardId) {
    return fetch(`${this._config.baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestDeletePlace(cardId) {
    return fetch(`${this._config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._config.headers,
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUpdateAvatar(link) {
    return fetch(`${this._config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._config.headers,
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestAddPlace(place) {
    return fetch(`${this._config.baseUrl}/cards`, {
      method: 'POST',
      headers: this._config.headers,
      body: JSON.stringify({
        name: place.title,
        link: place.link,
      }),
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUpdateProfileData({ username, description }) {
    return fetch(`${this._config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._config.headers,
      body: JSON.stringify({
        name: username,
        about: description,
      }),
    }).then((res) => {
      return _checkResponse(res);
    });
  }
}

function _checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res.status);
}
