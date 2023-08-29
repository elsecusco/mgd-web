import { Component, OnInit } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DocumentoMesaState } from '../state/documento-mesa.state';
import { DocumentoMesa } from '@models/documento-mesa';

@Component({
  selector: 'mesa-nuevo',
  templateUrl: './mesa-nuevo.component.html',
  styleUrls: ['./mesa-nuevo.component.scss']
})
export class MesaNuevoComponent implements OnInit {
  codigoDocumento = 0;//Probar codigo de documento q existe

  @Emitter(DocumentoMesaState.setDocument)
  private setDocument: Emittable<{
    documento: DocumentoMesa;
  }>;

  doc: DocumentoMesa = new DocumentoMesa();
  @Select(DocumentoMesaState.documento)
  public doc$: Observable<DocumentoMesa>;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.doc$.subscribe(d => {
                this.doc = d;
                this.codigoDocumento=this.doc.codigoDocumentoTramite;
              });
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    const doc = new DocumentoMesa();
    this.setDocument.emit({ documento: doc});
  }
  derivar() {
    //emitir documentovacio
    this.router.navigate(['../documento-Mesa'], { relativeTo: this.route });
  }
}
