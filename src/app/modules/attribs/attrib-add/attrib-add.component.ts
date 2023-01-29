import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, exhaustMap, take, takeUntil, tap } from 'rxjs/operators';
import { AttribDTO, AttribTypeDTO } from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-attrib-add',
  templateUrl: './attrib-add.component.html',
  styleUrls: ['./attrib-add.component.scss']
})
export class AttribAddComponent implements OnInit,OnDestroy {

  maxLenText = 100;
  selectedId = -1;
  submitClicks$=new Subject();
  attribTypes$:Observable<AttribTypeDTO[]>;
  
  constructor(private productService: ProductService,
    private router: Router) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.attribTypes$=this.productService.getAttribTypes().pipe(
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
    typeId: new FormControl(null, [Validators.required])    
  });

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
    else {
      this.submitClicks$.next();
      // const obj = this.createObject();
      // this.sendNew(obj);
    }
  }

  createObject(): AttribDTO {
    console.log(this.myForm.controls.typeId.value,this.selectedId);
    const myData: AttribDTO = {
      id: 0,
      title:this.myForm.controls.title.value,
      typeId: this.myForm.controls.typeId.value //this.selectedId,
    };
    return myData;
  }

  // sendNew2(data: AttribDTO) {
  //   this.productService.addProduct(data).subscribe((res) => {
  //     if (res) this.router.navigate(['/products']); //this.myForm.reset();
  //   });
  // }
  sendNew(data: AttribDTO): Observable<AttribDTO> { 
    return this.productService.addAttrib_returnId(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }

  selectChanged(selectId){
    console.log(selectId);
    this.myForm.patchValue({ typeId: selectId });
    this.selectedId = selectId;
  }
}
