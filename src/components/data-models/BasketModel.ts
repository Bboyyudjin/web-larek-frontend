import { IOrder, IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel {
  private _basket: IProduct[] = [];
  private events: IEvents
  private _total: number

  constructor(events: IEvents) {
    this.events = events
    this._total = 0
  }

  get products() {
    return this._basket;
  }

  get productsToOrder(): Pick<IOrder, 'items' | 'total'> {
    return {items: this._basket.map(product => product.id), total: this._total};
  }

  toggleItem(product: IProduct): void {
    if (!this.isInBasket(product)) {
      this._basket.push(product);
      this._total += product.price
      this.events.emit('basket:change')
    } else {
      this._basket = this._basket.filter(item => item.id !== product.id);
      this._total -= product.price
      this.events.emit('basket:change')
    }
  }

  get total() {
    return this._total
  }

  isInBasket(product: IProduct): boolean {
    return this._basket.includes(product);
  }

  get itemsNumber() {
    return this._basket.length;
  }

  clearBasket() {
    this._basket = [];
    this._total = 0
    this.events.emit('basket:change')
  }
}