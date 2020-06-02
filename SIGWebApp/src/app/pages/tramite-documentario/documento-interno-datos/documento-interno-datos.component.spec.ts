import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoDatosComponent } from './documento-interno-datos.component';

describe('DocumentoInternoDatosComponent', () => {
  let component: DocumentoInternoDatosComponent;
  let fixture: ComponentFixture<DocumentoInternoDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
