import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Flecha } from '@models/tramite/grafo-reporte';
import { Node } from '@swimlane/ngx-graph';
//import { ViewEncapsulation } from '@angular/compiler/src/core';

@Component({
  selector: 'reporte-grafico',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reporte-grafico.component.html',
  styleUrls: ['./reporte-grafico.component.scss']
})
export class ReporteGraficoComponent implements OnInit {
  e:Flecha;
  estadoLeyenda = true;
  estadoNodos = false;
  estadoMover = false;
  estadoZoom = false;
  colores = {1:"#b8622c",
                2:"#e69605",
                3:"#5fadde",
                P:"#0b643a",
                C:"#185175",
                A:"#de8852",
                F:"#c77c4e"}
constructor(public dialogRef: MatDialogRef<ReporteGraficoComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any){}

ngOnInit() {
  this.e=this.data.flechas[0];
}
onClickFlecha(flecha){
  this.e = flecha
}
}
