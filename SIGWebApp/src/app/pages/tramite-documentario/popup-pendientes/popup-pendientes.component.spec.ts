import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPendientesComponent } from './popup-pendientes.component';

describe('PopupPendientesComponent', () => {
  let component: PopupPendientesComponent;
  let fixture: ComponentFixture<PopupPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
