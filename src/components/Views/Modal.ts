import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
      super(container, events);

      this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
      this._content = ensureElement<HTMLElement>('.modal__content', container);

      this._closeButton.addEventListener('click', this.close.bind(this));
      this.container.addEventListener('click', this.close.bind(this));
      this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
      this._content.replaceChildren(value);
  }

  open() {
      this.container.classList.add('modal_active');
      this.events.emit('modal:open');
      document.addEventListener('keydown', this.closeByEsc)
  }

  close() {
      this.container.classList.remove('modal_active');
      this.content = null;
      this.events.emit('modal:close');
      document.removeEventListener('keydown', this.closeByEsc)

  }

  render(data: IModalData): HTMLElement {
      super.render(data);
      this.open();
      return this.container;
  }

  protected closeByEsc = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}