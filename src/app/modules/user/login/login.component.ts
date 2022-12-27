import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  loggedInUserDTO,
  LoginDTO,
  UserDTO,
} from 'src/app/DTOs/Account/UserDTO';
import { AuthService } from 'src/app/services/auth.service';
import { cookieString } from 'src/app/Utilities/Security';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  maxLenText = 100; // email, password

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  myForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
      Validators.maxLength(this.maxLenText),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.maxLength(this.maxLenText),
    ]),
  });

  onSubmit() {
    if (this.myForm.valid) {
      const loginData = this.collectFormData();
      this.authService.loginUser(loginData).subscribe((res) => {
        this.processLoginResponse(res);
      });
    }
  }

  collectFormData(): LoginDTO {
    const loginData: LoginDTO = {
      email: this.myForm.controls.email.value,
      password: this.myForm.controls.password.value,
    };
    return loginData;
  }

  processLoginResponse(res: loggedInUserDTO) {
    if (res) {
      const currentUser: UserDTO = {
        id: res.id,
        email: res.email,
        firstname: res.firstname,
        lastname: res.lastname,
        address: res.address,
        mobile: res.mobile,
        password: null,
      };

      this.cookieService.set(cookieString, res.token, res.expireTime * 60);
      this.authService.setCurrentUser(currentUser);
      //is getCurrentUser necessary??
      this.myForm.reset();

      //??????????????start???????????????????????
      if (this.authService.redirectUrl) {
        // Set our navigation extras object
        // that passes on our global query params and fragment
        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true,
        };
        // Redirect the user
        this.router.navigate([this.authService.redirectUrl], navigationExtras);
        // this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        //this.router.navigateByUrl('/');
        this.router.navigate(['/']);
      }

      // Set our navigation extras object
      // that passes on our global query params and fragment
      // const navigationExtras: NavigationExtras = {
      //   queryParamsHandling: 'preserve',
      //   preserveFragment: true
      // };
      // // Redirect the user
      // this.router.navigate([this.authService.redirectUrl], navigationExtras);
      // this.router.navigate(['/']);
      //???????????????end?????????????????????
    }
  }
}
