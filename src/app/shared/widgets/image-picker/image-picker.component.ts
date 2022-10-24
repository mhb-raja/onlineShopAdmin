import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  providers: [NgxImageCompressService]
})
export class ImagePickerComponent implements OnInit {

  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = true; // was false. correct later ??????????????????????????????
  compressedImage = '';

  constructor(
    //private platform: Platform,
    private imageCompress: NgxImageCompressService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngOnInit() {
    // if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
    //     this.usePicker = true;
    // }
  }

  onPickImage() {
    if (isPlatformBrowser(this.platformId)) {
      this.imageCompress.uploadFile().then(({ image, orientation }) => {
        this.imageCompress.compressFile(image, orientation, 50, 90).then(
          result => {
            this.compressedImage = result;
            this.selectedImage = result;
            this.imagePick.emit(this.compressedImage);
          }
        );
      });
      return;
    }
  }

  onFileChoosen(event) {

    const pickedFile = (event.target as HTMLInputElement).files[0];

    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      this.selectedImage = fr.result.toString();
      this.imagePick.emit(pickedFile);
    };

    fr.readAsDataURL(pickedFile);
  }


}
