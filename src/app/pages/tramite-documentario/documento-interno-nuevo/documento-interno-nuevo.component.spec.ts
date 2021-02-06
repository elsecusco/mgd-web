import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoNuevoComponent } from './documento-interno-nuevo.component';

describe('DocumentoInternoNuevoComponent', () => {
  let component: DocumentoInternoNuevoComponent;
  let fixture: ComponentFixture<DocumentoInternoNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
