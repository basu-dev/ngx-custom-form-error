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
    NgxCustomFormErrorModule.rootConfig(<IErrorConfig>{
      onTouchedOnly: true,
      errorTextColor: 'var(--text-danger)',
      addErrorClassToElement: true,
      errorClass: 'control-error',
      email: 'Please enter a valid email',
      required: (label: string) => `${label ?? 'It'} is required`,
      pattern: (label: string) => `${label ?? 'It'} doesn't match required pattern.`,
      minLength: (label: string, data: { requiredLength: number; }) => `${label ?? 'It'} should contain at least ${data.requiredLength} characters.`,
      maxLength: (label: string, data: { requiredLength: number; }) => `${label ?? 'It'} cannot exceed more than ${data?.requiredLength} characters.`,
      min: (label: string, data: { min: number; }) => `${label ?? 'It'} should be greater than ${data.min}.`,
      max: (label: string, data: { max: number; }) => `${label ?? 'It'} cannot be greater than ${data?.max}.`,
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

