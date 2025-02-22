import { ISuccessOrder } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class SuccessWindow extends Component<ISuccessOrder> {
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this._total = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._button.addEventListener('click', () => {
      events.emit(`success:close`);
    });
  }

  setTotalPrice(price: number) {
    this._total.textContent = `Списано ${price} синапсов`
  }
}