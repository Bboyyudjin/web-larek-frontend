import { IFormState, IPaymentForm, PaymentMethod } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class PaymentForm extends Form<IPaymentForm&IFormState> {
    protected _payment: string
    protected _address: string
    private _buttonCash: HTMLButtonElement
    private _buttonCard: HTMLButtonElement


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonCard = this.container.querySelector('[name="card"]');
        this._buttonCash = this.container.querySelector('[name="cash"]');

        this._buttonCard.addEventListener('click', () => this.changePaymentMethod(this._buttonCard));
        this._buttonCash.addEventListener('click', () => this.changePaymentMethod(this._buttonCash));
        this._payment = ''
        this.container.addEventListener('input', () => this.validateForm());
    }

    private changePaymentMethod(selectedButton: HTMLButtonElement) {
        if (selectedButton === this._buttonCard) {
          this._buttonCash.classList.remove('button_alt-active');
        } else {
          this._buttonCard.classList.remove('button_alt-active');
        }
        selectedButton.classList.add('button_alt-active');
        this._payment = selectedButton.name;
        this.validateForm()
    }

    private handleSubmit() {
        const addressInput = this.container.querySelector<HTMLInputElement>('input[name="address"]');
        return this._address = addressInput?.value;
    }

    private validateForm() {
        const addressInput = this.container.querySelector<HTMLInputElement>('input[name="address"]');
        const addressValue = addressInput?.value;


        let isValid = true;

        if (!addressValue) {
            this.errors = 'Введите адрес доставки';
            isValid = false;
        } else if (this.payment === '') {
            this.errors = 'Выберите способ оплаты';
            isValid = false;
        } else {
            this.errors = '';
        }

        this.valid = isValid;
    }

    get address() {
      this.handleSubmit()
      return this._address
    }

    get payment() {
        return this._payment
      }

    clear(): void {
        this.container.reset()
        this._buttonCard.classList.remove('button_alt-active');
        this._buttonCash.classList.remove('button_alt-active');
    }
}