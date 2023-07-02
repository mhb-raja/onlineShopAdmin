import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';

@Component({
  selector: 'app-input-formfield',
  template: 
    `
      <mat-form-field [appearance]="appearance" >
        <mat-label>{{label}}</mat-label>      
        <input matInput #input [formControl]="control" [type]="type" [readonly]="disabled">
        <button *ngIf="clearable && input.value" matSuffix mat-icon-button aria-label="Clear" (click)="closeClicked()">
            <mat-icon>close</mat-icon>
        </button>
        <mat-hint *ngIf="showHint && maxLength" align="end">{{input.value.length}} از {{maxLength}}</mat-hint>
        <mat-error *ngIf="control.hasError('required')">
            وارد کردن {{label}} <strong>الزامی</strong> است
        </mat-error>
        <mat-error *ngIf="control.hasError('maxlength')">
            تعداد کاراکترها نمیتواند بیشتر از {{maxLength}} باشد
        </mat-error>
      </mat-form-field>
    `,
    //styles:['.mat-form-field{max-width:200px;}']
  //styleUrls: ['./input-formfield.component.scss']
})
export class InputFormfieldComponent {// implements OnInit{
  // ngOnInit(): void {
    
  //   if(this.value)
  //     this.control.setValue(this.value);
  //   //console.log(this.control.value,this.value)
  // }

  //@Input() control: AbstractControl
  @Input() label : string;
  @Input() maxLength? : number = ConstMaxLengthText;
  @Input() clearable : boolean = false;
  @Input() value? : any;
  @Input() disabled? :boolean = false;
  @Input() appearance? : MatFormFieldAppearance = 'fill';
  @Input() type? = 'text';
  @Input() showHint? = true;
  

  control: FormControl;
  @Input('control') set f(value:AbstractControl)
  {
    this.control = value as FormControl    
  }

  closeClicked(){ this.control.setValue('')} // (click)="input.value=''" , was in html
}
