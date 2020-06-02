import { Destinatario } from '@models/tramite/destinatario';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'destinatario-buscar',
  templateUrl: './destinatario-buscar.component.html',
  styleUrls: ['./destinatario-buscar.component.scss']
})
export class DestinatarioBuscarComponent implements OnInit {
  tipoBusqueda = 2;
  porNombre = 1;
  @Output() para = new EventEmitter<Destinatario[]>();
  @Output() conCopia = new EventEmitter<Destinatario[]>();
  constructor() {}
  ngOnInit() {}
  destinatariosPara(destinatarios: Destinatario[]) {
    this.para.emit(destinatarios);
  }
  destinatariosConCopia(destinatarios: Destinatario[]) {
    this.conCopia.emit(destinatarios);
  }
}
