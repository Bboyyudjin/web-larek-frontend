import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class ProductsModel {
  private _products: IProduct[] = []
  private _events: IEvents

  constructor(events: IEvents) {
    this._events = events
  }
  
  set products(data: IProduct[]) {
    this._products = data
    this._events.emit('productsList:changed')
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find(item => item.id === id);
  }

  get products(): IProduct[] {
    return this._products;
  }
}