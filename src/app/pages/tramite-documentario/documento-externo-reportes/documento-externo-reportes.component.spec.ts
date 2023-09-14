import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoExternoReportesComponent } from './documento-externo-reportes.component';

describe('DocumentoExternoReportesComponent', () => {
  let component: DocumentoExternoReportesComponent;
  let fixture: ComponentFixture<DocumentoExternoReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoExternoReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoExternoReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
