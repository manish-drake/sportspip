import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesDetailsComponent } from './coaches-details.component';

describe('CoachesDetailsComponent', () => {
  let component: CoachesDetailsComponent;
  let fixture: ComponentFixture<CoachesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
