import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;
  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
    private cartService: CartService, // injected the cart service
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }

  listProducts() {

    // set up in order to launch search
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {

      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // reset page number when keyword changes
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    // keep track of the keyword
    this.previousKeyword = theKeyword;

    // logging for debugging reasons
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    
    // search for products using given keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1, this.thePageSize, theKeyword).subscribe(
      this.processResult());
  }

  handleListProducts() {
    // check if "id" is there
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the id(param string) and convert it to a number, using the "+" symbol (this does the conversion).
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }
    else {
      // no id available fallback to 1
      this.currentCategoryId = 1;
      //this.currentCategoryName = 'Books';
    }

    // check if we have a different category than the previous
    // note that angular will resuse a component if it is currently being viewed
    // if there is  a different category id than the previous one, then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    // keep track of category id
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    // get products for given id, page number and size
    this.productService.getProductListPaginate(this.thePageNumber - 1, // the pages in angular are 1 based but in spring 0 based
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());
  }

  private processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // the pages in angular are 1 based but in spring 0 based
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    // reset the page to one
    this.thePageNumber = 1;
    // refresh the page view
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Add to cart:${theProduct.name}`+` ${theProduct.unitPrice}`);
    
    // call the addToCart service
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
