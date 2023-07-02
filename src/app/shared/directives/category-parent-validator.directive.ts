// import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



//didn't work:
// export function categoryParentValidator2(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const val=control.value;
//     return val && val <= 0 ? { invalidParent: true } : null;
//   };
// }

/** Angular.io example
 *  A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

export const categoryParentValidator: 
  ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    return val && val <= 0 ? { invalidParent: true } : null;
};

