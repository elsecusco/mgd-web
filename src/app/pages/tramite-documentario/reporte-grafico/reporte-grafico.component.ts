import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flecha } from '../../../@models/tramite/grafo-reporte';
import { PlacementTypes, StyleTypes } from '@swimlane/ngx-charts';
import { Node } from '@swimlane/ngx-graph';

@Component({
  selector: 'reporte-grafico',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reporte-grafico.component.html',
  styleUrls: ['./reporte-grafico.component.scss'],
})
export class ReporteGraficoComponent implements OnInit {
  e!: Flecha;
  estadoLeyenda = true;
  estadoNodos = false;
  estadoMover = false;
  estadoZoom = false;
  colores = {
    1: '#b8622c',
    2: '#e69605',
    3: '#5fadde',
    P: '#1af00e', //"#0b643a",
    C: '#185175',
    A: '#de8852',
    F: '#c77c4e',
  };
  top: any = PlacementTypes.Top;
  tooltip: any = StyleTypes.tooltip;
  constructor(
    public dialogRef: MatDialogRef<ReporteGraficoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.e = this.data.flechas[0];
  }
  onClickFlecha(flecha: any) {
    this.e = flecha;
  }
  getColor(x: string | number) {
    switch (x) {
      case 1:
        return this.colores[1];
      case 2:
        return this.colores[2];
      case 3:
        return this.colores[3];
      case 'P':
        return this.colores.P;
      case 'F':
        return this.colores.F;
      case 'A':
        return this.colores.A;
      case 'C':
        return this.colores.C;
      default:
        return;
    }
  }
}
