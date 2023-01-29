import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { map, tap, takeUntil, take, debounceTime, exhaustMap } from 'rxjs/operators';
import { AttribMiniDTO } from 'src/app/DTOs/category/AttribDTO';
import { ValueDTO } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-value-edit',
  templateUrl: './value-edit.component.html',
  styleUrls: ['./value-edit.component.scss']
})
export class ValueEditComponent implements OnInit,OnDestroy {

  maxLenText = 100;
  myForm: FormGroup = null;
  submitClicks$=new Subject();
  attribs$:Observable<AttribMiniDTO[]>;
  valueId:number;
  dbData:ValueDTO;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void { }


  ngOnInit(): void {
    this.valueId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!,10);
    this.productService.getAttribValueDetail(this.valueId).subscribe(res=>{this.dbData=res;
    if(res) this.populateForm();});
    this.attribs$=this.productService.getAttribsList().pipe(
      take(1)
    );

    this.submitClicks$.pipe(
      debounceTime(400),
      exhaustMap(()=>this.sendObject(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe();
  }

  populateForm() {
    this.myForm = new FormGroup({    
      title: new FormControl(this.dbData.title, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      attribId: new FormControl(this.dbData.attribId, [Validators.required])    
    });
  }
 

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      this.submitClicks$.next();      
    }
  }

  createObject(): ValueDTO {    
    const myData: ValueDTO = {
      id: this.dbData.id,
      title:this.myForm.controls.title.value,
      attribId: this.myForm.controls.attibId.value //this.selectedId,
    };
    return myData;
  }

  sendObject(data: ValueDTO): Observable<boolean> { 
    return this.productService.editAttribValue(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }


}
