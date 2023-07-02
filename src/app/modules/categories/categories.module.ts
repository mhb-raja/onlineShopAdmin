import { NgModule } from '@angular/core';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryTreeComponent } from './category-tree/category-tree.component';
// import CategoryTreeClientsideComponent from './category-tree-clientside/category-tree-clientside.component';
import { TreeChecklistExampleComponent } from './tree-checklist-example/tree-checklist-example.component';
import { CategoryTreeChecklistComponent } from './category-tree-checklist/category-tree-checklist.component';
import { CategoryDashboardComponent } from './category-dashboard/category-dashboard.component';
import { CategoryTreeClientsideComponent } from './category-tree-clientside/category-tree-clientside.component';
import { CategoryDeleteOptionsDialogComponent } from './category-delete-options-dialog/category-delete-options-dialog.component';

const routes: Routes = [
  
  { path: 'add', component: CategoryAddComponent },
  { path: 'edit/:id', component: CategoryEditComponent },
  { path: 'tree',component:CategoryTreeComponent },
  { path:'clientside',component:CategoryTreeClientsideComponent},
  { path:'checklist', component:TreeChecklistExampleComponent},
  { path:'treecheck',component:CategoryTreeChecklistComponent},
  { path: '', component: CategoryDashboardComponent },
]

@NgModule({
  declarations: [
    CategoryAddComponent,
    CategoryEditComponent,
    CategoryTreeComponent,
    CategoryTreeClientsideComponent,
    TreeChecklistExampleComponent,
    CategoryTreeChecklistComponent,
    CategoryDashboardComponent,
    CategoryDeleteOptionsDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),  
  ],
  exports: [RouterModule]
})
export class CategoriesModule { }
