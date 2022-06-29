import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgxCustomFormErrorComponent } from "./component/ngx-custom-form-error.component";
import { CustomFormControlLabelDirective } from "./custom-form-label.directive";
import { CUSTOM_FORM_CONFIG } from "./injection-token";
import { IErrorConfig } from "./ngx-custom-form-error.model";

@NgModule({
  declarations: [
    NgxCustomFormErrorComponent,
    CustomFormControlLabelDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxCustomFormErrorComponent,
    CustomFormControlLabelDirective
  ]
})
export class NgxCustomFormErrorModule {
  private static config: IErrorConfig;

  static rootConfig(config: IErrorConfig): ModuleWithProviders<NgxCustomFormErrorModule> {
    if (NgxCustomFormErrorModule.config) throw new Error("NgxCustomFormErrorModule.rootConfig() method cannot be called more than once in an application. Use NgxCustomFormErrorModule.childConfig() method if you want to pass extra configuration.");
    NgxCustomFormErrorModule.config = config;
    return {
      ngModule: NgxCustomFormErrorModule,
      providers: [{
        provide: CUSTOM_FORM_CONFIG,
        useValue: config
      }
      ]
    };
  }

  static childConfig(config: IErrorConfig): ModuleWithProviders<NgxCustomFormErrorModule> {
    return {
      ngModule: NgxCustomFormErrorModule,
      providers: [{
        provide: CUSTOM_FORM_CONFIG,
        useValue: { ...NgxCustomFormErrorModule.config, ...config }
      }
      ]
    };
  }

}