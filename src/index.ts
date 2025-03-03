import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { IPaymentForm, IProduct, ISuccessOrder, PaymentMethod } from './types';
import { EventEmitter } from './components/base/events';
import { ProductsAPI } from './components/data-models/ProductsApi';
import { CardInBasket, CardInCatalog, CardPreviw } from './components/Views/Card';
import { Page } from './components/Views/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Modal } from './components/Views/Modal';
import { BasketView } from './components/Views/Basket';
import { PaymentForm } from './components/Views/PaymentForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { Order } from './components/data-models/Order';
import { SuccessWindow } from './components/Views/Sucssess';
import { ProductsModel } from './components/data-models/ProductsModel';
import { BasketModel } from './components/data-models/BasketModel';

const api = new ProductsAPI(API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

//Все шаблоны
const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement
const successTemplate = ensureElement('#success') as HTMLTemplateElement
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement
const orderTemplate = ensureElement('#order') as HTMLTemplateElement
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement

//Глобальные переменные
const page = new Page(document.body, events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const order = new Order(events)
const productsList = new ProductsModel(events)
const basket = new BasketModel(events)

const basketView = new BasketView(cloneTemplate<HTMLTemplateElement>(basketTemplate), events)
const paymentForm = new PaymentForm(cloneTemplate<HTMLFormElement>(orderTemplate), events)
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events)
const successWindow = new SuccessWindow(cloneTemplate<HTMLTemplateElement>(successTemplate), events)

// Изменение массива карточек
events.on('productsList:changed', () => {
  const cards: HTMLElement[] = [];
  productsList.products.forEach((product: IProduct) => {
    const card = new CardInCatalog(cloneTemplate<HTMLTemplateElement>(cardCatalogTemplate), events);
    cards.push(card.render(product));
  });
  page.catalog = cards
});

// Нажатие на карточку
events.on('cardPreviw:render', (data: IProduct) => {
  const card = new CardPreviw(cloneTemplate<HTMLTemplateElement>(cardPreviewTemplate), events);
  card.changeButtonState(basket.isInBasket(data))
  modal.content = card.render(data)
  modal.open()
});

// Нажатие на кнопку "Добавить в корзину"
events.on('product:buy', (data: IProduct) => {
  basket.toggleItem(data)
  page.counter = basket.itemsNumber
})

// Нажатие на кнопку удаления в корзине
events.on('product:delete', (data: IProduct) => {
  basket.toggleItem(data)
  page.counter = basket.itemsNumber
})

// Открытие корзины
events.on('basket:open', () => {
  modal.content = basketView.render()
  modal.open()
})

// Изменение корзины
events.on('basket:change', () => {
  const basketList: HTMLElement[] = []
  basket.products.forEach((product: IProduct, index: number) => {
    const card = new CardInBasket(cloneTemplate(cardBasketTemplate), events);
    card.setIndex(index+1)
    basketList.push(card.render(product));
  });
  basketView.total = basket.getTotal()
  basketView.items = basketList
})

// Открытие формы оплаты
events.on('payment:open', () => {
  order.validate('payment')
  modal.content = paymentForm.render()
  paymentForm.clearErrors()
})

// Изменение способа оплаты в модели данных
events.on(`paymentMetod:change`, (button: HTMLButtonElement) => {
  order.payment = button.name as PaymentMethod
  order.validate('payment')
})

// Изменение способа оплаты в отображении
events.on(`paymentForm:change`, () => {
  paymentForm.changePaymentMethod(order.orderInfo.payment)
  paymentForm.render()
})

// Ввод в поле "Адрес"
events.on(`payment:validation`, (input: HTMLInputElement) => {
  order.address = input.value;
  order.validate('payment')
});

// Переход к следующему модальному окну
events.on('order:submit', () => {
  modal.content = contactsForm.render()
  order.validate('contacts')
  contactsForm.clearErrors()
})

// Показ ошибок
events.on('order:validationError', (errors: object) => {
  paymentForm.displayErrors(errors);
  contactsForm.displayErrors(errors);
});

// Ввод в полях окна "Контакты"
events.on(`contacts:validation`, ({ input, name }: { input: HTMLInputElement; name: keyof Pick<Order, 'address'| 'email'| 'phone'> }) => {
  order[name] = input.value;
  order.validate('contacts')
});

// Отправка заказа на сервер
events.on('contacts:submit', () => {
  api.pushOrder(Object.assign({}, order.orderInfo, basket.productsToOrder))
  .then((data: ISuccessOrder) => {
  modal.content = successWindow.render()
  successWindow.setTotalPrice(data.total)
  order.clear()
  basket.clearBasket()
  paymentForm.clear()
  contactsForm.clear()
  page.counter = basket.itemsNumber
  modal.open()
}) .catch(error => {
    console.error(error);
  });
})

// Закрытие окна успешного заказа
events.on(`success:close`, () => {
  modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

//Получаем массив продуктов с сервера
api.getProductList()
  .then((products: IProduct[]) => {
   productsList.products = products
  })
    .catch((err) => {
        console.error(err);
    });