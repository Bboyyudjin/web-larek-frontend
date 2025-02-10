import { PaymentMethod, ValidationErrors } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { FormView } from "./form";

export class OrderFormView extends FormView {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;
  protected paymentMethod: PaymentMethod | '';

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    this.paymentMethod = '';
    this.inputAddress = ensureElement<HTMLInputElement>('input[name=address]', container);
    this.inputAddress.addEventListener('input', this.onInputChange);

    this.buttonCard = ensureElement<HTMLButtonElement>('button[name=card]', container);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name=cash]', container);

    this.buttonCard.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.setPaymentMethod('Card', this.buttonCard, this.buttonCash);
    });

    this.buttonCash.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.setPaymentMethod('Cash', this.buttonCash, this.buttonCard);
    });

    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`view:orderForm:submit`);
    });
  }

  private setPaymentMethod(method: PaymentMethod, activeButton: HTMLButtonElement, inactiveButton: HTMLButtonElement) {
    this.paymentMethod = method;
    this.switchButtons(activeButton, inactiveButton);
    this.onInputChange();
  }

  protected onInputChange = () => {
    this.events.emit(`view:orderForm:inputChange`, {
      payment: this.paymentMethod,
      address: this.inputAddress.value
    });
  }

  protected switchButtons(clickedButtonElement: HTMLButtonElement, buttonElem: HTMLButtonElement) {
    clickedButtonElement.classList.toggle('button_alt-active', true);
    buttonElem.classList.toggle('button_alt-active', false);
  }

  setValidationErrors(errors: ValidationErrors) {
    this.error.textContent = errors.payment || '';
    if (errors.address) {
      this.error.textContent += errors.address;
    }
  }

  reset(): void {
    super.reset();
    this.buttonCard.classList.remove('button_alt-active');
    this.buttonCash.classList.remove('button_alt-active');
  }
}