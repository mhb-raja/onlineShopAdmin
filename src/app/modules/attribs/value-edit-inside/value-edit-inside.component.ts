import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, fromEvent } from 'rxjs';
import { take, exhaustMap, takeUntil, throttleTime } from 'rxjs/operators';
import { AttribMiniDTO, AttribDTO } from 'src/app/DTOs/category/AttribDTO';
import { ValueDTO } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';

@Component({
  selector: 'app-value-edit-inside',
  templateUrl: './value-edit-inside.component.html',
  styleUrls: ['./value-edit-inside.component.scss']
})
export class ValueEditInsideComponent implements OnInit {

  @Input() valueToEdit : ValueDTO = null;
  @Output() editResult = new EventEmitter<boolean>();

  maxLenText = ConstMaxLengthText;
  myForm: FormGroup = null;
  attribList$:Observable<AttribMiniDTO[]>;
  valueId:number;
  //dbData:ValueDTO;
  paramAttribId:number;
  attrib$:Observable<AttribDTO>;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void { }

  
  ngOnInit(): void {
    //this.paramAttribId = parseInt(this.activatedRoute.snapshot.paramMap.get('attribId')!);
    // this.activatedRoute.params.pipe(
    //   map((params) => parseInt(params.attribId)),      
    //   tap(id=>this.paramAttribId = id),      
    //   takeUntil(componentDestroyed(this))
    // ).subscribe();
    this.attrib$ = this.productService.getAttribDetail(this.valueToEdit.attribId);//(this.paramAttribId);

    // this.valueId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    // console.log(this.attribId,this.valueId);
    
    // this.productService.getAttribValueDetail(this.valueId).subscribe(res=>{
    //   this.dbData = res;
    //   if (res) this.populateForm();
    // });
    if(this.valueToEdit)  this.populateForm();
    this.attribList$ = this.productService.getAttribsList().pipe(
      take(1)
    );
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  private setupEventListeners() {    
    const btnSubmit = document.getElementById('btnSubmit');
    fromEvent(btnSubmit,'click').pipe(
      throttleTime(1000),
      exhaustMap(()=>this.sendObject(this.createObject())),
      takeUntil(componentDestroyed(this))
    ).subscribe(res=> {
      if(res)
        this.editResult.emit(true);
        //this.router.navigate(["../"], {relativeTo: this.activatedRoute})
      }
    );
  }

  populateForm() {
    this.myForm = new FormGroup({    
      title: new FormControl(this.valueToEdit.title, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      attribId: new FormControl(this.valueToEdit.attribId, [Validators.required])    
    });
    // this.myForm = new FormGroup({    
    //   title: new FormControl(this.dbData.title, [
    //     Validators.required,
    //     Validators.maxLength(this.maxLenText),
    //   ]),
    //   attribId: new FormControl(this.dbData.attribId, [Validators.required])    
    // });
  }
  get title() {    
    return this.myForm.get('title');
  }
  get attribId() {    
    return this.myForm.get('attribId');
  }

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();    
  }

  createObject(): ValueDTO {    
    const myData: ValueDTO = {
      id: this.valueToEdit.id,
      title:this.myForm.controls.title.value,
      attribId: this.myForm.controls.attribId.value //this.selectedId,
    };
    return myData;
  }

  sendObject(data: ValueDTO): Observable<boolean> { 
    return this.productService.editAttribValue(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }

  discard(){
    this.editResult.emit(false);
  }
}

