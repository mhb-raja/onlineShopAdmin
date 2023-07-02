import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, } from 'rxjs';
import { exhaustMap, map, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { AttribDTO, } from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { IKeyPair } from 'src/app/shared/interfaces/common';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';
import { DialogData } from 'src/app/shared/widgets/general-dialog/general-dialog.component';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';
import { helper } from 'src/app/Utilities/Helpers';

@Component({
  selector: 'app-attrib-edit',
  templateUrl: './attrib-edit.component.html',
  styleUrls: ['./attrib-edit.component.scss']
})
export class AttribEditComponent implements OnInit,OnDestroy, AfterViewInit {

  maxLenText = ConstMaxLengthText;
  myForm: FormGroup = null;

  //attribTypeListMap = new Map<number,string>();  
  attribTypeList:IKeyPair<number,string>[]=[];

  dbData: AttribDTO = null;  
  attrib$: Observable<AttribDTO>;
  

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,private router:Router,
    private dialogService: DialogService) { }

  ngOnDestroy(): void { }

  canDeactivate(): Promise<boolean> | boolean {    
    if (!this.dbData || 
      (this.dbData.title === this.title.value && this.dbData.typeId === this.typeId.value) ) {        
      return true;
    }
    return this.dialogService.askDiscardEdit();//.ask();
  }

  ngOnInit(): void {
    this.getAttribTypes();    
    this.getDetail();
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
    ).subscribe((res) => {      
      if (res){        
        this.dbData = null;
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    });
  }

  getAttribTypes() {
    this.productService.getAttribTypes().pipe(
      take(1),
      map(list=> list.forEach(item=>this.attribTypeList.push({key:item.id,value: item.title_Fa})))
      //map(list=> list.forEach(item=>this.attribTypeListMap.set(item.id,item.title_Fa)))      
    ).subscribe();


  }

  getDetail(){ 
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);   
    this.productService.getAttribDetail(id).subscribe(res=>{
      this.dbData=res;
      if(res) this.populateForm();
    });
  }

  populateForm() {
    this.myForm = new FormGroup({    
      title: new FormControl(this.dbData.title, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      typeId: new FormControl(this.dbData.typeId, [Validators.required])    
    });  
  }
 
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
      id: this.dbData.id,
      title:this.title.value,
      typeId: this.typeId.value 
    };
    return myData;
  }

  sendObject(data: AttribDTO): Observable<boolean> { 
    return this.productService.editAttrib(data).pipe(
      takeUntil(componentDestroyed(this))
    );
  }

}
