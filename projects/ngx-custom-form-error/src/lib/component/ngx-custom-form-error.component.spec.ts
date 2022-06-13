import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCustomFormErrorComponent } from './ngx-custom-form-error.component';

describe('NgxCustomFormErrorComponent', () => {
  let component: NgxCustomFormErrorComponent;
  let fixture: ComponentFixture<NgxCustomFormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCustomFormErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCustomFormErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
