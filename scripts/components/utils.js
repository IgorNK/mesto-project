// ** UTILITY ** //
//---------------//
function getErrorElement(form, field) {
  return form.querySelector(`.${field.id}-error`);
}

function getLikedPlace(cards, likeButton) {
  const targetPlace = cards.find((place) => {
    return place.likeButton === likeButton;
  });

  return targetPlace;
}

// ** EXPORT ** //
//--------------//
export { getErrorElement, getLikedPlace };
