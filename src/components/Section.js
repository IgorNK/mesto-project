export default class Section {
  constructor({ items, render }, containerSelector) {
    this.container = this._getContainer(containerSelector);
    this._render = render;
    this._items = items;
  }

  clear() {
    this.container.innerHTML = '';
  }

  //Renders items according to specified renderer method
  renderItems() {
    this.clear();
    this._items.forEach((element) => {
      this._render(element);
    });
  }

  //Just adds and item at the top of the page
  addItem(element) {
    this.container.prepend(element);
  }

  _getContainer(selector) {
    return document.querySelector(selector);
  }
}
