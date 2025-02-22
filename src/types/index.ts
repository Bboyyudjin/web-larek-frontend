//Интерфейс товара
export interface IProduct {
  id: string
  title: string
  description: string
  image: string
  category: CategoryOfProduct
  price: number|null
}

//Тип для категорий товаров
export type CategoryOfProduct = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';

//Интерфейс корзины
export interface IBasketModel {
  basket: IProduct[];
  basketPrice: number | null;
  itemsNumber: number;
  removeItem(id: string): void;
  clearBasket(): void;
  isInBasket(id: string): boolean;
}

// Интерфейс форм
export interface IFormState {
    valid: boolean;
    errors: string[];
}

//Интерфейс формы контактов
export interface IContactsForm {
  email: string
  phone: string
}

//Интерфейс формы способа оплаты
export interface IPaymentForm {
  payment: PaymentMethod
  address: string
}

//Тип для способов оплаты
export type PaymentMethod = 'Cash' | 'Card';

//Интерфейс страницы
export interface IPage {
  counter: number
  catalog: HTMLElement[]
  locked: boolean
}

// Интерфейс заказа
export interface IOrder extends IPaymentForm, IContactsForm{
  items: string[]
  total: number
}

// Интерфейс успешного заказа
export interface ISuccessOrder {
  id: string
  total: number
}

// Тип для ошибок форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс для листа продуктов
export interface IProductsList {
  setProducts(data:IProduct[]): void
  getProduct(id: string): void
}