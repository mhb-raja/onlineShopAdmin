import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IResponseResult, Status } from '../DTOs/common/IResponseResult';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure !!!!!!!!!!!!!!!!!
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.showSnackbar(`${operation} با خطا مواجه شد: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  redirectToNotFound<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.showSnackbar(`${operation} با خطا مواجه شد: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private showSnackbar(message: string, duration=5000) {
    this.snackBar.open(message, 'OK', { duration: duration });
    //this.messageService.add(`HeroService: ${message}`);
  }

  handleServerUnsuccess<T>(res: IResponseResult<T>, result?: T) {
    switch (res.eStatus) {
      case Status.NotFound:
        this.router.navigate(['/not-found']);
        console.log('after nav');
        return result;

      case Status.UnAuthorized:
        this.showSnackbar(res.message);
        this.router.navigate(['/login']);
        return result;

      default:
        console.log('default', res);
        this.showSnackbar(res.message);
        return result;
    }

    /*else if (res.status === 'AccessDenied') {
    //         // this.alertController.create({
    //         //   header: 'اخطار',
    //         //   message: 'شما به این بخش دسترسی ندارید',
    //         //   buttons: ['ok']
    //         // }).then(alertEl => {
    //         //   alertEl.present();
    //         //   this.router.navigate(['/products']);
    //         // });

    //       }
     */
  }
}
