import { EventEmitter } from "./events";

export abstract class Component {
  
  protected constructor(protected container: HTMLElement, protected events: EventEmitter) {
    this.events = events
  } 

  render(data?: object): HTMLElement {
    return this.container
  }
}