# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run bviewld
```

или

```
yarn bviewld
```

## Слой данных:
### Базовые типы и интерфейсы:
#### Интерфейс для товара
``` TypeScript
export interface IProduct {
  id:string;
  title: string;
  description: string;
  image: string;
  category: CategoryOfProduct;
  price: number|null;
}
```
#### Тип для категорий товаров
``` TypeScript
export type CategoryOfProduct = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';
```
#### Интерфейс корзины
``` TypeScript
  export interface IBasketModel {
    basket: Map<string, number>;
    basketPrice: number | null;
    itemsNumber: number;
    addItem(data: IProduct): void;
    removeItem(id: string): void;
    clearBasket(): void;
    isInBasket(id: string): boolean;
  }
```
#### Интерфейс для информации из форм о пользователе
``` TypeScript
export interface IConsumerInfo {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
}
```
#### Типы для переиспользования информации о пользователе для форм
``` TypeScript
export type ConsumerContacts = Pick<IConsumerInfo, 'phone' | 'address'>
export type PaymentInfo = Pick<IConsumerInfo, 'payment' | 'email'>
```
#### Тип для определения способа оплаты
``` TypeScript
export type PaymentMethod = 'Card' | 'Cash';
```
#### Интерфейс для информации пользователя о заказе
``` TypeScript
export interface IOrderModel {
  consumerInfo: Partial<IConsumerInfo>;
  addPaymentInfo(data: PaymentInfo): void;
  addContacts(data: ConsumerContacts): void;
  paymentInfoIsValid(): boolean;
  contactsIsValid(): boolean;
  clearAllInfo(): void
}
```
#### Интерфейс для заказа
``` TypeScript
export interface IOrder extends Partial<IConsumerInfo>{
  total: number;
  items: string[];
}
```
#### Интерфейс для результата заказа
``` TypeScript
export interface IOrderResult {
  id: string;
  total: number;
}
```
#### Тип для ошибок валидации
``` TypeScript
export type ValidationErrors = Partial<Record<keyof IConsumerInfo, string>>;
```
## Базовый код
В архитектуре приложения используется паттерн MVP, без выделения в отдельный класс презентера.

## Слои:
1. Модели данных (отвечает за хранение и изменение данных)
2. Отображение данных (отвечает за вывод данных на страницу)
3. Презентер (отвечает за соединение моделей с отображениями)

## 1. Слой моделей данных

### Класс BasketModel
Класс служит для создания объекта корзины. Он хранит в себе массив товаров, находящихся в корзине. Конструктор класса принимает инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_basket: Map<string, number>` - массив, хранящий информацию об уникальных товарах в корзине
- `_basketPrice: number` - приватное свойство, хранящее информацию о стоимости товаров в корзине
- `_itemsNumber: number` - приватное свойство, хранящее информацию о количестве товаров в корзине
- `get basket()` - геттер для получения информации о содержащемся в корзине
- `get basketPrice(): number` - геттер для получения информации о стоимости товаров в корзине
- `get itemsNumber()` - геттер для получения информации о количестве товаров в корзине
- `addItem(data: Pick<IProduct, 'id' | 'price'>): void` - метод для добавления товара в корзину
- `removeItem(id: string): void` - метод для удаления товара из корзины
- `clearBasket(): void` - метод для очистки корзины
- `isInBasket(id: string): boolean` - метод проверки нахождения товара в корзине

### Класс ConsumerModel
Класс для создания объекта с информацией пользователя о заказе. Конструктор класса принимает инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_consumerInfo: Partial<IConsumerInfo>` - объект, хранящий информацию о текущем заказе
- `_errors: ValidationErrors` - свойство, содержащее информацию об ошибках
- `get consumerInfo()` - геттер для получения объекта, хранящего информацию о текущем заказе
- `get errors()` - геттер для получения информации об ошибках
- `addPaymentInfo(data: PaymentInfo)` - метод для добавления способа оплаты и почты для заказа
- `addContacts(data: ConsumerContacts)` - метод для добавления номера и адреса пользователя
- `protected validate()` - метод для проверки валидности введенных данных пользователем
- `paymentInfoIsValid()` - метод для проверки валидности информации об оплате
- `contactsIsValid()` - метод для проверки валидности контактов
- `clearAllInfo()` - метод для очистки всей информации в модели

### Класс ProductsModel
Класс хранит информацию о товарах, полученных с сервера. Конструктор класса принимает инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_productList: IProduct[]` - массив, который хранит в себе данные сервера о товарах
- `set productList(data: IProduct[])` - сеттер для записи массива товаров
- `get productList()` - геттер для получения массива товаров
- `getProduct(id: string): IProduct` - метод для получения объекта товара по id

## 2. Слой отображения данных

### Класс Basket
Класс отвечает за отрисовку корзины и её содержимого.

#### Поля и методы класса:

- `basketButton: HTMLButtonElement` - кнопка оформления заказа
- `basketPrice: HTMLSpanElement` - стоимость товаров в корзине
- `basketContainer: HTMLElement` - контейнер, содержащий в себе список товаров 
- `setBasketItems(items: HTMLElement[])` - метод, позволяющий изменять список товаров
- `setTotalPrice(price: number)` - метод, позволяющий изменять стоимость корзины
- `disableOrderButton(status: boolean)` - метод, позволяющий переключать состояние кнопки

### Класс BasketButtonView
Класс отвечает за отрисовку кнопки корзины на главной странице.

#### Поля и методы класса:

- `counter: HTMLSpanElement` - счётчик товаров
- `setCounter(number: number)` - метод, позволяющий изменить количество товаров в корзине

### Класс CardView
Класс отвечает за отрисовку модального окна карточки при нажатии на товар на главной странице.

#### Поля и методы класса:

- `_id: string` - приватное свойство, хранящее id товара
- `description:  HTMLParagraphElement | null` - свойство, хранящее элемент описания товара
- `image: HTMLImageElement | null` - свойство, хранящее изображение товара
- `title: HTMLHeadingElement` - свойство, хранящее элемент с названием товара
- `category: HTMLSpanElement | null` - свойство, хранящее элемент категории товара
- `price: HTMLSpanElement` - свойство, хранящее элемент со стоимостью товара
- `cardButton: HTMLButtonElement | null` - свойство, хранящее кнопку добавления товара
- `indexInBasket: HTMLSpanElement | null` - свойство, хранящее элемент номера списка в корзине
- `get id()` - геттер, позволяющий получить id карточки
- `setForBasket(cardData: IProduct)` - метод, который принимает данные карточки и отрисовывает ее изображение для корзины товаров
- `setIndex(index: number)` - метод, позволяющий установить порядковый номер в корзине
- `setForModal(cardData: IProduct)` - метод, который принимает данные карточки и отрисовывает ее изображение для окна просмотра товара
- `setForCatalog(cardData: IProduct)` - метод, который принимает данные карточки и отрисовывает ее изображение для магазина на главной странице
- `setImage(src: string, title: string)` - метод, позволяющий установить изображение товара
- `setPrice(cardData: IProduct)` - метод, позволяющий установить цену товара
- `setCategory(category: CategoryOfProduct)` - метод, позволяющий установить категорию товара
- `changeButtonState(inBasket: boolean)` - метод, позволяющий изменять состояние кнопки покупки

### Класс ModalView
Класс для отображения модальных окон в проекте.

#### Поля и методы класса:

- `modal: HTMLElement` - свойство, хранящее в себе элемент модального окна
- `closeButton: HTMLButtonElement` - свойство, хранящее в себе элемент кнопки закрытия модального окна
- `container: HTMLElement` - свойство, хранящее в себе элемент для установки в него контента
- `setContent(content: HTMLElement)` - метод, позволяющий установить содержимое модального окна

### Класс FormView
Является абстрактным классом, который наследуется всеми формами.

#### Поля и методы класса:

- `protected error: HTMLElement` - свойство, которое хранит в себе элемент ошибки ввода
- `protected submitButton: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки отправки формы
- `disableOrderButton(status: boolean)` - метод, позволяющий изменять состояние кнопки
- `reset()` - метод очистки формы

### Класс OrderFormView
Класс отвечает за отрисовку модального окна с выбором способа оплаты и вводом адреса доставки.

#### Поля и методы класса:

- `buttonCard: HTMLButtonElement` - свойство, хранящее в себе элемент кнопки способа оплаты "Онлайн"
- `buttonCash: HTMLButtonElement` - свойство, хранящее в себе элемент кнопки способа оплаты "При получении"
- `inputAddress: HTMLInputElement` - свойство, хранящее в себе элемент формы ввода адреса
- `paymentMethod: PaymentMethod` - свойство, хранящее в себе информацию о выбранном способе оплаты
- `setPaymentMethod(method: PaymentMethod, activeButton: HTMLButtonElement, inactiveButton: HTMLButtonElement)` - метод, позволяющий установить способ оплаты
- `switchButtons(clickedButtonElement: HTMLButtonElement, buttonElem: HTMLButtonElement)` - метод переключения активной кнопки оплаты
- `setValidationErrors(errors: ValidationErrors)` - метод для установки ошибок валидации
- `reset() - метод очистки формы

### Класс ContactsFormView
Класс отвечает за отрисовку модального окна с вводом телефона и email.

#### Поля и методы класса:

- `emailInput: HTMLInputElement` - свойство, хранящее в себе поле ввода email
- `phoneInput: HTMLInputElement` - свойство, хранящее в себе поле ввода телефона
- `onInputChange(data: ConsumerContacts)` - метод для обработки изменений ввода
- `setValidationErrors(errors: ValidationErrors)` - метод для установки ошибок валидации

### Класс SucceesView
Класс отвечает за отрисовку модального окна с информацией об успешной оплате заказа.

#### Поля и методы класса:

- `totalPrice: HTMLElement` - свойство, хранящее в себе элемент стоимости 
- `orderSuccessbutton: HTMLButtonElement` - свойство, хранящее в себе элемент кнопки "Вперед за новыми покупками"
- `setTotalPrice(price: number)` - метод, позволяющий изменить итоговую стоимость заказа

## 3. Слой презентора
Код, отвечающий за взаимодействие слоев отображения и данных, описан в файле index.ts. 
Взаимодействие между слоями осуществляется через события, инициируемые EventEmitter и соответствующие обработчики, что позволяет эффективно управлять обменом данными между представлением и слоем данных.
Далее приведены списки событий, которые генерируют модели данных самостоятельно и которые генерирует пользователь:

### События, генерируемые моделями данных:
- `model:products:change` - изменение списка товаров на странице.
- `model:basket:change` - изменение списка товаров в корзине.

### События, генерируемые пользователем:
- `view:basketButton:click` - событие, срабатывающее при нажатии пользователем на кнопку корзины. Открывает корзину с товарами.
- `view:card:pick` - событие, срабатывающее при нажатии пользователем на одну из карточек на главной странице. Открывает окно просмотра товара.
- `view:card:buy` - событие, срабатывающее при добвления товара в корзину пользователем.
- `view:basket:remove` - событие, срабатывающее при нажатии на кнопку удаления товара из корзины и при нажатии удаления товара из окна карточки товара.
- `view:basket:order` - событие, срабатывающее при нажатии пользователем на кнопку "Оформить" в корзине.
- `view:contactsForm:submit` - событие, срабатывающее при нажатии пользователем на кнопку "Оплатить" в окне формы контактов.
- `view:contactsForm:inputChange` - событие, срабатывающее при заполнении пользователем полей ввода формы контактов.
- `view:orderForm:submit` - событие, срабатывающее при нажатии пользователем на кнопку "Далее" в форме информации об оплате.
- `view:orderForm:inputChange` - событие, срабатывающее при заполнении пользователем полей ввода формы в форме информации об оплате.
- `view:success:close` - событие, срабатывающее при нажатии пользователем на кнопку "Вперед за новыми покупками" в окне успешной оплаты.