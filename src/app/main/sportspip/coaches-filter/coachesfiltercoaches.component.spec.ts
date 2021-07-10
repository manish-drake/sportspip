import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesfiltercoachesComponent } from './coachesfiltercoaches.component';

describe('CoachesfiltercoachesComponent', () => {
  let component: CoachesfiltercoachesComponent;
  let fixture: ComponentFixture<CoachesfiltercoachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachesfiltercoachesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesfiltercoachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
