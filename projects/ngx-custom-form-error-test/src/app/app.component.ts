import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngx-custom-form-error-test';
  constructor(private fb: FormBuilder) { }
  form!: FormGroup;
  MAX_LENGTH: number = 20;

  ngOnInit(): void {
    this.form = this.fb.group({
      foodName: [, [Validators.required, Validators.maxLength(this.MAX_LENGTH)
      ]],

      category: [, [Validators.required, Validators.maxLength(this.MAX_LENGTH)
      ]],
      starRating: [, [Validators.required, Validators.max(5)]],
      password: [, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [, [Validators.required]]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
  }
}

function mustMatch(arg0: string, arg1: string): any {
  return (group: FormGroup) => {
    let password = group.controls[arg0];
    let confirmPassword = group.controls[arg1];
    if (password.value !== confirmPassword.value) {
      return confirmPassword.setErrors({ mustMatch: true });
    }
    return null;
  };
}

