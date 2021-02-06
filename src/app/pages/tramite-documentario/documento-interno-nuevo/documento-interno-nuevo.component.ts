import { Component, OnInit } from '@angular/core';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentoInterno } from '@models/tramite/documento-interno';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'documento-interno-nuevo',
  templateUrl: './documento-interno-nuevo.component.html',
  styleUrls: ['./documento-interno-nuevo.component.scss']
})
export class DocumentoInternoNuevoComponent implements OnInit {
  codigoDocumento = 0;//alli coloca un codigo de documento q existe
  tipoDocumento = 0;
  numeroValorizaciones = 0;
  @Emitter(DocumentoInternoState.setDocument)
  private setDocument: Emittable<{
    documento: DocumentoInterno;
    vista: string;
  }>;

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$: Observable<DocumentoInterno>;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.doc$.subscribe(d => {
                this.doc = d;
                this.codigoDocumento=this.doc.codigoDocumentoTramite;
              });
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    const doc = new DocumentoInterno();
    this.setDocument.emit({ documento: doc, vista: '' });
  }
  derivar() {
    //emitir documentovacio
    this.router.navigate(['../documento-interno'], { relativeTo: this.route });
  }
}
