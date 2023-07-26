import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  constructor(private httpClient: HttpClient) { }

  getProduct(productId: number):  Observable<Product> {
    const url = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(url);
  }

  getProductListPaginate(page: number,
                         pageSize: number,
                         categoryId: number): Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                +`&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(url);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const url = "http://localhost:8080/api/product-category";

    return this.httpClient.get<GetResponseProductCategory>(url).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  searchProducts(keyword_: string): Observable<Product[]> {
    const url = `${this.baseUrl}/search/findByNameContaining?name=${keyword_}`;
    return this.getProducts(url);
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


