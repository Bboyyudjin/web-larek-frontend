import { IProduct } from "../../types";
import { CDN_URL, productCategorySettings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


// Общий класс карточки
export class Card extends Component<IProduct>{
  protected _title: HTMLHeadElement
  protected _description?: HTMLParagraphElement
  protected _price: HTMLSpanElement
  protected _image?: HTMLImageElement
  protected _category?: HTMLSpanElement
  protected _button?: HTMLButtonElement
  protected _index?: HTMLSpanElement

  constructor(container: HTMLElement, events:IEvents) {
    super(container, events)

    this._title = ensureElement<HTMLHeadElement>('.card__title', container)
    this._price = ensureElement<HTMLElement>('.card__price', container)
  }

  removeClassListCategory(data: IProduct) {
    this._category.classList.replace(
      this._category.classList.value.match(/card__category_\S+/)[0], 
      'card__category_' + productCategorySettings[data.category as keyof typeof productCategorySettings])
  }

  render(data: IProduct): HTMLElement {
    this.setText(this._title, data.title)
    if (data.price === null) {
      this.setText(this._price, 'Бесценно')
    } else {
      this.setText(this._price, data.price + ' синапсов')}
    return super.render(data);
  }
}

// Класс карточки для отображения в каталоге
export class CardInCatalog extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    
    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    this._category = ensureElement<HTMLSpanElement>('.card__category', container)
  }

  render(data: IProduct): HTMLElement {
    this.setImage(this._image, CDN_URL + data.image)
    this.removeClassListCategory(data)
    this.setText(this._category, data.category)
    this.container.addEventListener('click', () => {
      this.events.emit('cardPreviw:render', data)
    });

    return super.render(data)
  }
  }
  
// Класс карточки для открытия превью
  export class CardPreviw extends Card {
    constructor(container: HTMLElement, events: IEvents) {
      super(container, events)
      
      this._button = ensureElement<HTMLButtonElement>('.card__button', container)
      this._description = ensureElement<HTMLParagraphElement>('.card__text', container)
      this._image = ensureElement<HTMLImageElement>('.card__image', container)
      this._category = ensureElement<HTMLSpanElement>('.card__category', container)
    }

    changeButtonState(inBasket: boolean) {
      if (inBasket) {
        this._button.textContent = 'Убрать из корзины'
      } else {
        this._button.textContent = 'Добавить в корзину';
      }
    }

    render(data: IProduct): HTMLElement {
      this.setImage(this._image, CDN_URL + data.image)
      this.removeClassListCategory(data)
      this.setText(this._category, data.category)
      this.setText(this._description, data.description)
      this._button.addEventListener('click', () => {
        this.events.emit('product:buy', data)
        this.events.emit('cardPreviw:render', data)
      });
      if (data.price === null) {
        this.setDisabled(this._button, true)
        this.setText(this._button, 'Товар не продается')
      }
      return super.render(data)
    }}

    // Класс карточки для корзины
  export class CardInBasket extends Card {
    constructor(container: HTMLElement, events: IEvents) {
      super(container, events)
      this._button = ensureElement<HTMLButtonElement>('.card__button', container)
      this._index = ensureElement('.basket__item-index', container)
    }

    setIndex(value:number) {
      this.setText(this._index, Number(value))
    }
  
    render(data: IProduct): HTMLElement {
      this._button.addEventListener('click', () => {
        this.events.emit('product:delete', data)
      });
      return super.render(data)
    }
    }