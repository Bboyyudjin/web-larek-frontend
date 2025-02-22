import { IProduct } from "../../types";

export class BasketModel {
  private _basket: IProduct[] = [];

  constructor() {}

  get products() {
    return this._basket;
  }

  getProductsId(): string[] {
    return this._basket.map(product => product.id);
  }

  toggleItem(product: IProduct): void {
    if (!this.isInBasket(product)) {
      this._basket.push(product);
    } else {
      this._basket = this._basket.filter(item => item.id !== product.id);
    }
  }

  isInBasket(product: IProduct): boolean {
    return this._basket.includes(product);
  }

  get itemsNumber() {
    return this._basket.length;
  }

  clearBasket() {
    this._basket = [];
  }
}