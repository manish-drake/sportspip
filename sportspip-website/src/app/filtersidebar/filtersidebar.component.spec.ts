import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersidebarComponent } from './filtersidebar.component';

describe('FiltersidebarComponent', () => {
  let component: FiltersidebarComponent;
  let fixture: ComponentFixture<FiltersidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
