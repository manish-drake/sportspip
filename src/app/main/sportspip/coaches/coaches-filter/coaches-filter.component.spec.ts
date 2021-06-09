import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesFilterComponent } from './coaches-filter.component';

describe('CoachesFilterComponent', () => {
  let component: CoachesFilterComponent;
  let fixture: ComponentFixture<CoachesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
