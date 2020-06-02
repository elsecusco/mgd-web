import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentoInternoBuscarComponent } from './documento-interno-buscar.component';

describe('DocumentoInternoBuscarComponent', () => {
  let component: DocumentoInternoBuscarComponent;
  let fixture: ComponentFixture<DocumentoInternoBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
