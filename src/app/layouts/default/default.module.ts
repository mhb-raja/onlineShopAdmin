import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyImageCropperModule } from 'src/app/shared/widgets/image-cropper/my-image-cropper.module';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { DefaultComponent } from './default.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [  
  {
    path: '',
    component: DefaultComponent,
    children: [
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title:'خانه'} },
      {
        path: 'sliders',
        data: { title: 'اسلایدر' },
        loadChildren: () =>
          import('src/app/modules/sliders/sliders.module').then(
            (m) => m.SlidersModule
          ),
      },
      {
        path: 'categories',
        data: { title: 'دسته بندی ها' },
        loadChildren: () =>
          import('src/app/modules/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'category-attribute',
        data: { title: 'ویژگی دسته بندی ' },
        loadChildren: () =>
          import('src/app/modules/category-attribute/category-attribute.module').then(
            (m) => m.CategoryAttributeModule
          ),
      },
      {
        path: 'products',
        data: { title: 'محصولات' },
        loadChildren: () =>
          import('src/app/modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'attribs',
        data: { title: 'ویژگی ها' },
        loadChildren: () =>
          import('src/app/modules/attribs/attrib.module').then(
            (m) => m.AttribModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,


  ],
  imports: [
    //CommonModule,
    //FormsModule,ReactiveFormsModule,
    //MaterialModule,
    SharedModule,
    MyImageCropperModule,
    
    RouterModule.forChild(routes),
    
  ],

  exports: [
    RouterModule],
})
export class DefaultModule {}
