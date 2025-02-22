import { IProduct } from "../../types";

export class ProductsModel {
  private _products: IProduct[] = []

  constructor () {}
  
  set products(data: IProduct[]) {
    this._products = data
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find(item => item.id === id);
  }

  get products(): IProduct[] {
    return this._products;
  }
}