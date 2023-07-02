import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-general-dialog',
  templateUrl: './general-dialog.component.html',
  styleUrls: ['./general-dialog.component.scss']
})
export class GeneralDialogComponent  {

  constructor(private dialogRef: MatDialogRef<GeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }    

    onNoClick() {
      this.dialogRef.close(false);
    }
}

//------------------------------------

export class DialogData {
  constructor(public bodyText: string,
    public title: string ='هشدار',    
    public yesText: string='بله',
    public noText: string ='انصراف'
  ) { }  
}

// export class DialogData {
//   constructor(public bodyText: string,
//     public title: string ='هشدار',    
//     public yesText: string='بله',
//     public noText: string ='انصراف'
//   ) { 
//     //this.Title= title??'هشدار';
//   }
//   // Title: string;
//   // YesText: string;
//   // NoText: string;
//   // BodyText: string;
// }
//--------------------
// interface IBox {    
//   x : number;
//   y : number;
//   height : number;
//       width : number;
// }
  
// class Box {
//   public x: number;
//   public y: number;
//   public height: number;
//   public width: number;

//   constructor();
//   constructor(obj: IBox); 
//   constructor(obj?: IBox) {    
//       this.x = obj?.x ?? 0
//       this.y = obj?.y ?? 0
//       this.height = obj?.height ?? 0
//       this.width = obj?.width ?? 0;
//   }   
// }