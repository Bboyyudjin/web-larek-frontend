import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Component } from "../base/component";

export class BasketView extends Component{
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLSpanElement;
  protected basketContainer: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    
    super(container, events);

    // Инициализация кнопки корзины
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.basketButton.disabled = true;
    this.basketButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`view:basket:order`);
    });

    // Инициализация элементов интерфейса
    this.basketPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
    this.basketContainer = ensureElement<HTMLElement>('.basket__list', container);
  }

  setBasketItems(items: HTMLElement[]) {
    this.basketContainer.replaceChildren(...items);
  }

  setTotalPrice(price: number) {
    this.basketPrice.textContent = `${price} синапсов`;
  }

  disableOrderButton(status: boolean) {    
    this.basketButton.disabled = !status;
  }
}