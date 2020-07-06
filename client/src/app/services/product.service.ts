import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://127.0.0.1:8080/api/products';
  // url for product categories
  private categoryUrl = "http://127.0.0.1:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }


  getProductList(theCategoryId: number): Observable<Product[]> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, // parameters for pagination
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    // build the url to support pagination from Spring Data Rest based on id, page and size
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    // build the url to support pagination from Spring Data Rest based on id, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+ `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    // build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    // call the REST API based on this url
    return this.httpClient.get<Product>(productUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    // call the REST API
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      // map the JSON data  from Sring Data Rest to ProductCategory array
      map(respone => respone._embedded.productCategory)
    );
  }
}

// unwrap the json data from Spring Data REST _embedded entry
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
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
