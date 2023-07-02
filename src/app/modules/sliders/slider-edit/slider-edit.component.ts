import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { exhaustMap, takeUntil, throttleTime } from 'rxjs/operators';
import { ValueFullDetailDTO } from 'src/app/DTOs/category/ValueDTO';
import { SliderDTO } from 'src/app/DTOs/slider/SliderDTO';
import { SliderService } from 'src/app/services/slider.service';
import { DateRangeValidatorDirective } from 'src/app/shared/directives/date-range-validator.directive';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { helper } from 'src/app/Utilities/Helpers';
import { SliderImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-slider-edit',
  templateUrl: './slider-edit.component.html',
  styleUrls: ['./slider-edit.component.scss'],
})
export class SliderEditComponent implements OnInit, OnDestroy {
  
  dbData: SliderDTO = null;
  myForm: FormGroup = null;

  objToEdit$: Observable<ValueFullDetailDTO>;
  
  maxImageSize_kilos = 1000;
  maxLenTitle = 100;
  maxLenDescription = 1000;
  maxLenLink = 100;
  selectedImage = null;

  dateMinimum = null;
  imagePath = SliderImagePath;
  aspectRatio = 1.5;



  constructor(
    private sliderService: SliderService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private cropperDialogService: CropperDialogService,
    private dialogService: DialogService,
    private router: Router,

  ) {}

  ngOnDestroy(): void {}

  canDeactivate(): Promise<boolean> | boolean {    
    if (!this.dbData || 
      (this.dbData.title === this.title.value && this.dbData.activeFrom === helper.getGeorgianDate(this.activeFrom.value )
        && this.dbData.activeUntil===helper.getGeorgianDate(this.activeUntil.value)) 
        && this.dbData.description ===this.description.value && this.dbData.link===this.link.value) {        
      return true;
    }
    return this.dialogService.askDiscardEdit();
  }

  ngOnInit(): void {
    this.dateMinimum = Date.now() - 86400000; //milliseconds of 24 hours. subtracted so that today be selectable
    //this.getItemData();
    this.getDetail();
  }

  getDetail(){   
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!, 10); 
    this.sliderService.getSliderForEdit(id).subscribe(res=>{
      this.dbData=res;
      if(res) this.populateForm();
      //else this.goBack();
    });
  }

  private setupEventListeners() {    
    const btnSubmit = document.getElementById('btnSubmit');    
    fromEvent(btnSubmit,'click').pipe(      
      throttleTime(1000),
      exhaustMap(() => this.sendObject(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe((res) => {      
      if (res){        
        this.dbData = null;
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    });
  }

  populateForm() {
    this.myForm = new FormGroup({
      title: new FormControl(this.dbData.title, [Validators.required, Validators.maxLength(this.maxLenTitle)]),
      link: new FormControl(this.dbData.link, [Validators.maxLength(this.maxLenLink),]),
      description: new FormControl(this.dbData.description, [Validators.maxLength(this.maxLenDescription),]),
      activeFrom: new FormControl(helper.getPersianDate(this.dbData.activeFrom), [Validators.required]),
      activeUntil: new FormControl( helper.getPersianDate(this.dbData.activeUntil), null),
      imageName: new FormControl(this.dbData.base64Image),
    },{ validators: DateRangeValidatorDirective });
  }

  get activeFrom() { return this.myForm.get('activeFrom');}
  get activeUntil() { return this.myForm.get('activeUntil');}
  get link() { return this.myForm.get('link');}
  get description() { return this.myForm.get('description');}
  get imageName() { return this.myForm.get('imageName');}
  get title() { return this.myForm.get('title');}

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();    
  }

  createObject(): SliderDTO {
    const editedSlider: SliderDTO = {
      id: this.dbData.id,
      activeFrom: helper.getGeorgianDate(this.myForm.controls.activeFrom.value),
      activeUntil: helper.getGeorgianDate(this.myForm.controls.activeUntil.value ),
      description: this.myForm.controls.description.value,
      link: this.myForm.controls.link.value,
      title: this.myForm.controls.title.value,
      base64Image: this.myForm.controls.imageName.value,//this.selectedImage,
    };
    return editedSlider;
  }

  sendObject(data: SliderDTO): Observable<boolean> { 
    return this.sliderService.editSlider(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }
  

  goBack() {
    this.location.back();
  }


  

  async openCropper() {
    const result = <string | null>(
      await this.cropperDialogService.open(this.aspectRatio)
    );
    if (result) {
      this.selectedImage = result;
      this.myForm.patchValue({
        imageName: result,
      });
    }
  }
  async openCropper2() {
    const result = <string | null>(
      await this.cropperDialogService.open2(this.aspectRatio)
    );
    if (result) {
      this.selectedImage = result;
      this.myForm.patchValue({
        imageName: result,
      });
    }
  }

  discardChangeImage() {
    this.selectedImage = null;
  }

  changeImage(event: any) {
    this.selectedImage = event;
    this.myForm.patchValue({ imageName: event });
  }
}
