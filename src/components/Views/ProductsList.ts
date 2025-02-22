import { IProduct } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export class ProductsView extends Component<IProduct> {

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
  }

  updateView() {
    this.events.emit('productsList:changed');
  }
}