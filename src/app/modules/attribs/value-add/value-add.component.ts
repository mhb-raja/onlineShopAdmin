import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { take, exhaustMap, takeUntil, map, tap, flatMap, mergeMap, toArray, throttleTime } from 'rxjs/operators';
import { AttribDTO, AttribMiniDTO, AttribTypeDTO } from 'src/app/DTOs/category/AttribDTO';
import { ValueDTO } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { IKeyPair } from 'src/app/shared/interfaces/common';

import { ConstMaxLengthText } from 'src/app/Utilities/Constants';

@Component({
  selector: 'app-value-add',
  templateUrl: './value-add.component.html',
  styleUrls: ['./value-add.component.scss']
})
export class ValueAddComponent implements OnInit, OnDestroy, AfterViewInit {
  
  maxLenText = ConstMaxLengthText;  
  
  routeParamId : number = -1;
  attribList:IKeyPair<number,string>[]=[];
  //listMap = new Map<number,string>();


  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.activatedRoute.parent.params.pipe(
      map((params) => parseInt(params.attribId)),      
      tap(id => { 
        this.routeParamId = id; 
        this.attribId.setValue(id)
      }),      
      takeUntil(componentDestroyed(this))
    ).subscribe();
    
    this.getAttribsList();
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
//----------------------------------------------
  getAttribsList(){
    //let mylist:KeyPair<number,string>[]=[];
    this.productService.getAttribsList().pipe(
      take(1),
      map(x=> x.forEach(item=>this.attribList.push({key:item.id,value:item.title})))
      //map(x=> x.forEach(item=>this.listMap.set(item.id,item.title)))
      // mergeMap(x=>x),
      // map(item=>({key:item.id,value:item.title})),
      // toArray()

      //map(x=>x.forEach(item=>mylist.push({key:item.id,value:item.title})))
    ).subscribe(); 

  }
//----------------------------------------------
  myForm = new FormGroup({    
    title: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
    attribId: new FormControl(null, [Validators.required])    
  });

  get title() {    
    return this.myForm.get('title');
  }
  get attribId() {    
    return this.myForm.get('attribId');
  }
  //----------------------------------------------
  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();    
  }

  createObject(): ValueDTO { 
    console.log(this.attribId.value)   
    const myData: ValueDTO = {
      id: 0,
      title:this.title.value,
      attribId: this.attribId.value
    };
    return myData;
  }

  sendObject(data: ValueDTO): Observable<ValueDTO> { 
    return this.productService.addAttribValue_returnId(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }

}
