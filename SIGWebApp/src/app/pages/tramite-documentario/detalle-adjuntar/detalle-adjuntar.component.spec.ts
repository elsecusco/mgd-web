import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAdjuntarComponent } from './detalle-adjuntar.component';

describe('DetalleAdjuntarComponent', () => {
  let component: DetalleAdjuntarComponent;
  let fixture: ComponentFixture<DetalleAdjuntarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAdjuntarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAdjuntarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
