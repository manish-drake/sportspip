import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRosterComponent } from './add-roster.component';

describe('AddRosterComponent', () => {
  let component: AddRosterComponent;
  let fixture: ComponentFixture<AddRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
