import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { takeUntil, exhaustMap, map, tap, switchMap, shareReplay, throttleTime, } from 'rxjs/operators';
import { ValueDTO, ValueFullDetailDTO } from 'src/app/DTOs/category/ValueDTO';
import { ProductService } from 'src/app/services/product.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';
import { DialogService } from 'src/app/shared/widgets/general-dialog/dialog.service';
import { ConstMaxLengthText } from 'src/app/Utilities/Constants';

@Component({
  selector: 'app-value-edit',
  templateUrl: './value-edit.component.html',
  styleUrls: ['./value-edit.component.scss'],
})
export class ValueEditComponent implements OnInit, OnDestroy, AfterViewInit {
  
  maxLenText = ConstMaxLengthText;
  myForm: FormGroup = null;
  valueId: number;
  paramAttribId: number;

  paramId$: Observable<number>;
  objToEdit$: Observable<ValueFullDetailDTO>;
  objToEdit: ValueFullDetailDTO;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.objToEdit || 
      (this.objToEdit.title === this.valueTitle.value )){//&& this.objToEdit.attribId === this.attribId.value) ) {
      return true;
    }
    return this.dialogService.askDiscardEdit();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.paramId$ = this.activatedRoute.params.pipe(
      map(params=>parseInt(params.id)),
      takeUntil(componentDestroyed(this))
    );

    this.objToEdit$ = this.paramId$.pipe(
      switchMap(id => this.productService.getAttribValueDetail2(id)),
      tap(obj=> {
        if(obj) { 
          this.objToEdit = obj; 
          this.populateForm();
        }
      }),
      shareReplay(),
      takeUntil(componentDestroyed(this))
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
    ).subscribe((res) => {
      if (res){
        this.objToEdit = null;
        this.router.navigate(['../',{ foo: 'yes'}], { relativeTo: this.activatedRoute });
      }
    });
  }

  populateForm() {
    this.myForm = new FormGroup({
      valueTitle: new FormControl(this.objToEdit.title, [
        Validators.required,
        Validators.maxLength(this.maxLenText),
      ]),
      attribTitle: new FormControl({value: this.objToEdit.attribTitle, disabled:true}),      
    });
  }

  get valueTitle() {
    return this.myForm.get('valueTitle');
  }
  get attribTitle(){
    return this.myForm.get('attribTitle');
  }

  onSubmit(): void {
    if (!this.myForm.valid) this.myForm.markAsTouched();
  }

  createObject(): ValueDTO {
    const myData: ValueDTO = {
      id: this.objToEdit.id,
      title: this.valueTitle.value,
      attribId: this.objToEdit.attribId //this.attribId.value, 
    };
    return myData;
  }

  sendObject(data: ValueDTO): Observable<boolean> {
    return this.productService
      .editAttribValue(data)
      .pipe(takeUntil(componentDestroyed(this)));
  }
}
