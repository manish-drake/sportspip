import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDeleteComponent } from './coach-delete.component';

describe('CoachDeleteComponent', () => {
  let component: CoachDeleteComponent;
  let fixture: ComponentFixture<CoachDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
