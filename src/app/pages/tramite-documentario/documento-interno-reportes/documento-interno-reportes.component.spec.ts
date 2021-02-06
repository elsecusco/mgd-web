import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoReportesComponent } from './documento-interno-reportes.component';

describe('DocumentoInternoReportesComponent', () => {
  let component: DocumentoInternoReportesComponent;
  let fixture: ComponentFixture<DocumentoInternoReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
