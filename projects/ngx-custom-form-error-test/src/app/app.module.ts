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
        required: (label: string) => `${label} is required`,
        maxLength: (label: string, data: { requiredLength: number; }) =>
          `${label ?? 'It'} cannot exceed ${data.requiredLength} characters.`,
        max: (label: string, data: { max: number; }) =>
          `${label ?? 'It'} cannot be greater than ${data.max}.`
      }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

