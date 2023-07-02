import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { CategoryDTO } from "src/app/DTOs/category/CategoryDTO";
import { ProductService } from "src/app/services/product.service";

/** Flat node with expandable and level information */
// export interface CatFlatNode {
//     expandable: boolean;
//     item: CategoryDTO;
//     level: number;
// }
export class CatFlatNode {
    constructor(
      public item: CategoryDTO,
      public level = 1,
      public expandable = false,
      //public isLoading = false,
    ) {}
  }

  export class nodeAddress{
    constructor(public id:number, public indexInList:number){}
  }
//------------------------ database---------------------
@Injectable({ providedIn: 'root' })
export class clientsideDatabase implements OnDestroy{

  private myDataMap = new Map<CategoryDTO, CategoryDTO[]>();
  // private myDataMap3=new Map<nodeAddress,nodeAddress[]>();

  private list:CategoryDTO[]=[];

  constructor(private productService:ProductService){ }

  rootLevelNodes: CategoryDTO[]=[];

  ngOnDestroy(): void { }

  initialData(): Observable<CatFlatNode[]>{  
    console.log('initial') 
    return this.productService.getCategoriesList().pipe(
      take(1),
      map(res=>{
        this.list=res;
        this.rootLevelNodes = this.list.filter(x=>x.parentId===null);
        this.generateDataMap();
        return this.rootLevelNodes.map(ctg => new CatFlatNode(ctg, 0, ctg.expandable));
      })
    );
  }

  private generateDataMap(){
    const dm=(ctg:CategoryDTO)=>{
      const children = this.list.filter(x=>x.parentId===ctg.id);      
      if(children.length || this.rootLevelNodes.indexOf(ctg)>=0){
        this.myDataMap.set(ctg,children);
        children.forEach(dm);
      }
    }
    this.rootLevelNodes.forEach(dm);

    // const dd=(ctg:CategoryDTO)=>{
    //     const children=this.list.filter(x=>x.parentId===ctg.id);
    //     this.myDataMap3.set(new nodeAddress(ctg.id,this.list.indexOf(ctg)),
    //         children.map(xx=>new nodeAddress(xx.id,this.list.indexOf(xx))) );
    //     children.forEach(dd);
    // }
    // this.rootLevelNodes.forEach(dd);

  }
  
  getChildren(node: CategoryDTO): CategoryDTO[] {    
    if(node.expandable && !this.myDataMap.has(node)) {
        const items = this.list.filter(x=>x.parentId===node.id);
        this.myDataMap.set(node,items);
    }
    return this.myDataMap.get(node);
  }

  isExpandable(node: CategoryDTO): boolean {
    return this.myDataMap.has(node);
  }

  getLevel(node:CategoryDTO): number {
    for (const child of this.rootLevelNodes) {
      const ret = this.loopInMap(0,child,node);
      if (ret >= 0)
        return ret;
    }
    return -1;
  }

  private loopInMap(level: number, thisNode: CategoryDTO, nodeToFind: CategoryDTO) {
    //console.log('level=', level,'thisnode=', thisNode)
    if (thisNode.urlTitle == nodeToFind.urlTitle)
      return level;
    else {
      const children = this.getChildren(thisNode)
      if (children?.length > 0)        
        for (const child of children){
          const ret = this.loopInMap(level+1, child, nodeToFind);
          if (ret > level)
            return ret;
        }      
      else
        return -1;
    }
  }

}

//------------------------------  datasource  ----------------------------
export class ClientsideDataSource implements DataSource<CatFlatNode> {
  dataChange = new BehaviorSubject<CatFlatNode[]>([]);

  get data(): CatFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: CatFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<CatFlatNode>,
    private _database: clientsideDatabase,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<CatFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<CatFlatNode>).added ||
        (change as SelectionChange<CatFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<CatFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<CatFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }
  
  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: CatFlatNode, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }  

    if (expand) {
        const nodes = children.map(
        ctg => new CatFlatNode(ctg, node.level + 1, this._database.isExpandable(ctg)) );
        this.data.splice(index + 1, 0, ...nodes);
    } else {
        let count = 0;
        for (let i = index + 1;i < this.data.length && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
    }

    // notify the change
    this.dataChange.next(this.data);
  }

  findNode(node:CategoryDTO):CatFlatNode{
    console.log(this._treeControl.dataNodes,node)
    return this._treeControl.dataNodes.find(x=>x.item==node);
    // for (let i = 0; i < this._treeControl.dataNodes.length; i++) {
    //   if (this._treeControl.dataNodes[i].item == node) {
    //     //this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
    //     this._treeControl.expand(this._treeControl.dataNodes[i])
    //   }      
    // }
  }
}

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
/** Flat node with expandable and level information */
export class DynamicFlatNode {
    constructor(
      public item: string,
      public level = 1,
      public expandable = false,
      public isLoading = false,
    ) {}
  }
/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
//-------------------------------------------------
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
  
    get data(): DynamicFlatNode[] {
      return this.dataChange.value;
    }
    set data(value: DynamicFlatNode[]) {
      this._treeControl.dataNodes = value;
      this.dataChange.next(value);
    }
  
    constructor(
      private _treeControl: FlatTreeControl<DynamicFlatNode>,
      private _database: DynamicDatabase,
    ) {}
  
    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
      this._treeControl.expansionModel.changed.subscribe(change => {
        if (
          (change as SelectionChange<DynamicFlatNode>).added ||
          (change as SelectionChange<DynamicFlatNode>).removed
        ) {
          this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
        }
      });
  
      return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }
  
    disconnect(collectionViewer: CollectionViewer): void {}
  
    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
      if (change.added) {
        change.added.forEach(node => this.toggleNode(node, true));
      }
      if (change.removed) {
        change.removed
          .slice()
          .reverse()
          .forEach(node => this.toggleNode(node, false));
      }
    }
  
    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: DynamicFlatNode, expand: boolean) {
      const children = this._database.getChildren(node.item);
      const index = this.data.indexOf(node);
      if (!children || index < 0) {
        // If no children, or cannot find the node, no op
        return;
      }
  
      node.isLoading = true;
  
      setTimeout(() => {
        if (expand) {
          const nodes = children.map(
            name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
          );
          this.data.splice(index + 1, 0, ...nodes);
        } else {
          let count = 0;
          for (
            let i = index + 1;
            i < this.data.length && this.data[i].level > node.level;
            i++, count++
          ) {}
          this.data.splice(index + 1, count);
        }
  
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      }, 1000);
    }
  }
  