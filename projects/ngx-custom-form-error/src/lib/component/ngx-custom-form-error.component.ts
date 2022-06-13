import { Component, ContentChild, Directive, ElementRef, Inject, InjectionToken, Input, OnInit, Optional, Pipe, PipeTransform } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { IErrorConfig } from '../error-config.model';
import { IError } from '../error.model';
import { CUSTOM_FORM_CONFIG } from '../injection-token';


@Directive({
  selector: "[cLabel]"
})
export class CustomFormControlLabelDirective {

  constructor(public el: ElementRef) {
  }
}

@Pipe({
  name: 'fromObject'
})
export class GetValuePipe implements PipeTransform {
  transform(item: string, messages: any): any {
    return messages[item];
  }
}

@Component({
  selector: 'c-form-error',
  templateUrl: 'ngx-custom-form-error.component.html',
  styleUrls: ['ngx-custom-form-error.component.scss']
})
export class NgxCustomFormErrorComponent {

  // Default config
  readonly ERROR_CLASS = 'c-control-error';
  readonly ERROR_TEXT_COLOR = '#ee3e3e';
  readonly ADD_ERROR_CLASS_TO_ELEMENT = true;
  readonly ON_TOUCHED_ONLY = false;

  constructor(@Inject(CUSTOM_FORM_CONFIG) @Optional() public config: IErrorConfig) {
  }

  @ContentChild(FormControlName) control!: FormControlName;
  @ContentChild(FormControlName, { read: ElementRef }) controlElement!: ElementRef;
  @ContentChild(CustomFormControlLabelDirective) labelRef!: CustomFormControlLabelDirective;

  /**Max Length count is used to show remaining letters in right hand side of form error area eg. [5 / 10] */
  @Input() maxLengthCount!: number;
  @Input('errorMessages') _messages: IError = <IError>{};
  /*
  User can pass one object of errormessages as well in stead of different input properties
   Eg  of errorMessages=>
    
    <c-form-control [errorMessages]="{required:'this field is required',maxLength:'Name should not exceed 10 characters'}"></c-form-control>"
  */

  @Input() required?: string | null;
  @Input() maxLength?: string | null;
  @Input() minLength?: string | null;
  @Input() min?: string | null;
  @Input() max?: string | null;
  @Input() email?: string | null;
  @Input() pattern?: string | null;
  @Input() requiredTrue?: string | null;
  @Input() nullValidator?: string | null;
  @Input() label?: string | null;

  /** If onTouchedOnly flag is on, we only show errors after the form is touched and has errors */
  @Input() onTouchedOnly!: boolean;
  @Input() addErrorClassToElement!: boolean;
  @Input() errorTextColor!: string;
  // This data is passed to functions passed in config object so that user can use the data in their own custom error messages
  @Input() data!: any;

  messages!: any; // Actuall its type is IError
  hasError$!: Observable<any>;
  messagesKeys!: string[]; // Actually it is [keyof IError][]

  ngAfterContentInit() {
    this.init();
    this.formatInputmessages();
    if (!this.messagesKeys.length) return;
    this.matchFormErrorsWithInputErrorMessages();
  }

  init() {
    this.onTouchedOnly = this.onTouchedOnly ?? this.config?.onTouchedOnly ?? this.ON_TOUCHED_ONLY;
    this.addErrorClassToElement = this.addErrorClassToElement ?? this.config?.addErrorClassToElement ?? this.ADD_ERROR_CLASS_TO_ELEMENT;
    this.errorTextColor = this.errorTextColor ?? this.config?.errorTextColor ?? this.ERROR_TEXT_COLOR;
    this.initmessages();
  }

  initmessages() {
    // In this method we populate _message object from the input properties and  and glogal config.
    const init = (properties: Array<keyof IError>) => {
      properties.forEach(property => {

        // We created self object from this keyboard just for making it work in any tsconfig file. If we didn't create self object it would not work in some config
        let self = this as {
          [key: string]: any;
          _messages: any;
          config: { [key: string]: any; };
          labelRef: CustomFormControlLabelDirective;
        };
        /*Readable form of code for property='required' for the code below with replacing self with this
        if (this.required ||| this.required===null) {
            this._messages['required'] = this.required;
            this.priority = false;
        } else if (this.config?.required) {
           if (this.config?.required instanceof Function) {
            let configFn = this.config?.required as Function;
            this._messages.required = this._messages.required ?? configFn(this.data);
          } else {
            this._messages.required = this._messages.required ?? this.config?.required as string;
          }
       }*/

        // We are using this syntax.. so that we do not need to repeat this same line of code for all the input properties 
        if (self[`${property}`] || self[`${property}`] === null) {
          self._messages[`${property}`] = self[`${property}`];
        } else if (self.config && self.config[`${property}`]) {
          if (self.config[`${property}`] instanceof Function) {
            let configFn = self.config[`${property}`] as Function;
            self._messages[`${property}`] = self._messages[`${property}`] ?? configFn(this.labelRef ? self.labelRef.el.nativeElement.textContent : this.label, this.data);
          } else {
            self._messages[`${property}`] = self._messages[`${property}`] ?? self.config[`${property}`] as string;
          }
        }
      });
    };

    init(['required', 'email', 'max', 'maxLength', 'min', 'minLength', 'nullValidator', 'pattern', 'requiredTrue']);
  }

  /** We need to make all the keys of errorMessages to be lowerCase for further processing. This is what we do in this function */
  formatInputmessages() {
    try {
      this.messages = <IError>{};
      for (let [key, value] of Object.entries(this._messages)) {
        this.messages[key.toLocaleLowerCase()] = value;
      }
      this.messagesKeys = Object.keys(this.messages);
    } catch {
      this.messagesKeys = [];
    }
  }


  hasTwoObjectsSameProps(x: Object, y: Object): boolean {
    let xProp: string[], yProp: string[];
    try {
      xProp = Object.getOwnPropertyNames(x);
    } catch {
      xProp = [];
    }
    try {
      yProp = Object.getOwnPropertyNames(y);
    } catch {
      yProp = [];
    }
    if (xProp.length !== yProp.length) return false;
    return xProp.every((prop: string) => yProp.includes(prop));
  }

  matchFormErrorsWithInputErrorMessages() {
    // This observable is used to look any errors when the form is touched. This stream emits `true` at the start
    // if `this.onTouchOnly=false` and will only emit `true` after the control is touched if `this.onTouchOnly=true`.
    const touched$ = new Observable<boolean>((subscribe => {
      if (this.onTouchedOnly) {
        this.control.valueAccessor?.registerOnTouched(() => subscribe.next(true));
      } else {
        subscribe.next(true);
      }
    })).pipe(distinctUntilChanged());

    this.hasError$ = combineLatest([touched$, this.control.statusChanges!]).pipe(
      switchMap(() => of(this.control.errors)),
      tap(errors => {
        if (!this.addErrorClassToElement) return;
        // adding error class on the element
        console.log(errors);
        if (errors) {
          this.controlElement.nativeElement.classList.add(this.ERROR_CLASS);
        } else {
          this.controlElement.nativeElement.classList.remove(this.ERROR_CLASS);
        }
      }),
      distinctUntilChanged((x, y) => this.hasTwoObjectsSameProps(x as Object, y as Object)),
      switchMap(_ => {
        let errorObj = this.messagesKeys.reduce((acc, key) => {
          acc[key] = this.control.errors ? this.control.errors[key] : null;
          return acc;
        }, <any>{});
        return Object.keys(errorObj).some(value => errorObj[value]) ? of(errorObj) : of(null);
      }),
    ) as Observable<any>;
  }


}
