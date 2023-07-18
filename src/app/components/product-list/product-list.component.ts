import { Component, Inject, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }


  handleSearchProducts() {
    const keyword_ : string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(keyword_).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts() {
    // check if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')
    if(hasCategoryId) {
      //+ is a converter from string to number
      // ! says to compilor that object is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // if no category param set category to 1 (books)
      this.currentCategoryId =1
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
