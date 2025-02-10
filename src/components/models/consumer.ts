import { IConsumerInfo, IConsumerModel, ConsumerContacts, PaymentInfo, ValidationErrors } from "../../types/index";
import { EventEmitter } from "../base/events";

export class ConsumerModel implements IConsumerModel {
  protected _consumerInfo: Partial<IConsumerInfo> = {};
  protected _errors: ValidationErrors = {};

  constructor(protected events: EventEmitter) {}

  get consumerInfo() {
    return this._consumerInfo;
  }

  get errors() {
    return this._errors;
  }

  addPaymentInfo(data: PaymentInfo) {
    this._consumerInfo = { ...data };
    this.validate();
  }

  addContacts(data: ConsumerContacts) {
    this._consumerInfo = { ...this._consumerInfo, ...data };
    this.validate();
  }

  protected validate() {
    this._errors = {
      payment: !this.consumerInfo.payment ? 'Необходимо указать способ оплаты.' : undefined,
      address: !this.consumerInfo.address ? 'Необходимо указать адрес доставки.' : undefined,
      email: !this.consumerInfo.email ? 'Необходимо указать электронную почту.' : undefined,
      phone: !this.consumerInfo.phone ? 'Необходимо указать контактный номер телефона.' : undefined,
    };
  }

  paymentInfoIsValid() {
    return !this.errors.address && !this.errors.payment;
  }

  contactsIsValid() {
    return !this.errors.email && !this.errors.phone;
  }

  clearAllInfo() {
    this._consumerInfo = {};
    this._errors = {};
  }
}