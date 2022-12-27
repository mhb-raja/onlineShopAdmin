import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTestComponent } from 'src/app/modules/mat-test/mat-test.component';
import { NgExampleComponent } from 'src/app/modules/test/ng-example/ng-example.component';
import { TreeComponent } from 'src/app/modules/test/tree/tree.component';
import { MyImageCropperModule } from 'src/app/shared/widgets/image-cropper/my-image-cropper.module';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { DefaultComponent } from './default.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NgDynamicExampleComponent } from 'src/app/modules/test/ng-dynamic-example/ng-dynamic-example.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'sliders',
        loadChildren: () =>
          import('src/app/modules/sliders/sliders.module').then(
            (m) => m.SlidersModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('src/app/modules/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('src/app/modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      { path: 'test', component: MatTestComponent },
      { path: 'tree', component: TreeComponent },
      { path: 'ng', component: NgExampleComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DefaultComponent,
    NgExampleComponent,
    NgDynamicExampleComponent,
    DashboardComponent,
    TreeComponent,
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
