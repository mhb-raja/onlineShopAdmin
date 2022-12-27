import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { CookieService } from 'ngx-cookie-service';
import { cookieString } from 'src/app/Utilities/Security';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit,OnDestroy {
  unreadCommentsCount$: Observable<number>;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    console.log('init default');
    this.authService.checkAdminAuth().pipe(
      tap(res => this.authService.setCurrentUser(res)),      
      takeUntil(componentDestroyed(this))
    ).subscribe();
    this.unreadCommentsCount$ = this.productService.getUnreadCommentsCount();
  }

  logout() {
    console.log('logging out');

    // this.authService.logOutUser().subscribe((res) => {
    //   if (res) {
    //     console.log('user has signed out');
    //     this.cookieService.delete(cookieString);
    //     this.authService.setCurrentUser(null);
    //     this.router.navigate(['/']);
    //   }
    // });

    this.cookieService.delete(cookieString);
    this.authService.setCurrentUser(null);    
    this.router.navigate(['/login']);    
  }
}


