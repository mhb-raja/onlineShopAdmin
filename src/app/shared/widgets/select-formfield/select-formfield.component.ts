import { Component, Input, OnInit } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { IKeyPair } from '../../interfaces/common';
import { MatFormFieldAppearance } from '@angular/material/form-field';



@Component({
  selector: 'app-select-formfield',
  template: `
    <mat-form-field [appearance]="appearance">
      <mat-label>{{ label }}</mat-label>




      <mat-select [formControl]="control" *ngIf="multiple" multiple>
        <mat-option >{{ defaultOptionText }}</mat-option>
        <mat-option *ngFor="let item of options" [value]="item.key" > {{item.value }}</mat-option>
      </mat-select>

      <mat-select [formControl]="control" *ngIf="!multiple">
        <mat-option >{{ defaultOptionText }}</mat-option>
        <mat-option *ngFor="let item of options" [value]="item.key" > {{item.value }}</mat-option>
      </mat-select>


      <mat-error *ngIf="control.hasError('required')">
        انتخاب {{ label }} <strong>الزامی</strong> است
      </mat-error>
    </mat-form-field>
  `,
  //styleUrls: ['./select-formfield.component.scss']
})
export class SelectFormfieldComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.options, this.control.value)
    //if (this.value){ this.control.setValue(this.value);  console.log(this.value)  }
  }

  @Input() label: string;
  //@Input() listMap: Map<number | boolean, string>;
  // @Input() value?: any;
  @Input() defaultOptionText: string = 'همه';
  @Input() options : IKeyPair<number | boolean, string>[];
  @Input() appearance? : MatFormFieldAppearance = 'outline';
  @Input() multiple? : boolean = false;
  
  control: FormControl;
  @Input('control') set f(value: AbstractControl) {
    this.control = value as FormControl;
  }

  compareItems(o1: any, o2: any) {
    //console.log(object1,object1.key,object2, object2.key)
    return o1 && o2 ? o1.key === o2.key : o1 === o2;
  }

}

/**
 *       <mat-select [formControl]="control">
        <mat-option >{{ defaultOptionText }}</mat-option>
        <mat-option *ngFor="let item of options" [value]="item.key" > {{item.value }}</mat-option>
      </mat-select>
 * 
 * 
 * 
 * <mat-select [formControl]="control" >
        <mat-option [value]="null">{{ defaultOptionText }}</mat-option>
        <mat-option
          *ngFor="let item of listMap | keyvalue"
          [value]="item.key"
          >{{item.value }}</mat-option
        >
      </mat-select>
 */
/**
 * function compareFn(v1: SelectItem, v2: SelectItem): boolean {
    return v1 && v2 ? v1.value === v2.value : v1 === v2;
  }
 */

//[compareWith]="compareItems"