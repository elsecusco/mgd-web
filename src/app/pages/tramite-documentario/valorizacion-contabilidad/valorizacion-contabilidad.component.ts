import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { GuardsCheckStart } from '@angular/router';
import { notifyOk, swalError } from '@core/swal';
import { BuscarContrato } from '@models/tramite/buscar-contrato';
import { ValorizacionDetalle } from '@models/tramite/valorizacion-detalle';
import { TramiteService } from '../tramite-documentario.service';
import { ValorizacionDetalleComponent } from '../valorizacion-detalle/valorizacion-detalle.component';

@Component({
  selector: 'valorizacion-contabilidad',
  templateUrl: './valorizacion-contabilidad.component.html',
  styleUrls: ['./valorizacion-contabilidad.component.scss']
})
export class ValorizacionContabilidadComponent implements OnInit {
  guardado = false;
  detalleContrato: BuscarContrato= new BuscarContrato();
  
  @ViewChild(MatTable) table: MatTable<any>;
  
  //valorizaciones:ValorizacionDetalle[]=[];
  columnas = ['serie','importe','hes', 'edit'];
  
  @Output() changeValorizaciones = new EventEmitter<number>();

  constructor(public dialog: MatDialog,private api: TramiteService) {  }

  ngOnInit() {
  }
  valorizacionDetalle(){
    const dialogRef = this.dialog.open( 
      ValorizacionDetalleComponent,{
        width: '850px',
        height: '90hv',
        data: {}
      });
        dialogRef.afterClosed().subscribe(result => {
          if (result)
            this.detalleContrato=result;
        //this.clear();
     });
  }
  nvaValorizacion:ValorizacionDetalle=new ValorizacionDetalle()
  
  addValorizacion(){
    //console.log(this.nvaValorizacion)
    if(this.nvaValorizacion.serie){
      this.detalleContrato.listValorizaciones.push(this.nvaValorizacion);
      this.table.renderRows();
      this.changeValorizaciones.emit(this.detalleContrato.listValorizaciones.length)
      this.nvaValorizacion=new ValorizacionDetalle()
    }
  }
  eliminar(i){
    this.detalleContrato.listValorizaciones.splice(i, 1);
    this.changeValorizaciones.emit(this.detalleContrato.listValorizaciones.length)
    this.table.renderRows();
  }
  editar(i){
    this.nvaValorizacion = this.detalleContrato.listValorizaciones[i];
    this.eliminar(i)
  }
  save(codigoDocumento){
    this.detalleContrato.codigoDocumento = codigoDocumento
    this.api.guardarValorizacionContabilidad(this.detalleContrato).subscribe(
      res => {
        if (res.id == 1) {
          notifyOk(res.mensaje);
          this.guardado = true;
        } else {
          swalError('Error al guardar valorizacion:', res.mensaje);
        }
      }
    );
    
  //  console.log(JSON.stringify(this.detalleContrato))
  }
}
