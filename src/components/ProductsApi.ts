
import { Api } from './base/api';
import {IOrder, ISuccessOrder, IProduct } from "../types";

export interface IProductsAPI {
  getProductList: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<ISuccessOrder>;
}

export class ProductsAPI extends Api {

    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: {items: IProduct[]}) =>
            data.items.map((item) => ({
                ...item,
            }))
        );
    }

    pushOrder(order: IOrder): Promise<ISuccessOrder> {
        return this.post('/order', order).then(
            (data: ISuccessOrder) => data
        );
    }

}