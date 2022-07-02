import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, Inject, Input, Optional } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { CustomFormControlLabelDirective } from '../custom-form-label.directive';
import { hasTwoObjectsSameProps } from '../helper';
import { CUSTOM_FORM_CONFIG } from '../injection-token';
import { IError, IErrorConfig } from '../ngx-custom-form-error.model';
@Component({
  selector: 'c-form-error',
  templateUrl: 'ngx-custom-form-error.component.html',
  styleUrls: ['ngx-custom-form-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxCustomFormErrorComponent {
  private _destroy$ = new Subject<void>();

  private defaultConfig = {
    errorClass: 'c-control-error',
    errorTextColor: '#ee3e3e',
    addErrorClassToElement: true,
    onTouchedOnly: false
  };

  constructor(@Inject(CUSTOM_FORM_CONFIG) @Optional() public config: IErrorConfig) { }

  @ContentChild(FormControlName) control!: FormControlName;
  /** This input `controlElement` is just for adding errorClass to the native element if config has addErrorClassToElement set to true*/
  @ContentChild(FormControlName, { read: ElementRef }) controlElement!: ElementRef;
  /** This input labelRef, is used to grab label from innerText of the element that has `cLabel` directive. */
  @ContentChild(CustomFormControlLabelDirective) labelRef!: CustomFormControlLabelDirective;

  @Input() required?: string | null;
  @Input('maxLength') maxlength?: string | null;
  @Input('minLength') minlength?: string | null;
  @Input() min?: string | null;
  @Input() max?: string | null;
  @Input() email?: string | null;
  @Input() pattern?: string | null;

  /** If onTouchedOnly flag is on, we only show errors after the form is touched and has errors */
  @Input() onTouchedOnly!: boolean;
  /** It adds error class to the form-control element which you can use to style the element */
  @Input() addErrorClassToElement!: boolean;
  /** Color of the error message */
  @Input() errorTextColor!: string;
  /**Max Length count is used to show remaining letters in right hand side of form error area eg. [5 / 10] */
  @Input() maxLengthCount!: number;
  /** `label` input can give label for the form error as input property in case `cLabel` directive is not used.  */
  @Input() label?: string | null;

  errors$!: Observable<null | string[]>;

  private messages!: IError;
  private errorClass!: string;

  ngAfterContentInit() {
    this.init();
    this.errors$ = this.getErrors();
  }

  init() {
    this.onTouchedOnly = this.onTouchedOnly ?? this.config?.onTouchedOnly ?? this.defaultConfig.onTouchedOnly;
    this.addErrorClassToElement = this.addErrorClassToElement ?? this.config?.addErrorClassToElement ?? this.defaultConfig.addErrorClassToElement;
    this.errorTextColor = this.errorTextColor ?? this.config?.errorTextColor ?? this.defaultConfig.errorTextColor;
    this.errorClass = this.config?.errorClass ?? this.defaultConfig.errorClass;
    this.label = this.label ?? this.labelRef?.el.nativeElement.innerText ?? undefined;
    this.initmessages();
  }

  /*** We compose messages object from user inputs and global config here, which will use to show the error */
  initmessages() {
    // We are checking for undefined because input property can be null if user don't want to show error that is configured 
    // in the global config.
    this.messages = {
      required: this.required !== undefined ? this.required : this.config?.required,
      min: this.min !== undefined ? this.min : this.config?.min,
      max: this.max !== undefined ? this.max : this.config?.max,
      minlength: this.minlength !== undefined ? this.minlength : this.config?.minLength,
      maxlength: this.maxlength !== undefined ? this.maxlength : this.config?.maxLength,
      email: this.email !== undefined ? this.email : this.config?.email,
      pattern: this.pattern !== undefined ? this.pattern : this.config?.pattern
    };
  }

  getErrors() {
    const touched$ = new Observable<boolean>((subscribe => {
      // If onTouchedOnly is `true` the observable emits `true` only after the element is touched
      if (this.onTouchedOnly) {
        // Thsee are use to trigger if the input is marked as touched
        this.control.valueAccessor?.registerOnTouched(() => subscribe.next(true));
        this.control.valueChanges?.pipe(takeUntil(this._destroy$)).subscribe(() => this.control.touched ? subscribe.next(true) : null);
      } else {
        // If onTouchedOnly is `false` the observable emits `true` so as to start looking for error rightaway
        subscribe.next(true);
      }
    })).pipe(distinctUntilChanged());

    return combineLatest([touched$, this.control.statusChanges!]).pipe(
      switchMap(() => of(this.control.errors)),
      tap(errors => {
        if (!this.addErrorClassToElement) return;
        // if config has addErrorClassToElement set to true, we set the errorClass to the element thas has `formControlName` directive.
        if (errors) {
          this.controlElement.nativeElement.classList.add(this.errorClass);
        } else {
          this.controlElement.nativeElement.classList.remove(this.errorClass);
        }
      }),
      // This observable will emit everytime we input on the element. And a simple distinctUntilChanged will not work
      // since it will emit either `null` or `error object` with same properties. But two objects cannot be same
      // so I have used `hasTwoObjectsSameProps` to stop emitting if the error object has same properties (meaning it is same ) as previous one.
      distinctUntilChanged((x, y) => hasTwoObjectsSameProps(x as Object, y as Object)),
      map((errorObj: any) => {

        if (!errorObj) return [];

        let errors = Object.keys(errorObj).map(key => {

          let errorKey = key as keyof IError;

          if (!this.messages[errorKey]) return;

          if (typeof this.messages[errorKey] == 'string') {
            return this.messages[errorKey];
          } else {
            let errorFn = this.messages[errorKey] as Function;
            return errorFn(this.label, errorObj[errorKey]);
          }

        });
        // This to eliminate array of undefined and nulls
        return errors.filter(error => error);
      })
    ) as Observable<string[]>;
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
