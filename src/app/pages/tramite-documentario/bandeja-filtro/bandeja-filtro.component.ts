import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';

import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BandejaState } from '../states/bandeja.state';
import { Observable } from 'rxjs';

import { TwoPicker } from '@shared/two-picker/two-picker';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { DocumentoState } from '../states/documento.state';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { TramiteService } from '../tramite-documentario.service';
import { AuthService } from '@core/auth/auth.service'; 

@Component({
  selector: 'bandeja-filtro',
  templateUrl: './bandeja-filtro.component.html',
  styleUrls: ['./bandeja-filtro.component.scss']
})
export class BandejaFiltroComponent implements OnInit {

  //usuariosBandejas: Observable<BuzonesUsuario[]>;
  //Ahora se usa la variable listabuzones en vez de usuarioBandejas
  
  loaded: Boolean;
  @Select(BandejaState.loaded)
  public loaded$: Observable<Boolean>;

  bandejaf: BandejaFiltro;
  @Select(BandejaState.bandejaFiltro)
  public bandejaf$: Observable<BandejaFiltro>;

  listaBuzones: BuzonesUsuario[];
  @Select(BandejaState.listaBuzones)
  public listaBuzones$: Observable<BuzonesUsuario[]>;

  buzonActual: BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;
  
  internos:number;
  @Select(BandejaState.internos)
  public internos$: Observable<number>;
  

  @Emitter(BandejaState.loadDocuments)
  private loadDocs: Emittable<BandejaFiltro>;

  @Emitter(BandejaState.setBuzonActual)
  private setBuzonActual: Emittable<BuzonesUsuario>;

  @Emitter(DocumentoState.setDocument)
  private setDocument: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;
  
  constructor(private router: Router, private route: ActivatedRoute,private api: TramiteService, private auth:AuthService) {}

  ngOnInit() {
    // objeto en el status es this.listaBuzones$, posee un método llamado suscribe
    // se ejecuta cada vez cada vez que el valor de listabuzon cambie en el status
    // => funciones anónimas
    //lista es un nombre q se da para refrenciar al dato q esta dentro de la memoria
    this.listaBuzones$.subscribe(lista => this.listaBuzones = lista);
    this.buzonActual$.subscribe(b => this.buzonActual = b);
    this.internos$.subscribe(i=>this.internos=i);
    //cada vez q cambia el valor de listabuzones en la memoria hace q mi variable local listaMemoria apunte a ese valor
    //this.bandejaf = new BandejaFiltro();
    // Sascando copia modificamos esa copia y despues vamos a volver a mandarle para q actualize las bandejas
    this.bandejaf$.subscribe(b => this.bandejaf = {...b} );

    this.loaded$.subscribe(l => {
      if (!l) this.loadDocs.emit(this.bandejaf);
     });
     this.actualizar();
   }
   changeFecha(fechas: TwoPicker) {
    this.bandejaf = { bandeja: this.bandejaf.bandeja, ...fechas };
  }
  /* changeFecha() {
    this.bandejaf.fechaInicio= this.dateTimeRange[0];
    this.bandejaf.fechaFin=this.dateTimeRange[1];
  } */

  changeBuzon(){
    this.setBuzonActual.emit(this.buzonActual);
    this.actualizar();
  }

  actualizar() {
    this.loadDocs.emit(this.bandejaf);
  }

  private navigate(url) {
    this.router.navigate([`../${url}`], { relativeTo: this.route });
  }
  
  documentoNuevo() {
    this.navigate('documento-nuevo');
    const doc = new BandejaDocumento();
    this.setDocument.emit({ documento: doc, vista: 'bandeja-nuevo' });
  }
  openInternos(){
    this.navigate('documento-interno');
  }
  //#endregion
}