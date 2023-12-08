export default class Api {
  constructor(options) {
    this._config = options;
  }  

  getInitialCards() {
    return fetch(`${this._config.baseUrl}/cards`).then((res) => {
      return _checkResponse(res);
    });
  }

  getUserProfile() {
    return fetchWithAuth(`${this._config.baseUrl}/users/me`).then((res) => {
      return _checkResponse(res);
    });
  }

  requestLogin(values) {
    console.log('login credentials: ');
    console.log(values);
    return fetch(`${this._config.baseUrl}/signin`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values.email, password: values.password }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res.status);
      }
    }).then((res) => {
      setCookie("authentication", res.token);
      return fetchWithAuth(`${this._config.baseUrl}/users/me`)
    }).then((res) => {
      return _checkResponse(res);
    })
  }

  requestRegister(values) {
    return fetch(`${this._config.baseUrl}/signup`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values.email, password: values.password }),
    }).then((res) => {
      return _checkResponse(res);
    })
  }

  requestLogout() {
    return deleteCookie("jwt");
  }

  requestLike(cardId) {
    return fetchWithAuth(`${this._config.baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUnlike(cardId) {
    return fetchWithAuth(`${this._config.baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestDeletePlace(cardId) {
    return fetchWithAuth(`${this._config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUpdateAvatar(link) {
    return fetchWithAuth(`${this._config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestAddPlace(place) {
    return fetchWithAuth(`${this._config.baseUrl}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: place.title,
        link: place.link,
      }),
    }).then((res) => {
      return _checkResponse(res);
    });
  }

  requestUpdateProfileData({ username, description }) {
    return fetchWithAuth(`${this._config.baseUrl}/users/me`, {
      method: 'PATCH',
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

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

function fetchWithAuth(url, options = {}) {
  const auth = getCookie("authentication");
  return fetch(url, {
    mode: 'cors',
    headers: {
      'Authorization': auth ? `Bearer ${auth}` : null,
      'Content-Type': 'application/json',
    },
    ...options
  });
}