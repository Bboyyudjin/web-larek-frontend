//Интерфейс для товара
export interface IProduct {
  id:string;
  title: string;
  description: string;
  image: string;
  category: CategoryOfProduct;
  price: number|null;
}

//Тип для категорий товаров
export type CategoryOfProduct = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';

//Интерфейс корзины
export interface IBasketModel {
  basket: Map<string, number>;
  basketPrice: number | null;
  itemsNumber: number;
  addItem(data: IProduct): void;
  removeItem(id: string): void;
  clearBasket(): void;
  isInBasket(id: string): boolean;
}

//Интерфейс для информации из формы о пользователе
export interface IConsumerInfo {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}

//Типы для переиспользования информации из формы о пользователе
export type ConsumerContacts = Pick<IConsumerInfo, 'phone' | 'email'>
export type PaymentInfo = Pick<IConsumerInfo, 'payment' | 'address'>

//Тип для определения способа оплаты
export type PaymentMethod = 'Card' | 'Cash';

//Интерфейс для 
export interface IConsumerModel {
  consumerInfo: Partial<IConsumerInfo>;
  addPaymentInfo(data: PaymentInfo): void;
  addContacts(data: ConsumerContacts): void;
  paymentInfoIsValid(): boolean;
  contactsIsValid(): boolean;
  clearAllInfo(): void
}

//Интерфейс для заказа
export interface IOrder extends Partial<IConsumerInfo>{
  total: number;
  items: string[];
}

//Интерфейс для результата заказа
export interface IOrderResult {
  id: string;
  total: number;
}

//Тип для ошибок валидации
export type ValidationErrors = Partial<Record<keyof IConsumerInfo, string>>;