import { Component, OnInit, Input } from '@angular/core';
import { DetalleDocumento } from '@models/tramite/detalle-documento';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'documento-detalle',
  templateUrl: './documento-detalle.html',
  styleUrls: ['./documento-detalle.scss']
})
export class DocumentoDetalle implements OnInit {
  @Input() codigoDocumento: number;

  doc: DetalleDocumento;

  constructor(private api: TramiteService) {}

  ngOnInit() {
    this.doc = new DetalleDocumento();
    this.detalleDocumento();
  }

  detalleDocumento() {
    this.api
      .detalleDocumento(this.codigoDocumento)
      .subscribe(docs => {this.doc = docs[0]
        //console.log(JSON.stringify(this.doc))
      });
  }
}
