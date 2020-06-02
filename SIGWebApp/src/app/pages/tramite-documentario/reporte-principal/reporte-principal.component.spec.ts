import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePrincipalComponent } from './reporte-principal.component';

describe('ReportePrincipalComponent', () => {
  let component: ReportePrincipalComponent;
  let fixture: ComponentFixture<ReportePrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
