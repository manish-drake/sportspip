import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachUpdateComponent } from './coach-update.component';

describe('CoachUpdateComponent', () => {
  let component: CoachUpdateComponent;
  let fixture: ComponentFixture<CoachUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
