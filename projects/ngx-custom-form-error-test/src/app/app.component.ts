import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      starRating: [, [Validators.required, Validators.max(5)]],
    });
  }
}
