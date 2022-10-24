import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs/operators';
import { SliderDTO } from 'src/app/DTOs/slider/SliderDTO';
import { SliderService } from 'src/app/services/slider.service';
import { DateRangeValidatorDirective } from 'src/app/shared/directives/date-range-validator.directive';
import { CropperDialogService } from 'src/app/shared/widgets/image-cropper/cropper-dialog.service';
import { helper } from 'src/app/Utilities/Helpers';
import { SliderImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-slider-edit',
  templateUrl: './slider-edit.component.html',
  styleUrls: ['./slider-edit.component.scss'],
})
export class SliderEditComponent implements OnInit {
  dbData: SliderDTO = null;
  myForm: FormGroup = null;

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
    private cropperDialogService: CropperDialogService
  ) {}

  ngOnInit(): void {
    this.dateMinimum = Date.now() - 86400000; //milliseconds of 24 hours. subtracted so that today be selectable
    this.getItemData();
  }

  getItemData() {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!, 10);
    this.sliderService.getSliderForEdit(id).subscribe((res) => {
      console.log(res);
      this.dbData = res;
      if (res) this.populateForm();
      else this.goBack();
    });
  }

  populateForm() {
    this.myForm = new FormGroup(
      {
        title: new FormControl(this.dbData.title, [
          Validators.required,
          Validators.maxLength(this.maxLenTitle),
        ]),
        link: new FormControl(this.dbData.link, [
          Validators.maxLength(this.maxLenLink),
        ]),
        description: new FormControl(this.dbData.description, [
          Validators.maxLength(this.maxLenDescription),
        ]),
        activeFrom: new FormControl(
          helper.getPersianDate(this.dbData.activeFrom),
          [Validators.required]
        ),
        activeUntil: new FormControl(
          helper.getPersianDate(this.dbData.activeUntil),
          null
        ),
        imageName: new FormControl(this.dbData.base64Image),
      },
      { validators: DateRangeValidatorDirective }
    );
  }

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      const slider = this.createObject();
      this.sendEdit(slider);
    }
  }

  createObject(): SliderDTO {
    const editedSlider: SliderDTO = {
      id: this.dbData.id,
      activeFrom: helper.getGeorgianDate(this.myForm.controls.activeFrom.value),
      activeUntil: helper.getGeorgianDate(
        this.myForm.controls.activeUntil.value
      ),
      description: this.myForm.controls.description.value,
      link: this.myForm.controls.link.value,
      title: this.myForm.controls.title.value,
      base64Image: this.myForm.controls.imageName.value,//this.selectedImage,
    };
    return editedSlider;
  }

  goBack() {
    this.location.back();
  }

  sendEdit(slider: SliderDTO) {
    this.sliderService.editSlider(slider).subscribe((res) => {
      if (res) this.goBack();
    });
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

  discardChangeImage() {
    this.selectedImage = null;
  }

  changeImage(event: any) {
    this.selectedImage = event;
    this.myForm.patchValue({ imageName: event });
  }
}
