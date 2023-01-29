import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { DynamicFlatNode, myDynamicDatabase, myDynamicDataSource } from './myDynamicDatasource';



@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent  {

  constructor(database: myDynamicDatabase) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new myDynamicDataSource(this.treeControl, database);
  
    //this.dataSource.data = database.initialData();
    database.initialData().subscribe(res=>
      { 
        this.dataSource.data=res;        
      });
  }
  

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: myDynamicDataSource;
  
  getLevel = (node: DynamicFlatNode) => node.level;
  
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;


  openNewItemDialog(node?: DynamicFlatNode): void {
    console.log(node);
    // let myroot;
    // if (node === undefined || node === null)
    //   myroot = { parentId: -1, parentTitle: 'ریشه' };
    // else
    //   myroot = { parentId: node.id, parentTitle: node.title };

    // let dialogRef = this.addDialog.open(AddCategoryComponent, {
    //   width: '280px',
    //   data: myroot
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined && result !== '')
    //     this.snackBar.open(result, 'OK', { duration: 5000 });
    // });
  }


}

