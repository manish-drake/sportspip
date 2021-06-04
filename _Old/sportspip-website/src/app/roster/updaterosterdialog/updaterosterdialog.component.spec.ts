import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdaterosterdialogComponent } from './updaterosterdialog.component';

describe('UpdaterosterdialogComponent', () => {
  let component: UpdaterosterdialogComponent;
  let fixture: ComponentFixture<UpdaterosterdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdaterosterdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdaterosterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
