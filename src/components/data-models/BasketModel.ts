import { IOrder, IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel {
  private _basket: IProduct[] = [];
  private _events: IEvents

  constructor(events: IEvents) {
    this._events = events
  }

  get products() {
    return this._basket;
  }

  get productsToOrder(): Pick<IOrder, 'items' | 'total'> {
    return {items: this._basket.map(product => product.id), total: this.getTotal()};
  }

  toggleItem(product: IProduct): void {
    if (!this.isInBasket(product)) {
      this._basket.push(product);
      this._events.emit('basket:change')
    } else {
      this._basket = this._basket.filter(item => item.id !== product.id);
      this._events.emit('basket:change')
    }
  }

  getTotal(): number {
    return this._basket.reduce((total, item) => total + item.price, 0);
  }

  isInBasket(product: IProduct): boolean {
    return this._basket.includes(product);
  }

  get itemsNumber() {
    return this._basket.length;
  }

  clearBasket() {
    this._basket = [];
    this._events.emit('basket:change')
  }
}