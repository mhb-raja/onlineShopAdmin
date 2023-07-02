import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';

import { ProductGalleryDTO,} from 'src/app/DTOs/product/ProductGalleryDTO';
import { ProductService } from 'src/app/services/product.service';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { ProductImageGalleryPath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
})

export class ProductGalleryComponent implements OnInit, OnChanges {
  
  private listChange = new Subject();

  gallery$; //!: Observable<ProductGalleryMiniDTO[]>;
  imagePath = ProductImageGalleryPath;
  aspectRatio = 1;
  comingFromChange: boolean = false;
  @Input() productId: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cropperDialogService: CropperDialogService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.productId) {
      this.comingFromChange = true;
      console.log('onchanges next');

      this.listChange.next();
      //this.getList();
    }
  }

  ngOnInit(): void {
    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!,10);

    this.gallery$ = this.listChange.asObservable().pipe(
      startWith(0),
      switchMap(() => this.getList()),
      shareReplay()
    );
    // if (this.productId) {
    //   this.listChange.next();
    // }
  }

  getList() {
    return this.productService
      .getProductGalleries(this.productId)
      //.pipe(shareReplay());
  }



  async openCropper() {
    const result = <string | null>(
      await this.cropperDialogService.open(this.aspectRatio)//.then(x=>this.addImage(x))
    );
    if (result) this.addImage(result);
  }

  addImage(base64Image: string) {
    const item: ProductGalleryDTO = {
      id: 0,
      imageName: base64Image,
      productId: this.productId,
    };
    this.productService
      .addGallery(item)
      .subscribe((res) => this.listChange.next(0));
  }

  deleteItem(id: number) {
    this.productService
      .deleteGallery(id)
      .subscribe((res) => this.listChange.next(1));
  }
}

// model$: Observable<any>;

// ngAfterViewInit() {
//   let click$ = fromEvent(this.refreshBtn.nativeElement, 'click')
//   this.model$ = click$.pipe(startWith(0),
//   switchMap(_=> {
//      return this.changeTransferActionsService
//     .getActionsWithNotesById(this.model.id)
//     .pipe(
//       map((x) => x.result),
//     );
//   }));
// }

//   subject = new BehaviorSubject(0);
// this.model$ = this.subject.asObservable().pipe(
//       // startWith(0),
//       switchMap(() => this.changeTransferActionsService
//         .getActionsWithNotesById(this.model.id)
//         .pipe(
//           map((x) => x.result)
//         )));

// subject = new Subject();
// this.model$ = this.subject.asObservable().pipe(
//   startWith(0),
//   switchMap(() => this.changeTransferActionsService
//     .getActionsWithNotesById(this.model.id)
//     .pipe(
//       map((x) => x.result)
//     )));
