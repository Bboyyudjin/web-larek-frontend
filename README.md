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
interface IProduct {
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
type CategoryOfProduct = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';
```
#### Интерфейс корзины
``` TypeScript
interface IBasketModel {
  basket: IProduct[];
  basketPrice: number | null;
  itemsNumber: number;
  removeItem(id: string): void;
  clearBasket(): void;
  isInBasket(id: string): boolean;
}
```
#### Интерфейс форм
``` TypeScript
interface IFormState {
  valid: boolean;
  errors: string[];
}
```
#### Интерфейс формы контактов
``` TypeScript
interface IContactsForm {
  email: string
  phone: string
}
```
#### Интерфейс формы способа оплаты
``` TypeScript
interface IPaymentForm {
  payment: PaymentMethod
  address: string
}
```
#### Тип для определения способа оплаты
``` TypeScript
type PaymentMethod = 'Card' | 'Cash';
```
#### Интерфейс страницы
``` TypeScript
interface IPage {
  counter: number
  catalog: HTMLElement[]
  locked: boolean
}
```
#### Интерфейс заказа
``` TypeScript
interface IOrder extends IPaymentForm, IContactsForm{
  items: string[]
  total: number
}
```
#### Интерфейс успешного заказа
``` TypeScript
interface ISuccessOrder {
  id: string
  total: number
}
```
#### Тип для ошибок валидации
``` TypeScript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
#### Интерфейс для листа товаров
``` TypeScript
interface IProductsList {
  setProducts(data:IProduct[]): void
  getProduct(id: string): void
}
```
## Базовый код
В архитектуре приложения используется паттерн MVP, без выделения в отдельный класс презентера.

## Слои:
1. Модели данных (отвечает за хранение и изменение данных)
2. Отображение данных (отвечает за вывод данных на страницу)
3. Презентер (отвечает за соединение моделей с отображениями)

## 1. Слой моделей данных

### Класс Order
Класс служит для создания объекта заказа пользователя. Он хранит в себе массив товаров, которые добавил в корзину пользователь и прочую контактную информацию. Конструктор класса создаёт заготовку для дальнейшего заполнения без входных параметров.

#### Поля и методы класса:

- `_orderData: IOrder` - свойство, хранящее в себе информацию о текущем заказе
- `get orderData(): IOrder` - метод, позволяющий получить информацию о заказе
- `updateOrder(data: Partial<IOrder>): void` - метод для обновления информации о заказе

### Класс ProductsModel
Класс хранит информацию о товарах, полученных с сервера.

#### Поля и методы класса:

- `_products: IProduct[]` - свойство, хранящее текущий список товаров
- `set products(data: IProduct[])` - сеттер для записи нового списка товаров
- `getProduct(id: string): void` - метод для получения информации о товаре по его id.
- `get products(): IProduct[]` - геттер для получения списка товаров

### Класс ProductsAPI
Класс для отправки запросов на сервер. Конструктор принимает базовую ссылку для связи с сервером.

#### Поля и методы класса:

- `_productList: IProduct[]` - массив, который хранит в себе данные сервера о товарах
- `set productList(data: IProduct[])` - сеттер для записи массива товаров
- `get productList()` - геттер для получения массива товаров
- `getProduct(id: string): IProduct` - метод для получения объекта товара по id

### Класс BasketModel
Класс хранит информацию о товарах, которые пользователь добавил в корзину.

#### Поля и методы класса:

- `_basket: IProduct[]` - свойство, хранящее текущий список товаров в корзине
- `get products()` - геттер для получения списка товаров в корзине
- `getProductsId(): string[]` - метод для получения массива id товаров в корзине
- `toggleItem(product: IProduct): void` - метод для добавления/удаления товаров в корзине
- `isInBasket(product: IProduct): boolean` - метод для проверки наличия товара в корзине
- `get itemsNumber()` - геттер, позволяющий получить общее количество товаров в корзине
- `clearBasket()` - метод очистки корзины

## 2. Слой отображения данных

### Класс BasketView
Класс отвечает за отрисовку корзины и её содержимого. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_list: HTMLElement` - свойство, хранящее разметку товаров
- `_total: HTMLElement` - свойство, хранящее элемент с суммой товаров в корзине
- `_button: HTMLElement` - свойство, хранящее кнопку оформления заказа
- `_totalValue: number` - свойство, хранящее сумму товаров в корзине
- `set items(items: HTMLElement[])` - сеттер для обновления разметки в _list
- `set total(value: number)` - сеттер для обновления итоговой стоимости в корзине
- `get total()` - геттер для получения стоимости корзины
- `updateView()` - метод для обновления отображения

### Класс Card
Родительский класс для всех производных классов, связанных с отображением карточек на сайте. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_title: HTMLHeadElement` - свойство, хранящее заголовок товара
- `_description?: HTMLParagraphElement` - свойство, хранящее описание товара
- `_price: HTMLSpanElement` - свойство, хранящее цену товара
- `_image?: HTMLImageElement` - свойство, хранящее ссылку на изображение товара
- `_category?: HTMLSpanElement` - свойство, хранящее категорию товара
- `_button?: HTMLButtonElement` - свойство, хранящее кнопку товара
- `_index?: HTMLSpanElement` - свойство, хранящее индекс товара в корзине
- `removeClassListCategory(data: IProduct)` - метод для установки класса в разметке для категории товара
- `render(data: IProduct): HTMLElement` - метод для отрисовки карточки

### Класс CardInCatalog
Класс отвечает за отрисовку карточки продука на главной странице. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `render(data: IProduct): HTMLElement` - метод для отрисовки карточки

### Класс CardPreviw
Класс отвечает за отрисовку превью карточки товара. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `changeButtonState(inBasket: boolean)` - метод для определения состояния кнопки добавления/удаления товара
- `render(data: IProduct): HTMLElement` - метод для отрисовки карточки

### Класс ProductsView
Класс отвечает за отрисовку списка товаров. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `updateView()` - метод для обновления отображения списка товаров

### Класс CardInBasket
Класс отвечает за отрисовку товара в корзине. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `setIndex(value:number)` - метод для установки порядкового номера товара в корзине
- `render(data: IProduct): HTMLElement` - метод для отрисовки карточки

### Класс Page
Класс для отображения главной страницы сайта. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_counter: HTMLElement` - свойство, хранящее в себе элемент счётчика корзины
- `_catalog: HTMLElement` - свойство, хранящее в себе элемент для установки списка продуктов 
- `_wrapper: HTMLElement` - свойство, хранящее в себе элемент прокрутки страницы
- `_basketButton: HTMLElement` - свойство, хранящее в себе кнопку корзины
- `set counter(value: number)` - сеттер для установки счётчика корзины
- `set catalog(items: HTMLElement[])` - сеттер для установки каталога товаров
- `set locked(value: boolean)` - сеттер для установки/снятия блокировки прокрутки

### Класс Modal
Класс для отображения всех модальных окон на сайте. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_closeButton: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки закрытия
- `_content: HTMLElement` - свойство, которое хранит в себе элемент с содержимым модального окна
- `set content(value: HTMLElement)` - сеттер для установки содержимого модального окна
- `open()` - метод для открытия модального окна
- `close()` - метод для закрытия модального окна
- `render()` - метод для отрисовки модального окна

### Класс Form
Родительский класс для всех форм на сайте. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_submit: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки сабмита
- `_errors: HTMLElement` - свойство, которое хранит в себе элемент для вывода ошибок
- `set valid(value: boolean)` - сеттер для деактивации кнопки
- `set errors(value: string)` - сеттер для установки ошибок валидации

### Класс ContactsForm
Класс для отображения формы контактов. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_email: string` - свойство, которое хранит в себе значение поля ввода email
- `_phone: string` - свойство, которое хранит в себе значение поля ввода номера телефона
- `_button: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки сабмита
- `handleSubmit(event: Event)` - метод присвоения значений в полях ввода переменным
- `validateForm()` - метод валидации полей ввода
- `get email()` - геттер свойства, хранящего email
- `get phone()` - геттер свойства, хранящего номер телефона
- `clear(): void` - метод очистки полей ввода

### Класс PaymentForm
Класс для отображения формы выбора метода оплаты и адреса доставки. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_payment: string` - свойство, которое хранит в себе значение метода оплаты
- `_address: string` - свойство, которое хранит в себе значение поля ввода адреса
- `_buttonCash: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки оплаты за наличные
- `_buttonCard: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки оплаты по карте
- `changePaymentMethod(selectedButton: HTMLButtonElement)` - метод переключения выбранного способа оплаты
- `handleSubmit()` - метод присвоения значения поля ввода переменной _address
- `validateForm()` - метод валидации полей ввода
- `get address()` - геттер свойства, хранящего адрес
- `get payment()` - геттер свойства, хранящего выбранный метод оплаты
- `clear(): void` - метод очистки полей ввода

### Класс SuccessWindow
Класс для отображения окна с успешным заказом. Конструктор класса принимает HTML-элемент контейнера контента и инстанс класса EventEmitter для создания событий.

#### Поля и методы класса:

- `_total: HTMLElement` - свойство, которое хранит в себе элемент разметки со стоимостью заказа
- `_button: HTMLButtonElement` - свойство, которое хранит в себе элемент кнопки закрытия окна
- `setTotalPrice(price: number)` - метод установки сообщения о списании средств

## 3. Слой презентора
Код, отвечающий за взаимодействие слоев отображения и данных, описан в файле index.ts. 
Взаимодействие между слоями осуществляется через события, инициируемые EventEmitter и соответствующие обработчики, что позволяет эффективно управлять обменом данными между представлением и слоем данных.
Далее приведены списки событий, которые генерируют модели данных самостоятельно и которые генерирует пользователь:

### События, генерируемые моделями данных:
- `productsList:changed` - событие, которое генерируется при загрузке каталога товаров с сервера
- `basket:change` - событие, которое генерируется при изменении списка товаров в корзине
- `modal:open` - событие, блокирующее прокрутку страницы, срабатывающее при открытии модальных окон
- `modal:close` - событие, разблокирующее прокрутку страницы, срабатывающее при закрытии модальных окон

### События, генерируемые пользователем:
- `basket:open` - событие, которое открывает корзину с товарами.
- `cardPreviw:render` - событие, срабатывающее при нажатии пользователем на одну из карточек на главной странице. Открывает окно просмотра товара.
- `product:buy` - событие, срабатывающее при добвления товара в корзину пользователем.
- `product:delete` - событие, срабатывающее при нажатии на кнопку удаления товара из корзины и при нажатии удаления товара из окна карточки товара.
- `payment:open` - событие, срабатывающее при оформлении заказа в корзине
- `order:submit` - событие, срабатывающее при переходе к следующему окну, после заполнении данных в первой форме
- `success:close` - событие, срабатывающее закрытии последнего окна об успешной оплате