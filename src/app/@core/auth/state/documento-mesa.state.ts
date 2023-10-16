import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DocumentoMesa } from '../../../@models/documento-mesa';
import { Injectable } from '@angular/core';

export interface DocumentoMesaStateModel {
  documento: DocumentoMesa;
  //vista: string;
}
type DocumentoAction = EmitterAction<{
  documento: DocumentoMesa;
  //vista: string;
}>;
type Context = StateContext<DocumentoMesaStateModel>;

const defaultStateDocumento = {
  documento: new DocumentoMesa()
  //vista: ''
};

@State<DocumentoMesaStateModel>({
  name: 'documentoMesa',
  defaults: defaultStateDocumento
})
@Injectable()
export class DocumentoMesaState {
  constructor() {}

  @Selector()
  static documento(state: DocumentoMesaStateModel) {
    return state.documento;
  }
  /*
  @Selector()
  static vista(state: DocumentoMesaStateModel) {
    return state.vista;
  } */

  @Receiver()
  public static setDocument(ctx: Context, action: DocumentoAction) {
    const documento = action.payload.documento;
  //  const vista = action.payload.vista;
    ctx.patchState({documento});
  }
}
