import { IFormState, IPaymentForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class ContactsForm extends Form<IPaymentForm&IFormState> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _button: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents) {

        super(container, events);
        
        this._button = this.container.querySelector('.button')
        this._email = this.container.querySelector<HTMLInputElement>('input[name="email"]');
        this._phone = this.container.querySelector<HTMLInputElement>('input[name="phone"]');
        
        this._email.addEventListener('input', () => {
            events.emit(`contacts:validation`, { input: this._email, name: 'email' });
        });

        this._phone.addEventListener('input', () => {
            events.emit(`contacts:validation`, { input: this._phone, name: 'phone' });
        });
        
        this._button.addEventListener('click', (e) => {
            e.preventDefault()
            events.emit(`contacts:submit`);
          });

    }

    clear(): void { 
        this.container.reset();
        this.clearErrors();
    } 
}