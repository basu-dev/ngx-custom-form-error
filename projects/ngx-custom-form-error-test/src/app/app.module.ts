import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IErrorConfig, NgxCustomFormErrorModule } from 'ngx-custom-form-error';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCustomFormErrorModule
      .rootConfig(<IErrorConfig>{
        onTouchedOnly: true,
        addErrorClassToElement: true,
        email: 'Please enter a valid email',
        min: (label: string, data: { min: number; }) => label && data ? `${label} cannot be greater than ${data.min}.` : `${label} is too large.`,
        required: (label: string) => label ? `${label} is required` : `It is required`,
        pattern: (label: string) => label ? `${label} doesn't match required pattern.` : `Doesn't match required pattern`,
        minLength: (label: string, data: { requiredLength: number; }) => label && data ? `${label} should contain at least ${data.requiredLength} characters.` : `${label} doesn\'t match minimum length criteria.`,
        maxLength: (label: string, data: { requiredLength: number; }) => label && data ? `${label} cannot exceed more than ${data?.requiredLength} characters.` : `${label} doesn\'t match maximum length criteria.`
      })
    ,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

