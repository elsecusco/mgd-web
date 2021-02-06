import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaConfiguracionComponent } from './bandeja-configuracion.component';

describe('BandejaConfiguracionComponent', () => {
  let component: BandejaConfiguracionComponent;
  let fixture: ComponentFixture<BandejaConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
