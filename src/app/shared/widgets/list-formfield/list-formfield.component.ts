import { Component, Input, OnInit } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-list-formfield',
  template: `
    <mat-selection-list color="primary" [(ngModel)]="selectedList">
      <mat-list-option *ngFor="let item of listMap | keyvalue" [value]="item.key" >
        {{ item.value }}
      </mat-list-option>
    </mat-selection-list>

    <mat-selection-list color="primary" [formControl]="control">
      <mat-list-option *ngFor="let item of listMap | keyvalue" [value]="item.key" >
        {{ item.value }}
      </mat-list-option>
    </mat-selection-list>
  `,
  styleUrls: ['./list-formfield.component.scss'],
})
export class ListFormfieldComponent implements OnInit {
  @Input() listMap: Map<number | boolean, string>;
  selectedList: any;

  control: FormControl;
  @Input('control') set f(value: AbstractControl) {
    this.control = value as FormControl;
  }

  constructor() {}

  ngOnInit(): void {}
}
