import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from './general-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogRef:any = null;
  constructor(private dialog: MatDialog) { }

  async open(data: DialogData, widthInPx: string='350px'): Promise<boolean | null>{
    const { GeneralDialogComponent } = await import(`./general-dialog.component`);
    this.dialogRef = await this.dialog.open(GeneralDialogComponent, {
      width: widthInPx,
      data: data,
    });    
    return await this.dialogRef.afterClosed().toPromise();
  }

  async removeConfirmDialog(message:string):Promise< boolean>{
    const result = <boolean | null>(
      await this.open(new DialogData(message))
    );
    if (result !== undefined && result === true){
      return true;
    }
    return false;
  }
//----------------------------------
  async askDiscardEdit(message:string='انصراف از تغییرات و بازگشت به جدول؟'){
    const result = <boolean | null>(
      await this.open(new DialogData(message,'','بله', 'ادامه ویرایش'))
    );
    if (result !== undefined && result === true){
      return true;
    }
    return false;  
  }

}
