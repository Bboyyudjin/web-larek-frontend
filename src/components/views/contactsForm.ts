import { ValidationErrors, ConsumerContacts } from "../../types";
import { EventEmitter } from "../base/events";
import { FormView } from "./form";

export class ContactsFormView extends FormView {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = container.elements[0] as HTMLInputElement;
    this.phoneInput = container.elements[1] as HTMLInputElement;

    // Обработчик ввода для обновления данных формы
    container.addEventListener('input', () => {
      this.onInputChange({
        email: this.emailInput.value,
        phone: this.phoneInput.value
      });
    });

    // Обработчик клика по кнопке отправки формы
    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`view:contactsForm:submit`);
    });
  }

  // Метод для обработки изменений ввода
  onInputChange(data: ConsumerContacts) {
    this.events.emit(`view:contactsForm:inputChange`, data);
  }

  // Метод для установки ошибок валидации
  setValidationErrors(errors: ValidationErrors) {
    this.error.textContent = '';
    if (errors.phone) {
      this.error.textContent += `\n` + errors.phone;
    }
    if (errors.email) {
      this.error.textContent = errors.email;
    }
  }
}