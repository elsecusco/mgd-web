import { Destinatario } from '@models/tramite/destinatario';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'destinatario-buscar-interno',
  templateUrl: './destinatario-buscar-interno.component.html',
  styleUrls: ['./destinatario-buscar-interno.component.scss']
})
export class DestinatarioBuscarInternoComponent implements OnInit {
  tipoBusqueda = 2;
  porNombre = 1;
  @Output() para = new EventEmitter<Destinatario[]>();
  
  private _matLabel: string;
  
  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }
  
  constructor() {}
  ngOnInit() {}
  destinatariosPara(destinatarios: Destinatario[]) {
    this.para.emit(destinatarios);
  }
}
