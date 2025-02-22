import { IFormState, IPaymentForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class ContactsForm extends Form<IPaymentForm&IFormState> {
    protected _email: string;
    protected _phone: string;
    protected _button: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._email = ''
        this._phone = ''
        this._button = this.container.querySelector('.button')

        this.container.addEventListener('input', () => this.validateForm());
        this._button.addEventListener('click', (e) => {
            this.handleSubmit(e)
            events.emit(`contacts:submit`);
          });
        
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        const emailInput = this.container.querySelector<HTMLInputElement>('input[name="email"]');
        const phoneInput = this.container.querySelector<HTMLInputElement>('input[name="phone"]');

        this._email = emailInput?.value || '';
        this._phone = phoneInput?.value || '';
    }

    private validateForm() {
        const emailInput = this.container.querySelector<HTMLInputElement>('input[name="email"]');
        const phoneInput = this.container.querySelector<HTMLInputElement>('input[name="phone"]');
        const emailValue = emailInput?.value;
        const phoneValue = phoneInput?.value;

        let isValid = true;

        if (!emailValue) {
            this.errors = 'Укажите электронную почту.';
            isValid = false;
        } else if (!phoneValue) {
            this.errors = 'Укажите контактный номер телефона.';
            isValid = false;
        } else {
            this.errors = '';
        }

        this.valid = isValid;
    }

    get email() {
      return this._email
    }

    get phone() {
      return this._phone
    }

    clear(): void {
        this.container.reset();
        this.errors = '';
    }
}