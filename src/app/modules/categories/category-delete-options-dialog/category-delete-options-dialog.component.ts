import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CategoryToDeleteData {
  catTitle: string;
}

@Component({
  selector: 'app-category-delete-options-dialog',
  templateUrl: './category-delete-options-dialog.component.html',
  styleUrls: ['./category-delete-options-dialog.component.scss']
})
export class CategoryDeleteOptionsDialogComponent {

  selectedOption?: boolean = null;
  constructor( public dialogRef: MatDialogRef<CategoryDeleteOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryToDeleteData, ) {}

  onNoClick(): void {
    this.dialogRef.close(null);
  }
}
