class Api {
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

  requestUpdateProfileData(newName, newDescription) {
    return fetch(`${this._config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._config.headers,
      body: JSON.stringify({
        name: newName,
        about: newDescription,
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

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/plus-cohort-21',
  headers: {
    authorization: 'aeccfdf1-17cb-4e9d-8818-d4f10c28a16b',
    'Content-type': 'application/json',
  },
});

export { api };
