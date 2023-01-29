import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { map, mergeMap, take, takeUntil, tap} from "rxjs/operators";
import { CategoryDTO } from "src/app/DTOs/category/CategoryDTO";
import { ProductService } from "src/app/services/product.service";
import { componentDestroyed } from "src/app/shared/functions/componentDestroyed";


export class DynamicFlatNode {
    constructor(
      public item: CategoryDTO,
      public level = 1,
      public expandable = false,
      public isLoading = false,
    ) { }
  }

//##########################################################################

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: 'root' })
export class myDynamicDatabase implements OnDestroy{

  private myDataMap = new Map<number, CategoryDTO>();

  constructor(private productService:ProductService){}
  ngOnDestroy(): void { }

  /** Initial data from database */
  initialData(): Observable<DynamicFlatNode[]> {
      return this.productService.GetCategoryChildren(-1).pipe(
        take(1),
        //takeUntil(componentDestroyed(this)),
        map(items=>{
          const newBaseNodes:DynamicFlatNode[]=[];
          items.map(ctg=>{
            this.myDataMap.set(ctg.id,ctg);
            newBaseNodes.push(new DynamicFlatNode(ctg,0,ctg.expandable,false));
          });
          return newBaseNodes;
        })
        // mergeMap((response)=>response),
        // map(item=>new DynamicFlatNode(item,0,item.expandable,true))
        //map((response)=>response.map((item)=>new DynamicFlatNode(item,0, item.expandable,true)))        
    );//.subscribe();    
  }

  // getChildren(node: DynamicFlatNode): CategoryDTO2[] {
  //   let itemsObs: Observable<CategoryDTO2>[] = [];
  //   if (this.myDataMap.get(node.item.id).children != null) {
  //     return this.myDataMap.get(node.item.id).children;
  //     //return of(this.myDataMap.get(node.item.id).children);
  //   } else {
  //     return this.productService.GetCategoryChildren2(node.item.id).pipe(
  //       takeUntil(componentDestroyed(this)),
  //       //tap(items=>this.myDataMap.get(node.item.id).children=items)
  //     ).subscribe(items=>this.myDataMap.get(node.item.id).children=items);        
  //   } 
  // }
  getChildren(node: DynamicFlatNode): Observable<CategoryDTO[]> {    
    if (this.myDataMap.get(node.item.id).children != null) {      
      return of(this.myDataMap.get(node.item.id).children);
    } else {      
      return this.productService.GetCategoryChildren(node.item.id).pipe(
        take(1),
        // takeUntil(componentDestroyed(this)),
        tap(items=>items.map(ctg=>this.myDataMap.set(ctg.id,ctg))),
        // tap(items=>          
        //   this.myDataMap.get(node.item.id).children=items),        
      );        
    } 
  }

  isExpandable(node: number): boolean {
    return this.myDataMap.has(node);
  }

}

//##########################################################################

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class myDynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  // get data(): Observable<DynamicFlatNode[]> {
  //   return this.dataChange.asObservable();
  // }
  // set data(value: DynamicFlatNode[]) {
  //   this._treeControl.dataNodes = value;
  //   this.dataChange.next(value);
  // }

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: myDynamicDatabase,
  ) { }

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

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node =>this.toggleNode(node, true));
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
  toggleNode(node: DynamicFlatNode, expand: boolean): void {      
    const children = this._database.getChildren(node);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }
    node.isLoading = true;
    if (expand) {
      const newLevel = node.level + 1;
      children.subscribe((items: CategoryDTO[]) => {        
        const nodes: DynamicFlatNode[] = [];
        items.forEach((item: CategoryDTO) => {
          nodes.push(new DynamicFlatNode(item,newLevel,item.expandable,false));
        });
        this.data.splice(index + 1, 0, ...nodes);
        this.dataChange.next(this.data);
        node.isLoading = false;
      });
    } else {
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > node.level;
        i++, count++
      ) {}
      this.data.splice(index + 1, count);
      this.dataChange.next(this.data);
      node.isLoading = false;
    }
  }

  // toggleNode(node: DynamicFlatNode, expand: boolean): void {
  //   const children = this._database.getChildren(node);
  //   const index = this.data.indexOf(node);
  //   if (!children || index < 0) {
  //     // If no children, or cannot find the node, no op
  //     return;
  //   }

  //   node.isLoading = true;

  //   if (expand) {
  //     const newLevel = node.level + 1;
  //     children.subscribe((items: CategoryDTO2[]) => {
  //       const nodes: DynamicFlatNode[] = [];
  //       items.forEach((item: CategoryDTO2) => {
  //         nodes.push(new DynamicFlatNode(item,newLevel,newLevel < 1,false));
  //       });
  //       this.data.splice(index + 1, 0, ...nodes);
  //       this.dataChange.next(this.data);
  //       console.log(this.dataChange);
  //       node.isLoading = false;
  //     });
  //   } else {
  //     let count = 0;
  //     for (
  //       let i = index + 1;
  //       i < this.data.length && this.data[i].level > node.level;
  //       i++, count++
  //     ) {}
  //     this.data.splice(index + 1, count);
  //     this.dataChange.next(this.data);
  //     node.isLoading = false;
  //   }
  // }




}