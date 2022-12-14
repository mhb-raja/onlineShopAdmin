import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { ProductCommentsTableComponent } from './comments/product-comments-table/product-comments-table.component';
import { CommentViewComponent } from './comments/comment-view/comment-view.component';

const routes: Routes = [
  { path: '', component: ProductTableComponent },
  { path: 'add', component: ProductAddComponent },
  { path: 'edit/:id', component: ProductEditComponent },
  { path: 'gallery/:id', component: ProductGalleryComponent },
  { path: 'comments', component: ProductCommentsTableComponent },
  { path: 'comments/:productId', component: CommentViewComponent },
];

@NgModule({
  declarations: [
    ProductTableComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductGalleryComponent,
    ProductCommentsTableComponent,
    CommentViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    //ReactiveFormsModule, FormsModule,
    SharedModule,
  ],
  exports: [RouterModule],
})
export class ProductsModule {}
