import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoacheslistComponent } from './coacheslist.component';

describe('CoacheslistComponent', () => {
  let component: CoacheslistComponent;
  let fixture: ComponentFixture<CoacheslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoacheslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoacheslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
