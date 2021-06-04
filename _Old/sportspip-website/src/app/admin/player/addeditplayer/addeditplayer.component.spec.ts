import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditplayerComponent } from './addeditplayer.component';

describe('AddeditplayerComponent', () => {
  let component: AddeditplayerComponent;
  let fixture: ComponentFixture<AddeditplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
