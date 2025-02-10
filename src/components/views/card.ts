import { IProduct, CategoryOfProduct } from "../../types";
import { CDN_URL, productCategoryObject } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

export class CardView extends Component {
  protected _id: string;
  protected description:  HTMLParagraphElement | null;
  protected image: HTMLImageElement | null;
  protected title: HTMLHeadingElement;
  protected category: HTMLSpanElement | null;
  protected price: HTMLSpanElement;
  protected cardButton: HTMLButtonElement | null;
  protected indexInBasket: HTMLSpanElement | null;

  constructor(container: HTMLElement, events: EventEmitter){
    super(container, events);
    this.title = ensureElement<HTMLHeadingElement>('.card__title', container);
    this.price = ensureElement<HTMLSpanElement>('.card__price', container);
    this.description = null;
    this.image = null;
    this.category = null;
    this.cardButton = null;
    this.indexInBasket = null;
  }

  get id() {
    return this._id;
  }

  setForBasket(cardData: IProduct){
    this.indexInBasket = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardButton.addEventListener('click', () => {
      this.events.emit('view:basket:remove', {id: this.id});
    });
    this.setPrice(cardData);
  }

  setIndex(index: number){
    this.indexInBasket.textContent = String(index);
  }

  setForCatalog(cardData: IProduct){
    this.setCategory(cardData.category);
    
    this.setImage(cardData.image, cardData.title);

    this.setPrice(cardData);

    this.container.addEventListener('click', () => {
      this.events.emit(`view:card:pick`, {id: this.id});
    })
  }

  setForModal(cardData: IProduct){
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.setImage(cardData.image, cardData.title);

    this.setCategory(cardData.category);

    this.description = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.description.textContent = cardData.description;

    this.setPrice(cardData);
  }

  protected setImage(src: string, title: string){
    this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.image.src = CDN_URL + src;
    
    this.image.alt = title;
  }

  protected setPrice(cardData: IProduct){
    this._id = cardData.id;
    this.title.textContent = cardData.title;
    const itemPrice = cardData.price === null? 'Бесценно': cardData.price + ' синапсов';
    this.price.textContent = itemPrice;
  }
  
  protected setCategory(category: CategoryOfProduct){
    this.category = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.category.textContent = category;
    this.category.classList.add('card__category_' + productCategoryObject[category]);
  }

  protected emitAddEvent = () => {
    this.events.emit('view:card:buy', {id: this.id});
  }

  protected emitRemoveEvent = () => {
    this.events.emit('view:basket:remove', {id: this.id});
  }
    
  changeButtonState(inBasket: boolean){
    if (this.price.textContent === 'Бесценно') {
      this.cardButton.disabled = true;
      this.cardButton.textContent = 'Товар не продается'      
      return;
    }

    if (inBasket) {
      this.cardButton.removeEventListener('click', this.emitAddEvent)
      this.cardButton.disabled = false;
      this.cardButton.textContent = 'Убрать из корзины'
      this.cardButton.addEventListener('click', this.emitRemoveEvent);
    } else {
      this.cardButton.removeEventListener('click', this.emitRemoveEvent)
      this.cardButton.disabled = false;
      this.cardButton.textContent = 'Добавить в корзину';
      this.cardButton.addEventListener('click', this.emitAddEvent)
    }
      
  }
}