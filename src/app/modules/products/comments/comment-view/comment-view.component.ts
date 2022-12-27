import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductDTO } from 'src/app/DTOs/product/ProductDTO';
import { ProductService } from 'src/app/services/product.service';
import { ProductImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.scss']
})
export class CommentViewComponent implements OnInit {

  productId: number;
  product$:Observable<ProductDTO>;
  imagePath=ProductImagePath;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,) { }

    

  ngOnInit(): void {
    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get('productId')!,10);
    this.product$=this.productService.getProductDetails(this.productId);
  }

}
