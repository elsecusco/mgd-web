import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionComponent } from './detalle-atencion.component';

describe('DetalleAtencionComponent', () => {
  let component: DetalleAtencionComponent;
  let fixture: ComponentFixture<DetalleAtencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAtencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
