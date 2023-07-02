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
import { CommentsTableComponent } from './comments-table/comments-table.component';

const routes: Routes = [
  
  { path: 'dummy', component: CommentsTableComponent , data:{title:' قدیمی نظرات'}},
  { path: 'comments', component: ProductCommentsTableComponent , data:{title:'نظرات'}},
  { path: '', component: ProductTableComponent },
  { path: 'add', component: ProductAddComponent },
  //{ path: 'edit/:id', component: ProductEditComponent },
  { path: ':id', component: ProductEditComponent,   data:{title:'ویرایش'} },//canDeactivate:[CanDeactivateGuard],
  
  
  
  { path: 'comments/:productId', component: CommentViewComponent },
  { path: 'gallery/:id', component: ProductGalleryComponent },
];

@NgModule({
  declarations: [
    ProductTableComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductGalleryComponent,
    ProductCommentsTableComponent,
    CommentViewComponent,
    CommentsTableComponent,
  ],
  imports: [
    //CommonModule,
    RouterModule.forChild(routes),
    //MaterialModule,
    //ReactiveFormsModule, FormsModule,
    SharedModule,
  ],
  exports: [RouterModule],
})
export class ProductsModule {}
