import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFiltroComponent } from './reporte-filtro.component';

describe('ReporteFiltroComponent', () => {
  let component: ReporteFiltroComponent;
  let fixture: ComponentFixture<ReporteFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
