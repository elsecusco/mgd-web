import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'documento-atencion-dialog',
  template: `
    <form [formGroup]="form" novalidate>
      <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
        <span>Atención Documento</span>
        <mat-checkbox formControlName="atencionFinal"
          ><span class="final">Es Atención Final</span></mat-checkbox
        >
      </div>

      <mat-divider class="mg-bot-8"></mat-divider>
      <div mat-dialog-content fxLayout="column" fxLayoutGap="8px">
        <mat-form-field appearance="outline" color="primary">
          <mat-label>Descripción de la Atención</mat-label>
          <textarea
            matInput
            placeholder="Ingrese Descripción..."
            formControlName="descripcionAtencion"
            rows="2"
          >
          </textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="guardarAtencion()">
          Guardar Atención
        </button>
        <button mat-button color="warn" mat-dialog-close cdkFocusInitial>
          Cancelar
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .mat-dialog-title {
        margin: 0;
      }
      mat-divider {
        margin-bottom: 16px !important;
      }
      .final {
        font-weight: 400;
        font-size: 16px;
      }
    `
  ]
})
export class DocumentoAtencionDialog implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentoAtencionDialog>
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      atencionFinal: [false, Validators.required],
      descripcionAtencion: ['', Validators.required]
    });
  }

  guardarAtencion() {
    this.dialogRef.close(this.form.value);
  }
}
