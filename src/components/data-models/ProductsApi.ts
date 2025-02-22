
import { Api } from '../base/api';
import {IOrder, ISuccessOrder, IProduct } from "../../types";

export interface IProductsAPI {
  getProductList: () => Promise<IProduct[]>;
  pushOrder: (order: IOrder) => Promise<ISuccessOrder>;
}

export class ProductsAPI extends Api {

    constructor(baseUrl: string) {
        super(baseUrl);
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