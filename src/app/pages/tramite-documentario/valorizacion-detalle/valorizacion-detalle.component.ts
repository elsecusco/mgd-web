import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTable, MAT_DIALOG_DATA , MatTableDataSource, MatPaginator, MatSort, MatDialog} from '@angular/material';
import { BuscarContrato } from '@models/tramite/buscar-contrato';
import { TwoPicker } from '@shared/two-picker/two-picker';
import { TramiteService } from '../tramite-documentario.service';


@Component({
  selector: 'valorizacion-detalle',
  templateUrl: './valorizacion-detalle.component.html',
  styleUrls: ['./valorizacion-detalle.component.scss']
})
export class ValorizacionDetalleComponent implements OnInit {
  
  datos: MatTableDataSource<BuscarContrato>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatTable) table: MatTable<BuscarContrato>;
    
  form: FormGroup;
  @ViewChild('f') f: any;
  searching: boolean;
  columnas: string[] = [
    'nombreProveedor',
    'numeroRuc',
    'descripcion',
    'numeroContrato',
    'fechaInicioFin',
    'montoContrato'    
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Proveedor',
    'Ruc',
    'Descripcion',
    'N° Contrato',
    'Fecha Inicio Fin',
    'Monto Contrato'
  ];
  //datos: BuscarContrato[] =[];
  constructor(public dialogRef: MatDialogRef<ValorizacionDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private api: TramiteService) { }
    
  ngOnInit() {
    this.initForm();
    
  }
  initForm() {
    // 500 dias atras
    const beforeDate = new Date(new Date().setDate(new Date().getDate() - 500));
    this.form = this.fb.group({
      porRazonSocial:[""],
      porRuc:[""],
      porDescripcionContrato:[""],
      porFechaInicio: [beforeDate, Validators.required],
      porFechaFin: [new Date(), Validators.required],
    });

  }
  buscarValorizacion(){
    this.searching = true;
    
      this.api.buscarContrato(this.form.value).subscribe(
      res => {
        this.datos = new MatTableDataSource<BuscarContrato>(res);
        this.datos.sort = this.sort;
        this.datos.paginator = this.paginator;
        this.searching = false;
      },
      _err => {
        this.searching = false
      });
  }
  selectedRow(row:BuscarContrato){
    row.listValorizaciones = []
    this.dialogRef.close(row);
    //console.log(JSON.stringify(row))
  }

  changeFecha(fechas: TwoPicker) {
    //console.log(fechas);
    this.form.value.porFechaInicio = fechas.fechaInicio;
    this.form.value.porFechaFin = fechas.fechaFin;
   }
}
