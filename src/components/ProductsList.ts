import { IProduct } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class ProductsList extends Component<IProduct> {
  private _products: IProduct[] = []
  events: IEvents

  constructor (container: HTMLElement, events: IEvents) {
    super(container, events)
  }

  set products(data: IProduct[]) {
    this._products = data
    this.events.emit('productsList:changed', this._products)
  }

  getProduct(id: string): void {
  this._products.forEach(item => {
    if (item.id === id)
      return item
    })
  }

  get products(): IProduct[] {
    return this._products
   }
}