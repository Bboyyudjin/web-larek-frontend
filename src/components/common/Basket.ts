import { IBasketModel, IProduct } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Basket extends Component<IBasketModel> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;
  protected _basket: IProduct[];
  private _totalValue: number

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container, events);
    
    this._basket = []
    this._totalValue = 0
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if (this._button) {
        this._button.addEventListener('click', () => {
            events.emit('payment:open');
        });
    }

    this.items = [];
}

set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
        this.setDisabled(this._button, false)
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
        }));
        this.setDisabled(this._button, true)
    }
}

  get products() {
    return this._basket
  }

  getProductsId(): string[] {
    return this._basket.map(product => product.id);
}

  toggleItem(product: IProduct): void {
    if (!this.isInBasket(product)) {
      this._basket.push(product);
      this.events.emit('basket:change')
    } else if (this.isInBasket(product)) {
        this._basket = this._basket.filter(item => item.id !== product.id);
        this.events.emit('basket:change');
    } else {
        throw new Error(`Невозможно найти ${product.id}`);
      }
}

  isInBasket(product: IProduct): boolean {
    return this._basket.includes(product)
  }

  get itemsNumber() {
    return this._basket.length;
  }

  set total(value: number) {
    this._totalValue = value
    this.setText(this._total, value + ' синапсов');
  }
  
  get total() {
    return this._totalValue
  }

  clear() {
    this._basket = []
    this.events.emit('basket:change')
  }
}