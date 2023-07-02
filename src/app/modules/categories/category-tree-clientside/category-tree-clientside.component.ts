import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDTO } from 'src/app/DTOs/category/CategoryDTO';
import { ProductService } from 'src/app/services/product.service';
import { DialogData, GeneralDialogComponent } from 'src/app/shared/widgets/general-dialog/general-dialog.component';
import { CategoryDeleteOptionsDialogComponent } from '../category-delete-options-dialog/category-delete-options-dialog.component';
import { CatFlatNode, clientsideDatabase, ClientsideDataSource, DynamicDatabase, DynamicDataSource, DynamicFlatNode } from './clientsideDatasource';


@Component({
  selector: 'app-category-tree-clientside',
  templateUrl: './category-tree-clientside.component.html',
  styleUrls: ['./category-tree-clientside.component.scss']
})
export class CategoryTreeClientsideComponent implements OnInit {

  @Input() cardTitle: string = 'دسته بندی ها';
  @Input() selectingMode: boolean = false;
  @Input() selectedCategory: CategoryDTO = null;
  @Output() categorySelected = new EventEmitter<number>();

  toggleExpandAll: boolean = false;
  preselectedNode:CatFlatNode;
  rootSelected: boolean = false;

  treeControl: FlatTreeControl<CatFlatNode>;
  dataSource: ClientsideDataSource;
  selection: SelectionModel<CatFlatNode> = new SelectionModel<CatFlatNode>(false);

  constructor(private database: clientsideDatabase,private productService:ProductService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    database2: DynamicDatabase) {
    this.treeControl = new FlatTreeControl<CatFlatNode>(this.getLevel, this.isExpandable);    
    this.dataSource = new ClientsideDataSource(this.treeControl, database);    
     
    //--------------------------
    this.treeControl2 = new FlatTreeControl<DynamicFlatNode>(this.getLevel2, this.isExpandable2);
    this.dataSource2 = new DynamicDataSource(this.treeControl2, database2);
    this.dataSource2.data = database2.initialData();    
  }

  ngOnInit(): void {
    this.database.initialData().subscribe(res=>{
      this.dataSource.data=res;           
      if(this.selectedCategory){
        if(this.selectedCategory.parentId){ 
          this.preselectTreeNode();        }
        else
          this.rootSelected = true;
      }      
    });
  }

  preselectTreeNode(){
    let expanded:CatFlatNode[]=[];
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {      
      if(this.treeControl.dataNodes[i].expandable){
        expanded.push(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
      if (this.treeControl.dataNodes[i].item.id == this.selectedCategory.parentId) {
        this.preselectedNode = this.treeControl.dataNodes[i];        
        break;        
      }
    }
    if(this.preselectedNode)
      this.selection.select(this.preselectedNode)
  }


  getLevel = (node: CatFlatNode) => node.level;

  isExpandable = (node: CatFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: CatFlatNode) => _nodeData.expandable;

  nodeSelectionChanged (node: CatFlatNode) {//, hasChildren: boolean){
    this.selection.toggle(node);
    if(this.selection.selected.length)
    {
      this.rootSelected = false;
      this.categorySelected.emit(this.selection.selected[0].item.id);
    }
    else
      this.categorySelected.emit(-1);    
  }

  addToRoot(){          
    if(this.rootSelected){
      this.selection.clear();
      this.categorySelected.emit(null);
    }
    else
      this.categorySelected.emit(-1);    
  }

  expandAll(){
    this.toggleExpandAll=!this.toggleExpandAll;
    this.toggleExpandAll? this.treeControl.expandAll() : this.treeControl.collapseAll();    
  }

  removeElement(element: CatFlatNode) {
    if(element.expandable){
      this.openDialog_RemoveParentNode(element.item);
    }
    else {
      this.openDialog_RemoveLeafNode(element.item);
    }    
  }

  openDialog_RemoveParentNode(catToDelete:CategoryDTO){
    const dialogRef = this.dialog.open(CategoryDeleteOptionsDialogComponent, {
      width: '350px',
      data : { catTitle:catToDelete.title }
      //data: {}// new DialogData(`دسته "${element.item.title}" حذف شود؟`) 
    }).afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined && result !== null)
        if (catToDelete.id > 0) {
          this.productService.deleteCategory(catToDelete.id,result).subscribe(()=>{
            //this.rowDelete$.next();
            this.snackBar.open( `دسته ${catToDelete.title} حذف شد`, 'OK', { duration: 5000 })
          });
        }
    });
  }
  openDialog_RemoveLeafNode(catToDelete:CategoryDTO){
    const dialogRef = this.dialog.open(GeneralDialogComponent, {
      width: '250px',
      data: new DialogData(`دسته "${catToDelete.title}" حذف شود؟`) 
    }).afterClosed().subscribe(result => {
      if (result !== undefined && result === true)
        if (catToDelete.id > 0) {
          this.productService.deleteCategory(catToDelete.id).subscribe(()=>{
            //this.rowDelete$.next();
            this.snackBar.open( `دسته ${catToDelete.title} حذف شد`, 'OK', { duration: 5000 })
          });
        }
    });
  }
  //------------------------------
  treeControl2: FlatTreeControl<DynamicFlatNode>;

  dataSource2: DynamicDataSource;

  getLevel2 = (node: DynamicFlatNode) => node.level;

  isExpandable2 = (node: DynamicFlatNode) => node.expandable;

  hasChild2 = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}
