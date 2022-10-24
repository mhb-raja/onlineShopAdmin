import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SliderDTO } from 'src/app/DTOs/slider/SliderDTO';
import { SliderService } from 'src/app/services/slider.service';
import { DateRangeValidatorDirective } from 'src/app/shared/directives/date-range-validator.directive';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { helper } from 'src/app/Utilities/Helpers';

@Component({
  selector: 'app-slider-add',
  templateUrl: './slider-add.component.html',
  styleUrls: ['./slider-add.component.scss']
})
export class SliderAddComponent implements OnInit {
  aspectRatio=1.5;
  maxImageSize_kilos = 1000;
  maxLenTitle = 100;
  maxLenDescription = 1000;
  maxLenLink = 100;
  selectedImage = '';
  dateMinimum = null;

  constructor(
    private sliderService: SliderService,
    private cropperDialogService:CropperDialogService) { }

  ngOnInit(): void {
    this.dateMinimum = Date.now() - 86400000;//milliseconds of 24 hours. subtracted so that today be selectable    
  }

  myForm = new FormGroup({
    'imageName': new FormControl(null, [Validators.required]),// Validators.compose([Validators.required, MaxSizeValidator(this.maxImageSize_kilos * 10240)])],
    'title': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenTitle)]),
    'description': new FormControl(null, [Validators.maxLength(this.maxLenDescription)]),
    'activeFrom': new FormControl(null, [Validators.required]),
    'activeUntil': new FormControl(null),
    'link': new FormControl(null, [Validators.maxLength(this.maxLenLink)])
  }, { validators: DateRangeValidatorDirective });


  onSubmit(): void {
    if (!this.myForm.valid)
      this.myForm.markAsTouched();
    else {
      const slider = this.createObject();
      this.sendNew(slider);
    }
  }

  createObject(): SliderDTO {
    const sliderData: SliderDTO = {
      id: 0,
      activeFrom: helper.getGeorgianDate(this.myForm.controls.activeFrom.value),
      activeUntil: helper.getGeorgianDate(this.myForm.controls.activeUntil.value),
      description: this.myForm.controls.description.value,
      link: this.myForm.controls.link.value,
      title: this.myForm.controls.title.value,
      base64Image: this.selectedImage //this.myForm.controls.imageName.value
    };
    return sliderData;
  }

  sendNew(sliderData: SliderDTO) {
    this.sliderService.addSlider(sliderData).subscribe(res => {
      if (res)
        this.myForm.reset();
    });
  }

  async openCropper() {
    const result = <string | null>(
      await this.cropperDialogService.open(this.aspectRatio)
    );

    this.selectedImage = result;
    this.myForm.patchValue({
      imageName: result,
    });
  }

  changeImage(event: any) {
    this.selectedImage = event;
    this.myForm.patchValue({
      imageName: event
    });
    console.log(this.myForm.controls.imageName.value);

    //this.myForm.controls.imageName = event;

    //     this.form.controls.someControl.patchValue(someValue)

    // this.form.get('someControl').patchValue(someValue)
    //this.myForm.controls.imageName.patchValue(event);//this.myForm.controls.imageName.patchValue is not a function
    //this.myForm.controls.imageName.setValue(event);//this.myForm.controls.imageName.setValue is not a function

    //this.myForm.get('imageName').setValue(event);
  }


}
