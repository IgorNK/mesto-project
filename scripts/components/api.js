// ** SERVER AUTHENTICATION ** //
const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/plus-cohort-21',
  headers: {
    authorization: 'aeccfdf1-17cb-4e9d-8818-d4f10c28a16b',
    'Content-type': 'application/json',
  },
};

function fetchProfile() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else return Promise.reject(res.status);
  });
}

function fetchCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then((res) => {
    if (res.ok) return res.json();
    else return Promise.reject(res.status);
  });
}

function requestLike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  }).then((res) => {
    if (res.ok) return res.json();
    else return Promise.reject(res.status);
  });
}

function requestUnlike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then((res) => {
    if (res.ok) return res.json();
    else return Promise.reject(res.status);
  });
}

function requestDeletePlace(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return Promise.reject(res.status);
    })
    .then(() => fetchCards())
    .catch((err) => {
      console.log(`ERROR: ${err}`);
      return null;
    });
}

function requestUpdateAvatar(link) {
  fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: link,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return;
      } else {
        return Promise.reject(res.status);
      }
    })
    .then(() => fetchProfile())
    .catch((err) => {
      console.log(`ERROR: ${err}`);
    });
}

function requestAddPlace(place) {
  fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: place.title,
      link: place.link,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return;
      } else {
        return Promise.reject(res.status);
      }
    })
    .then(() => {
      fetchCards();
    })
    .catch((err) => console.log(`ERROR: ${err}`));
}

function requestUpdateProfileData(newName, newDescription) {
  fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newDescription,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return;
      } else {
        return Promise.reject(res.status);
      }
    })
    .then(() => fetchProfile())
    .catch((err) => {
      console.log(`ERROR: ${err}`);
    });
}

export {
  fetchProfile,
  fetchCards,
  requestAddPlace,
  requestDeletePlace,
  requestLike,
  requestUnlike,
  requestUpdateAvatar,
  requestUpdateProfileData,
};
