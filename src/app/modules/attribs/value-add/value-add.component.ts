import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { take, debounceTime, exhaustMap, takeUntil, map, tap } from 'rxjs/operators';
import { AttribDTO, AttribMiniDTO, AttribTypeDTO } from 'src/app/DTOs/category/AttribDTO';
import { ValueDTO } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-value-add',
  templateUrl: './value-add.component.html',
  styleUrls: ['./value-add.component.scss']
})
export class ValueAddComponent implements OnInit, OnDestroy {
  
  maxLenText = 100;
  submitClicks$=new Subject();
  attribs$:Observable<AttribMiniDTO[]>;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void { }


  ngOnInit(): void { 
    this.activatedRoute.params.pipe(
      map((params) => parseInt(params.attribId)),      
      tap(id=>{ this.myForm.get('attribId').setValue(id)}),      
      takeUntil(componentDestroyed(this))
    ).subscribe();
    
    this.attribs$=this.productService.getAttribsList().pipe(
      take(1)
    );
    this.submitClicks$.pipe(
      debounceTime(400),
      exhaustMap(()=>this.sendNew(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe();
  }

  myForm = new FormGroup({    
    title: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    attribId: new FormControl(null, [Validators.required])    
  });

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      this.submitClicks$.next();
      // const obj = this.createObject();
      // this.sendNew(obj);
    }
  }

  createObject(): ValueDTO {    
    const myData: ValueDTO = {
      id: 0,
      title:this.myForm.controls.title.value,
      attribId: this.myForm.controls.attibId.value //this.selectedId,
    };
    return myData;
  }

  sendNew(data: ValueDTO): Observable<ValueDTO> { 
    return this.productService.addAttribValue_returnId(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }

}
