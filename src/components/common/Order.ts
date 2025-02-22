import { IOrder } from "../../types";

export class Order {
  private _orderData: IOrder;

  constructor() {
      this._orderData = {
          payment: 'Card',
          address: '',
          email: '',
          phone: '',
          items: [],
          total: 0,
      };
  }

  // Метод для обновления информации о заказе
  updateOrder(data: Partial<IOrder>): void {
      this._orderData = { ...this._orderData, ...data };
  }

  // Метод для получения информации о заказе
  get orderData(): IOrder {
      return this._orderData;
  }
}