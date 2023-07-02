import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { exhaustMap, map, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { AttribDTO, AttribTypeDTO } from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { IKeyPair } from 'src/app/shared/interfaces/common';

@Component({
  selector: 'app-attrib-add',
  templateUrl: './attrib-add.component.html',
  styleUrls: ['./attrib-add.component.scss']
})
export class AttribAddComponent implements OnInit,OnDestroy, AfterViewInit {

  maxLenText = 100;
  //attribTypeListMap = new Map<number,string>();
  attribTypeList:IKeyPair<number,string>[]=[];

  constructor(private productService: ProductService,
    private router: Router) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.getAttribTypes();
    this.setupEventListeners();
  }

  ngAfterViewInit(): void {
    
  }
  private setupEventListeners() {    
    const btnSubmit = document.getElementById('btnSubmit');
      fromEvent(btnSubmit,'click').pipe(
        throttleTime(1000),
        exhaustMap(()=>this.sendObject(this.createObject())),
        takeUntil(componentDestroyed(this))
      ).subscribe();
  }

  getAttribTypes() {
    this.productService.getAttribTypes().pipe(
      take(1),
      map(list=> list.forEach(item=>this.attribTypeList.push({key:item.id,value: item.title_Fa})))
      // map(list=> list.forEach(item=>this.attribTypeListMap.set(item.id,item.title_Fa)))      
    ).subscribe();
  }
  
  myForm = new FormGroup({    
    title: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    typeId: new FormControl(null, [Validators.required])    
  });

  get title() {    
    return this.myForm.get('title');
  }
  get typeId() {    
    return this.myForm.get('typeId');
  }

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
  }

  createObject(): AttribDTO {    
    const myData: AttribDTO = {
      id: 0,
      title:this.myForm.controls.title.value,
      typeId: this.myForm.controls.typeId.value //this.selectedId,
    };
    return myData;
  }

  sendObject(data: AttribDTO): Observable<AttribDTO> { 
    return this.productService.addAttrib_returnId(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }
}
