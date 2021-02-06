import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoFiltroComponent } from './documento-interno-filtro.component';

describe('DocumentoInternoFiltroComponent', () => {
  let component: DocumentoInternoFiltroComponent;
  let fixture: ComponentFixture<DocumentoInternoFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
