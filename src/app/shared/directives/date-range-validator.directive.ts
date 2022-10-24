import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { helper } from 'src/app/Utilities/Helpers';

// @Directive({
//   selector: '[appDateRangeValidator]'
// })
// export class DateRangeValidatorDirective {

//   constructor() { }

// }
export const DateRangeValidatorDirective:
  ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const from = control.get('activeFrom');
    const until = control.get('activeUntil');

    const fromDate = helper.getGeorgianDate(from.value);
    const untilDate = helper.getGeorgianDate(until.value);

    // console.log(`dateRangeValidator getdate start: ${fromDate} --- end:${untilDate}`);

    return until.value && fromDate >= untilDate ? { wrongDateRange: true } : null;
    //return from && until && from.value === until.value ? { wrongDateRange: true } : null;
  }