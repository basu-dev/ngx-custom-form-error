import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-custom-form-error-test';
  constructor(private fb: FormBuilder) { }
  form!: FormGroup;
  MAX_LENGTH: number = 20;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [, [Validators.required, Validators.maxLength(this.MAX_LENGTH),
      Validators.minLength(5)
      ]],

      password: [, [Validators.required, Validators.minLength(5),
      Validators.pattern(/[a-z]+-[a-z]+/)
      ]]
    });
  }
}
