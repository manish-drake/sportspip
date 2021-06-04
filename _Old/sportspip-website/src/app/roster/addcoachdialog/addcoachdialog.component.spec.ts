import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcoachdialogComponent } from './addcoachdialog.component';

describe('AddcoachdialogComponent', () => {
  let component: AddcoachdialogComponent;
  let fixture: ComponentFixture<AddcoachdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcoachdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcoachdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
