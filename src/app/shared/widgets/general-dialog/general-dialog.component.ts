import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-general-dialog',
  templateUrl: './general-dialog.component.html',
  styleUrls: ['./general-dialog.component.scss']
})
export class GeneralDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
    

    ngOnInit(): void {
      console.log(this.data);
      
    }
    onNoClick() {
      this.dialogRef.close(false);
    }

}

export class DialogData {
  constructor(public title: string,
    public bodyText: string,
    public yesText: string,
    public noText: string
  ) { }
  // title: string;
  // yesText: string;
  // noText: string;
  // bodyText: string;
}
