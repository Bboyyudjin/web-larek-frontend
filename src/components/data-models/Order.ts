import { IContactsForm, IPaymentForm, PaymentMethod } from "../../types";
import { IEvents } from "../base/events";

export class Order{
  private _orderData: IPaymentForm & IContactsForm;
  private _events: IEvents
  private _errors: object

  constructor(events: IEvents) {
      this._orderData = {
          payment: '',
          address: '',
          email: '',
          phone: '',
      };
      this._events = events
      this._errors = {}
  }

  set payment(payment: PaymentMethod) {
    this._orderData.payment = payment;
    this._events.emit('paymentForm:change')
  }

  set address(address: string) {
    this._orderData.address = address;
  }

  set email(email: string) {
    this._orderData.email = email;
  }

  set phone(phone: string) {
      this._orderData.phone = phone;
  }

  get orderInfo () {
    return this._orderData
  }

  validate(form: string) {
    if (form === 'payment') {
      this._errors = {
        payment: !this._orderData.payment ? 'Выберите способ оплаты.' : '',
        address: !this._orderData.address ? 'Введите адрес доставки.' : '',
    }} else if (form === 'contacts'){
      this._errors = {
      email: !this._orderData.email ? 'Укажите электронную почту.' : '',
      phone: !this._orderData.phone ? 'Укажите контактный номер телефона.' : '',
    }}

    if (Object.values(this._errors).some(error => error)) {
      this._events.emit('order:validationError', this._errors);
    } else {
      this._events.emit('order:validationError', {})
    }
  }

  get errors() {
    return this._errors
  }

  clear() {
    this._orderData = {
      payment: '',
      address: '',
      email: '',
      phone: '',
  };
  }
}