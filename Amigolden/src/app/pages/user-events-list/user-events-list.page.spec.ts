import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsListPage } from './user-events-list.page';

describe('UserEventsListPage', () => {
  let component: UserEventsListPage;
  let fixture: ComponentFixture<UserEventsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEventsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
