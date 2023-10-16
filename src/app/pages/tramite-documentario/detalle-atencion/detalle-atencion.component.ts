import { Component, OnInit, Inject } from '@angular/core';
// import { AtenderDocumento } from '@models/tramite/atender-documento';
import { TramiteService } from '../tramite-documentario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Destinatario } from '@models/tramite/destinatario';

@Component({
  selector: 'detalle-atencion',
  templateUrl: './detalle-atencion.component.html',
  styleUrls: ['./detalle-atencion.component.scss'],
})
export class DetalleAtencionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DetalleAtencionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
