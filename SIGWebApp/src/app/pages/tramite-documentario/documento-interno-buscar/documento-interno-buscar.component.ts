

// @Component({
//   selector: 'documento-interno-buscar',
//   templateUrl: './documento-interno-buscar.component.html',
//   styleUrls: ['./documento-interno-buscar.component.scss']
// })
// export class DocumentoInternoBuscarComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BandejaState } from '../states/bandeja.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BuscarBandeja } from '@models/tramite/bandeja-filtro';
import { MatButtonToggleChange } from '@angular/material';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BandejaInternoState } from '../states/bandeja-interno.state';

@Component({
  selector: 'documento-interno-buscar',
  templateUrl: './documento-interno-buscar.component.html',
   styleUrls: ['./documento-interno-buscar.component.scss']
})
export class DocumentoInternoBuscarComponent implements OnInit {
   @Emitter(BandejaInternoState.searchDocuments) 
   private searchDocs: Emittable<BuscarBandeja>;

  @Emitter(BandejaInternoState.setBandejaActiva)
  private setBandeja: Emittable<string>;

  @Select(BandejaInternoState.counts)
  public count$: Observable<any>;
  count={e:0,a:0,s:0};

  @Select(BandejaInternoState.bandejaActiva)
  public bandejaActiva$: Observable<string>;
  bandejaActiva:string;

  form: FormGroup;
  tipos = TIPOS_BUSQUEDA;
  @Output() filter = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.filterChange();
    this.count$.subscribe(c=>this.count=c);
    this.bandejaActiva$.subscribe(b=>this.bandejaActiva=b);
  }
  initForm() {
    // this.botonesBandeja = false;
    this.form = this.fb.group({
      filtro: [''],
      tipoBusqueda: [null],
      valorBusqueda: ['']
    });
  }

  filterChange() {
    this.form
      .get('filtro')
      .valueChanges.subscribe(val => this.filter.emit(val));
  }

  toggle() {
    // this.botonesBandeja=!this.botonesBandeja;
    this.form.patchValue({
      filtro: '',
      tipoBusqueda: null,
      valorBusqueda: ''
    });
  }
  search() {
    this.searchDocs.emit(this.form.value);
  }
  selectBandeja(e: MatButtonToggleChange){
    this.setBandeja.emit(e.source.value);
  }
}

const TIPOS_BUSQUEDA = [
  { id: 1, value: 'Código Doc. Interno'},
  { id: 2, value: 'Fecha Documento'},
  { id: 3, value: 'Fecha recepción'},
  { id: 4, value: 'Remitente'},
  { id: 5, value: 'Asunto'},
  { id: 6, value: 'N° de Expediente'},
  { id: 7, value: 'Destinatario'}
  
];