// ** UTILITY ** //
//---------------//
function getErrorElement(form, field) {
  return form.querySelector(`.${field.id}-error`);
}

// ** EXPORT ** //
//--------------//
export { getErrorElement };
