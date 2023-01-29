import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import * as moment from 'jalali-moment';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(
    message: string,
    action: string = 'OK',
    duration = 5000,
    verticalPorsition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'center'
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: verticalPorsition,
      horizontalPosition: horizontalPosition,
    });
  }

  getGeorgianDate(persianStringDate: string): Date {
    if (!persianStringDate) return null;

    const x = moment(persianStringDate, 'jYYYY/jM/jD HH:mm').format(
      'YYYY-M-D HH:mm:ss'
    );
    const y = moment
      .from(persianStringDate, 'fa', 'YYYY/M/D HH:mm')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');
    const w = moment
      .from(persianStringDate, 'fa', 'jYYYY/jM/jD HH:mm')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    return new Date(y);
  }

  getPersianDate(date: Date): string {
    if (!date) return '';

    return moment
      .from(date.toString(), 'en', 'YYYY-MM-DD HH:mm')
      .locale('fa')
      .format('YYYY-MM-DD HH:mm');
  }
}
