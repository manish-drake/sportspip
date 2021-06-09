import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsFilterComponent } from './teams-filter.component';

describe('TeamsFilterComponent', () => {
  let component: TeamsFilterComponent;
  let fixture: ComponentFixture<TeamsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
