import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { Component } from "../base/component";

export abstract class FormView extends Component {
  protected error: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected container: HTMLFormElement;
  constructor(container: HTMLFormElement, events: EventEmitter){
    super(container, events);
    this.error = ensureElement<HTMLElement>('.form__errors', container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
  }

  disableOrderButton(status: boolean) {
    this.submitButton.disabled = status;
  }

  reset() {
    this.container.reset()
    this.submitButton.disabled = true;
  }

}