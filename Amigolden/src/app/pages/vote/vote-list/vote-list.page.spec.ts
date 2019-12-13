import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteListPage } from './vote-list.page';

describe('VoteListPage', () => {
  let component: VoteListPage;
  let fixture: ComponentFixture<VoteListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
