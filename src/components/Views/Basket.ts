import { IBasketModel, IProduct } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class BasketView extends Component<IBasketModel> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;
  private _totalValue: number = 0;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

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
      this.setDisabled(this._button, false);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
      this.setDisabled(this._button, true);
    }
  }

  set total(value: number) {
    this._totalValue = value;
    this.setText(this._total, value + ' синапсов');
  }

  get total() {
    return this._totalValue;
  }

  updateView() {
    this.events.emit('basket:change')
  }
}