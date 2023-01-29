import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { concatAll, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { AttribDatasourceDTO, AttribDTO } from 'src/app/DTOs/category/AttribDTO';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-attrib-search',
  templateUrl: './attrib-search.component.html',
  styleUrls: ['./attrib-search.component.scss']
})
export class AttribSearchComponent implements OnInit {  

  searchInput = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  //filteredOptions: Observable<string[]>;
  filteredOptions$: Observable<AttribDTO[]>;
  attribDS:AttribDatasourceDTO={
    items: [],
    pageSize: 100,
    pageIndex: 0,
    totalItems: 0,
    text:'',
    typeId:0
  }

  constructor(private productService:ProductService) { }

  ngOnInit() {
    // this.filteredOptions = this.searchInput.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );

    const inputStream$ = this.searchInput.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => this._filter(value)),
    );
    this.filteredOptions$ = of(this._filter(''), inputStream$).pipe(concatAll());
  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
  private _filter(value: string): Observable<AttribDTO[]> {
    this.attribDS.text=value;
    return this.productService.getFilteredAttributes(this.attribDS).pipe(
      map(res=>res.items)
    );
  }
  
  displayFn(attr: AttribDTO): string {
    return attr && attr.title ? attr.title : '';
  }

  optionSelected(event) {
    // // console.log('selected: ' + event, event.option, event.option.value);
    // // const x: attribSearchResult = { attrib: event.option.value, newText: null };
    // //console.log(event.option.value);

    // this.itemSelected.emit(event.option.value);
  }
}
