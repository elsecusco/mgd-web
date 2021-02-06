import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitenteUpdateAddComponent } from './remitente-update-add.component';

describe('RemitenteUpdateAddComponent', () => {
  let component: RemitenteUpdateAddComponent;
  let fixture: ComponentFixture<RemitenteUpdateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitenteUpdateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitenteUpdateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
