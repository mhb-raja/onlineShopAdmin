import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTestComponent } from 'src/app/modules/mat-test/mat-test.component';
import { NgExampleComponent } from 'src/app/modules/test/ng-example/ng-example.component';
import { TreeComponent } from 'src/app/modules/test/tree/tree.component';
import { NotFoundComponent } from 'src/app/modules/not-found/not-found.component';
import { MyImageCropperModule } from 'src/app/shared/widgets/image-cropper/my-image-cropper.module';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
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
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), MyImageCropperModule],
  exports: [RouterModule],
})
export class DefaultModule {}
