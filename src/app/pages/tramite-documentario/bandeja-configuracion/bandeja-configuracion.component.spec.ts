import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BandejaConfiguracionComponent } from './bandeja-configuracion.component';

describe('BandejaConfiguracionComponent', () => {
  let component: BandejaConfiguracionComponent;
  let fixture: ComponentFixture<BandejaConfiguracionComponent>;

  beforeEach(waitForAsync(() => {
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
