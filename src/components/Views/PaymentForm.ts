import { IFormState, IPaymentForm, PaymentMethod } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class PaymentForm extends Form<IPaymentForm&IFormState> {
    protected _address: HTMLInputElement
    private _buttonCash: HTMLButtonElement
    private _buttonCard: HTMLButtonElement


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonCard = this.container.querySelector('[name="card"]');
        this._buttonCash = this.container.querySelector('[name="cash"]');
        this._address = this.container.querySelector('input[name=address]');

        this._buttonCard.addEventListener('click', () => events.emit(`paymentMetod:change`, this._buttonCard));
        this._buttonCash.addEventListener('click', () => events.emit(`paymentMetod:change`, this._buttonCash));
        this._address.addEventListener('input', () => {
            events.emit(`payment:validation`, this._address);
        });
    }

    changePaymentMethod(name: string) {
        if (name.toLowerCase() !== this._buttonCard.name.toLowerCase()) {
          this._buttonCard.classList.remove('button_alt-active');
          this._buttonCash.classList.add('button_alt-active');
        } else {
          this._buttonCash.classList.remove('button_alt-active');
          this._buttonCard.classList.add('button_alt-active');
        }
    }


    clear(): void { 
        this.container.reset() 
        this._buttonCard.classList.remove('button_alt-active'); 
        this._buttonCash.classList.remove('button_alt-active');
        this.clearErrors()
    } 
}