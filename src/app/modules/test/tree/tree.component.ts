import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { DynamicDatasource, DynamicFlatNode } from './DynamicDatasource';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDatasource;

  constructor(private productService: ProductService) { 
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDatasource(this.treeControl, this.productService);
  }


  // constructor(private _database: ChecklistDatabase) {
  //   this.treeFlattener = new MatTreeFlattener(
  //     this.transformer,
  //     this.getLevel,
  //     this.isExpandable,
  //     this.getChildren,
  //   );
  //   this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
  //   this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  //   _database.dataChange.subscribe(data => {
  //     this.dataSource.data = data;
  //   });
  // }


  ngOnInit(): void {
    
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}
