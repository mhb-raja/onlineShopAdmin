import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { DefaultComponent } from './layouts/default/default.component';
import { MaterialModule } from './material/material.module';
import { DefaultModule } from './layouts/default/default.module';
import { SliderService } from './services/slider.service';
import { Interceptor } from './Utilities/Interceptor';
import { HeroesComponent } from './modules/heroes/heroes/heroes.component';
import { HeroSearchComponent } from './modules/heroes/hero-search/hero-search.component';
import { MessageModule } from './shared/widgets/message/message.module';
import { SharedModule } from './shared/shared.module';
import { ErrorHandlerService } from './services/error-handler.service';
import { MatTestComponent } from './modules/mat-test/mat-test.component';
import { TreeComponent } from './modules/test/tree/tree.component';
import { NgExampleComponent } from './modules/test/ng-example/ng-example.component';
import { NgDynamicExampleComponent } from './modules/test/ng-dynamic-example/ng-dynamic-example.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    HeroesComponent,
    HeroSearchComponent,
    MatTestComponent,
    TreeComponent,
    NgExampleComponent,
    NgDynamicExampleComponent,
    LoginComponent,RegisterComponent, DashboardComponent,NotFoundComponent
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    MaterialModule,
    DefaultModule,
    //SharedModule
    MessageModule,
    AppRoutingModule,  
  ],
  providers: [
    SliderService,
    ErrorHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
