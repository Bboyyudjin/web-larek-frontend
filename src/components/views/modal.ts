import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

export class ModalView {
  protected modal: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected container: HTMLElement;
  protected onClose: () => void = () => {};

  constructor(modal: HTMLElement, protected events: EventEmitter) {
    this.modal = modal;
    this.container = ensureElement('.modal__content', modal) as HTMLElement;
    this.closeButton = ensureElement('.modal__close', modal) as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.modal.addEventListener('click', (evt) => {
      if (evt.target === this.modal) this.close();
    });
  }

  open() {
    this.modal.classList.add('modal_active');
    document.addEventListener('keydown', this.closeByEsc);
  }

  close() {
    this.onClose();
    this.modal.classList.remove('modal_active');
    document.removeEventListener('keydown', this.closeByEsc);
  }

  setContent(content: HTMLElement) {
    this.container.replaceChildren(content);
  }

  protected closeByEsc = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  setOnClose(func: () => void) {
    this.onClose = func;
  }
}