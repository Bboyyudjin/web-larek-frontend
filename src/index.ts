// Стили
import './scss/styles.scss';

// Интерфейсы
import { IOrder, IProduct, IOrderResult, PaymentInfo, ConsumerContacts } from './types';

// Базовые данные
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

// Слой моделей
import { BasketModel } from './components/models/basket';
import { ProductsModel } from './components/models/products';
import { ConsumerModel } from './components/models/consumer';

// Слой отображения
import { BasketView } from './components/views/basket';
import { CardView } from './components/views/card';
import { ModalView } from './components/views/modal';
import { ContactsFormView } from './components/views/contactsForm';
import { OrderFormView } from './components/views/orderForm';
import { SuccessView } from './components/views/success';
import { BasketButtonView } from './components/views/basketButton';

// Утилиты
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Темплейты
const successTemp = ensureElement('#success') as HTMLTemplateElement;
const cardTemp = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemp = ensureElement('#card-preview') as HTMLTemplateElement;
const cardBasketItemTemp = ensureElement('#card-basket') as HTMLTemplateElement;
const basketTemp = ensureElement('#basket') as HTMLTemplateElement;
const orderFormTemp = ensureElement('#order') as HTMLTemplateElement;
const contactsFormTemp = ensureElement('#contacts') as HTMLTemplateElement;

// DOM-элементы
const pageWrapper = ensureElement('.page__wrapper') as HTMLElement;
const productList = ensureElement('.gallery') as HTMLElement;
const basketButtonElement = ensureElement('.header__basket') as HTMLButtonElement;
const modalElement = ensureElement('.modal') as HTMLElement;
const orderFormElement = cloneTemplate(orderFormTemp) as HTMLFormElement;
const basketElement = cloneTemplate(basketTemp) as HTMLElement;
const contactsElement = cloneTemplate(contactsFormTemp) as HTMLFormElement;
const successElement = cloneTemplate(successTemp) as HTMLElement;
const cardPreviewElem = cloneTemplate(cardPreviewTemp) as HTMLElement;


// Базовые классы
const api = new Api(API_URL);
const events = new EventEmitter();

// Модели данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const consumerModel = new ConsumerModel(events);
const basketButton = new BasketButtonView(basketButtonElement, events);
const modal = new ModalView(modalElement, events);
const orderForm = new OrderFormView(orderFormElement, events);
const contactsForm = new ContactsFormView(contactsElement, events);
const basket = new BasketView(basketElement, events);
const success = new SuccessView(successElement, events);
const modalCard = new CardView(cardPreviewElem, events);


// Получаем товары с сервера и помещаем их в модель данных
api.get('/product').then((data: {items: IProduct[]}) => {
  productsModel.productList = data.items
}).catch(err => {
  console.error(err);
});

// Привязка слушателей к событиям
// Изменение массива корзины
events.on(`model:products:change`, () => {
  const elems = productsModel.productList.map(item => {
    const cardElem = new CardView(cloneTemplate<HTMLButtonElement>(cardTemp), events);
    cardElem.setForCatalog(item);
    return cardElem.render();
  })
  productList.replaceChildren(...elems)
});

// Изменение массива корзины
events.on(`model:basket:change`, () => {
  basketButton.setCounter(basketModel.itemsNumber);
  modalCard.changeButtonState(basketModel.isInBasket(modalCard.id));
  const basketItems: HTMLElement[] = [];
  let index: number = 1;
  for (let item of basketModel.basket.keys()) {
    const cardData = productsModel.getProduct(item)
    const cardElem = new CardView(cloneTemplate<HTMLButtonElement>(cardBasketItemTemp), events);
    cardElem.setForBasket(cardData);
    cardElem.setIndex(index);
    basketItems.push(cardElem.render());
    index += 1;
  }
  basket.setBasketItems(basketItems);
  basket.setTotalPrice(basketModel.basketPrice);

  if (basketModel.basketPrice === 0) {
    basket.disableOrderButton(false);
  } else {
    basket.disableOrderButton(true);
  }
});

// Нажатие на карточку товара
events.on(`view:card:pick`, ({ id }: {id: string}) => {
  const cardData = productsModel.getProduct(id);
  modalCard.setForModal(cardData);
  modalCard.changeButtonState(basketModel.isInBasket(id));
  onModalOpen();
  modal.open();
  modal.setContent(modalCard.render());
});

// Нажатие на кнопку "Добавить в корзину"
events.on(`view:card:buy`, ({ id }: {id: string}) => {
  basketModel.addItem(productsModel.getProduct(id));
});

// Нажатие на кнопку корзины
events.on(`view:basketButton:click`, () => {
  modal.open();
  onModalOpen();
  modal.setContent(basket.render());
})

// Нажатие на кнопку удаления товара из корзины
events.on('view:basket:remove', ({ id }: {id: string}) => {
  basketModel.removeItem(id);
})

// Нажатие на кнопку "Оформить" в корзине
events.on(`view:basket:order`, () => {
  modal.setContent(orderForm.render());
});

// Генерация события при изменении полей ввода в форме информации об оплате
events.on(`view:orderForm:inputChange`, (data: PaymentInfo) => {
  consumerModel.addPaymentInfo(data);
  orderForm.setValidationErrors(consumerModel.errors);
  orderForm.disableOrderButton(!consumerModel.paymentInfoIsValid());
});

// Нажатие на кнопку "Далее" в форме информации об оплате
events.on(`view:orderForm:submit`, () => {
  modal.setContent(contactsForm.render());
});

// Генерация события при изменении полей ввода в форме контактов
events.on(`view:contactsForm:inputChange`, (data: ConsumerContacts) => {
  consumerModel.addContacts(data);
  contactsForm.setValidationErrors(consumerModel.errors);  
  contactsForm.disableOrderButton(!consumerModel.contactsIsValid());
});

// Нажатие на кнопку "Оплатить" в форме контактов
events.on(`view:contactsForm:submit`, () => {
  const order = {
    total: basketModel.basketPrice,
    items: Array.from(basketModel.basket.keys())
  }
  const data: IOrder = {...consumerModel.consumerInfo, ...order};
  api.post('/order', data).then((data: IOrderResult) => {
    success.setTotalPrice(data.total);
    consumerModel.clearAllInfo();
    orderForm.reset();
    contactsForm.reset();
    basketModel.clearBasket();
    modal.setContent(success.render());
  }).catch(error => {
    console.error(error);
  });
});

// Нажатие на кнопку "Вперед за новыми покупками" в окне успешной оплаты
events.on(`view:success:close`, () => {
  modal.close();
});

//Управление прокруткой
const onModalOpen = () => {
  pageWrapper.classList.add('page__wrapper_locked');
}

const onModalClose = () => {
  pageWrapper.classList.remove('page__wrapper_locked');
}

modal.setOnClose(onModalClose)