import { Destinatario } from '@models/tramite/destinatario';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { DestinatarioFiltroComponent } from '../destinatario-filtro/destinatario-filtro.component';

@Component({
  selector: 'destinatario-buscar-interno',
  templateUrl: './destinatario-buscar-interno.component.html',
  styleUrls: ['./destinatario-buscar-interno.component.scss']
})
export class DestinatarioBuscarInternoComponent implements OnInit {

  @ViewChild(DestinatarioFiltroComponent) filtro:DestinatarioFiltroComponent;
  tipoBusqueda = 2;
  porNombre = 1;
  @Output() para = new EventEmitter<Destinatario[]>();
  
  private _matLabel: string;
  private _onlyOne: boolean=false;
  private _blacklist: string = '';
  
  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }
  
  @Input()
  set onlyOne(onlyOne: boolean) {
    this._onlyOne = onlyOne || false;
  }
  get onlyOne(): boolean {
    return this._onlyOne;
  }

  @Input()
  set blacklist(blacklist: string) {
    this._blacklist = blacklist || '';
  }
  get blacklist(): string {
    return this._blacklist;
  }

  constructor() {}
  ngOnInit() {}
  destinatariosPara(destinatarios: Destinatario[]) {
    this.para.emit(destinatarios);
  }
  clearAll(){
    this.filtro.removeAll();
  }
  setDefault(destinatarioDefault:Destinatario){
    this.filtro.setDefault(destinatarioDefault)
  }
}
