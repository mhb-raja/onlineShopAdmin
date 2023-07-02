import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-persian-datepicker-formfield',
  template: `
    <mat-form-field appearance="fill">
    <mat-label>{{label}}</mat-label>   
      <input matInput type="text" #input [formControl]="control" autocomplete="off" />
      <ng-persian-datepicker [input]="input" [uiTheme]="theme" [timeMeridian]="false"
          [dateMin]="dateMin" [dateInitValue]="initValueToday" [timeShowSecond]="false">
      </ng-persian-datepicker>
      <mat-icon matSuffix>calendar_today</mat-icon>
      <mat-error *ngIf="control.hasError('required')">
            وارد کردن {{label}} <strong>الزامی</strong> است
      </mat-error>      
    </mat-form-field>
  `,
  
})
export class PersianDatepickerFormfieldComponent implements OnInit {

  ngOnInit(): void {
  }

  @Input() label: string;

  @Input() theme: string = 'gray';
  @Input() initValueToday?: boolean = false;
  @Input() dateMin?: number;
  @Input() timeShowSecond? = false;
  @Input() timeMeridian? = false;

  control: FormControl;
  @Input('control') set f(value:AbstractControl)
  {
    this.control = value as FormControl    
  }
}
