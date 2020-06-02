import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternFormComponent } from './extern-form.component';

describe('ExternFormComponent', () => {
  let component: ExternFormComponent;
  let fixture: ComponentFixture<ExternFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
