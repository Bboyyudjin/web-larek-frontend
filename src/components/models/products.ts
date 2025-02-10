import { IProduct } from "../../types";
import { EventEmitter } from "../base/events";

export class ProductsModel {
  protected _productList: IProduct[];

  constructor(protected events: EventEmitter) {};

  set productList(data: IProduct[]) {
    this._productList = data;
    this.events.emit('model:products:change');
  }

  get productList() {
    return this._productList;
  } 

  getProduct(id: string): IProduct {
    const product = this._productList.find(item => item.id === id);
    if (product) {
      return product;
    }
    throw new Error(`Товар ${id} не найден`);
  }
}