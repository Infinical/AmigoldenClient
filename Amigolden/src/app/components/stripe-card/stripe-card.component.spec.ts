import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCardComponent } from './stripe-card.component';

describe('StripeCardComponent', () => {
  let component: StripeCardComponent;
  let fixture: ComponentFixture<StripeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
