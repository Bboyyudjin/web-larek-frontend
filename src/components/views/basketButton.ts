import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

export class BasketButtonView {
  protected counter: HTMLSpanElement;

  constructor(container: HTMLButtonElement, protected events: EventEmitter){
    this.counter = ensureElement('.header__basket-counter', container);
    container.addEventListener('click', () => {
      events.emit(`view:basketButton:click`);
    });
  }

  setCounter(number: number){
    this.counter.textContent = String(number);
  }

}