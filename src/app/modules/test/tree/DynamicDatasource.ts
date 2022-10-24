import { CollectionViewer, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Injectable } from "@angular/core";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { CategoryDTO } from "src/app/DTOs/category/CategoryDTO";
import { ProductService } from "src/app/services/product.service";

export class DynamicFlatNode {
    constructor(
        public item: string,
        public level: number = 1,
        public expandable = false,
        public isLoading = false,
        public content: CategoryDTO
    ) { }
}

@Injectable({ providedIn: 'root' })
export class DynamicDatasource {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
    ctgTree = {};

    get data(): DynamicFlatNode[] {
        return this.dataChange.value;
    }
    set data(value: DynamicFlatNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
        private service: ProductService) {
        this.service.GetCategoryChildren(-1)
            .pipe(take(1))
            .subscribe(cats => {
                const nodes = [];
                cats.forEach(cat =>
                    nodes.push(new DynamicFlatNode(cat.title, 0, true, false, cat))
                );
                this.data = nodes;
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this.treeControl.expansionModel.changed.subscribe(change => {
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
        if (expand) {
            const index = this.data.indexOf(node);
            console.log('toggle node. index: ',index);
            
            node.isLoading = true;
            this.service.GetCategoryChildren(node.content.id)
                .pipe(take(1))
                .subscribe(children => {
                    console.log(children);
                    if (!children) node.expandable = false;
                    const nodes = [];
                    children.forEach(cat =>
                        nodes.push(new DynamicFlatNode(cat.title, node.level + 1, false, false, cat))
                    );
                    this.data.splice(index + 1, 0, ...nodes);
                    node.isLoading = false;
                    this.dataChange.next(this.data);
                }
                );
        }
    }


    /**
   * Toggle the node, remove from display list
   */
    toggleNode2(node: DynamicFlatNode, expand: boolean) {
        //const children = this._database.getChildren(node.item);
        // const index = this.data.indexOf(node);
        // if (!children || index < 0) {
        //     // If no children, or cannot find the node, no op
        //     return;
        // }

        // node.isLoading = true;

        // setTimeout(() => {
        //     if (expand) {
        //         const nodes = children.map(
        //name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
        //         );
        //         this.data.splice(index + 1, 0, ...nodes);
        //     } else {
        //         let count = 0;
        //         for (
        //             let i = index + 1;
        //             i < this.data.length && this.data[i].level > node.level;
        //             i++, count++
        //         ) { }
        //         this.data.splice(index + 1, count);
        //     }

        //     // notify the change
        //     this.dataChange.next(this.data);
        //     node.isLoading = false;
        // }, 1000);
    }
}