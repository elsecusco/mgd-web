import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoDerivarComponent } from './documento-interno-derivar.component';

describe('DocumentoInternoDerivarComponent', () => {
  let component: DocumentoInternoDerivarComponent;
  let fixture: ComponentFixture<DocumentoInternoDerivarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoDerivarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoDerivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
