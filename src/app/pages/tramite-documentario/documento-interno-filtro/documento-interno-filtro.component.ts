import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';

import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { Observable } from 'rxjs';
import { BandejaFiltro } from '../../../@models/tramite/bandeja-filtro';
import { TramiteService } from '../tramite-documentario.service';
import { AuthService } from '../../../@core/auth/auth.service';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';
import { TwoPicker } from '../../../@shared/two-picker/two-picker';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';

@Component({
  selector: 'documento-interno-filtro',
  templateUrl: './documento-interno-filtro.component.html',
  styleUrls: ['./documento-interno-filtro.component.scss'],
})
export class DocumentoInternoFiltroComponent implements OnInit {
  //usuariosBandejas: Observable<BuzonesUsuario[]>;
  //Ahora se usa la variable listabuzones en vez de usuarioBandejas
  buzonActual!: BuzonesUsuario;
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

  loaded!: Boolean;
  @Select(BandejaInternoState.loaded)
  public loaded$!: Observable<Boolean>;

  bandejaf!: BandejaFiltro;
  @Select(BandejaInternoState.bandejaFiltro)
  public bandejaf$!: Observable<BandejaFiltro>;

  listaBuzones!: BuzonesUsuario[];
  @Select(BandejaInternoState.listaBuzones)
  public listaBuzones$!: Observable<BuzonesUsuario[]>;

  externos: string = '';
  @Select(BandejaInternoState.externos)
  public externos$!: Observable<string>;

  @Emitter(BandejaInternoState.loadDocuments)
  private loadDocs!: Emittable<BandejaFiltro>;

  @Emitter(BandejaInternoState.setBuzonActual)
  private setBuzonActual!: Emittable<BuzonesUsuario>;

  @Emitter(DocumentoInternoState.setDocument)
  private setDocument!: Emittable<{
    documento: DocumentoInterno;
    vista: string;
  }>;
  public dateTimeRange!: Date[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: TramiteService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // objeto en el status es this.listaBuzones$, posee un método llamado suscribe
    // se ejecuta cada vez cada vez que el valor de listabuzon cambie en el status
    // => funciones anónimas
    //lista es un nombre q se da para refrenciar al dato q esta dentro de la memoria
    this.listaBuzones$.subscribe((lista) => (this.listaBuzones = lista));
    this.buzonActual$.subscribe((b) => (this.buzonActual = b));
    //cada vez q cambia el valor de listabuzones en la memoria hace q mi variable local listaMemoria apunte a ese valor
    //this.bandejaf = new BandejaFiltro();
    // Sascando copia modificamos esa copia y despues vamos a volver a mandarle para q actualize las bandejas
    this.bandejaf$.subscribe((b) => (this.bandejaf = { ...b }));
    this.externos$.subscribe((e) => (this.externos = e));
    this.dateTimeRange = [this.bandejaf.fechaInicio, this.bandejaf.fechaFin];
    this.loaded$.subscribe((l) => {
      if (!l) this.loadDocs.emit(this.bandejaf);
    });
    this.actualizar();
  }

  changeFecha(fechas: TwoPicker) {
    this.bandejaf.fechaInicio = fechas.fechaInicio;
    this.bandejaf.fechaFin = fechas.fechaFin;
  }

  changeBuzon() {
    this.setBuzonActual.emit(this.buzonActual);
    this.actualizar();
  }

  actualizar() {
    this.loadDocs.emit(this.bandejaf);
  }

  private navigate(url: any) {
    this.router.navigate([`../${url}`], { relativeTo: this.route });
  }

  documentoNuevoInterno() {
    this.navigate('documento-interno-nuevo');
    const doc = new DocumentoInterno();
    this.setDocument.emit({ documento: doc, vista: 'bandeja-nuevo' });
  }
  openExternos() {
    this.navigate('bandeja');
  }
  //#endregion
}
