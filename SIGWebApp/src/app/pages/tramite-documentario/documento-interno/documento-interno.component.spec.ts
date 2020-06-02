import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoInternoComponent } from './documento-interno.component';

describe('DocumentoInternoComponent', () => {
  let component: DocumentoInternoComponent;
  let fixture: ComponentFixture<DocumentoInternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoInternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
