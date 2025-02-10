import { IBasketModel, IProduct } from "../../types";
import { EventEmitter } from "../base/events";

export class BasketModel implements IBasketModel {
  protected _basket: Map<string, number>;
  protected _basketPrice: number;
  protected _itemsNumber: number;

  constructor(protected events: EventEmitter) {
    this._basket = new Map<string, number>();
    this._basketPrice = 0;
    this._itemsNumber = 0;
  }

  get basket() {
    return this._basket;
  }

  get basketPrice(): number {
    this._basketPrice = Array.from(this._basket.values()).reduce((sum, price) => sum + price, 0);
    return this._basketPrice;
  }

  get itemsNumber() {
    return this._basket.size;
  }

  addItem(data: Pick<IProduct, 'id' | 'price'>): void {
    const { id, price } = data;
    if (!this.isInBasket(id)) {
      this._basket.set(id, price);
      this.events.emit('model:basket:change');
    }
  }

  removeItem(id: string): void {
    if (this.isInBasket(id)) {
      this._basket.delete(id);
      this.events.emit('model:basket:change');
    } else {
      throw new Error(`Невозможно убрать ${id} из корзины`);
    }
  }

  clearBasket(): void {
    this._basket.clear();
    this.events.emit('model:basket:change');
  }

  isInBasket(id: string): boolean {
    return this._basket.has(id);
  }
}