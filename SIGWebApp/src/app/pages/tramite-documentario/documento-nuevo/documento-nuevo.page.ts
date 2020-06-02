import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { DocumentoState } from '../states/documento.state';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { Select } from '@ngxs/store';
import { BandejaState } from '../states/bandeja.state';
import { Observable } from 'rxjs';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';

@Component({
  selector: 'documento-nuevo-page',
  templateUrl: './documento-nuevo.page.html',
  styleUrls: ['./documento-nuevo.page.scss']
})
export class DocumentoNuevoPage implements OnInit, OnDestroy {
  codigoDocumento = 0;
  loginUsuarioOrigen:string;

  bandejaf: BandejaFiltro;
  @Select(BandejaState.bandejaFiltro)
  public bandejaf$: Observable<BandejaFiltro>;

  buzonActual:BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;

  @Emitter(BandejaState.loadDocuments)
  private loadDocs: Emittable<BandejaFiltro>;

  @Emitter(DocumentoState.setDocument)
  private setDocument: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.bandejaf$.subscribe(b => this.bandejaf = b);
    this.buzonActual$.subscribe(b=>this.buzonActual=b);
  }
  
  ngOnDestroy() {
    const doc = new BandejaDocumento();
    doc.usuarioBuzon=this.buzonActual.loginUsuarioBuzon;
    this.setDocument.emit({ documento: doc, vista: '' });
  }

  derivar() {
    //emitir documentovacio
    this.loadDocs.emit(this.bandejaf);
    this.router.navigate(['../bandeja'], { relativeTo: this.route });
  }
}
