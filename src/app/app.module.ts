import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';


import { Interceptor } from './Utilities/Interceptor';
import { HeroesComponent } from './modules/heroes/heroes/heroes.component';
import { HeroSearchComponent } from './modules/heroes/hero-search/hero-search.component';
import { MessageModule } from './shared/widgets/message/message.module';
import { SharedModule } from './shared/shared.module';
import { ErrorHandlerService } from './services/error-handler.service';
import { MatTestComponent } from './modules/mat-test/mat-test.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { HelperService } from './services/helper.service';




@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroSearchComponent,
    MatTestComponent,
    LoginComponent,RegisterComponent, 
    NotFoundComponent, 
  ],
  imports: [
    
    BrowserModule,    
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    
    //MaterialModule,
SharedModule,

    MessageModule,
    AppRoutingModule,  
  ],
  providers: [
    //SliderService,
    ErrorHandlerService,
    HelperService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
