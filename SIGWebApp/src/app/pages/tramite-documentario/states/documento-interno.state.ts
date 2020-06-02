import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DocumentoInterno } from '@models/tramite/documento-interno';

export interface DocumentoInternoStateModel {
  documento: DocumentoInterno;
  vista: string;
}
type DocumentoAction = EmitterAction<{
  documento: DocumentoInterno;
  vista: string;
}>;
type Context = StateContext<DocumentoInternoStateModel>;

const defaultStateDocumento = {
  documento: new DocumentoInterno(),
  vista: ''
};

@State<DocumentoInternoStateModel>({
  name: 'documentoInterno',
  defaults: defaultStateDocumento
})
export class DocumentoInternoState {
  constructor() {}

  @Selector()
  static documento(state: DocumentoInternoStateModel) {
    return state.documento;
  }

  @Selector()
  static leido(state: DocumentoInternoStateModel) {
    return state.documento.leido;
  }

  @Selector()
  static vista(state: DocumentoInternoStateModel) {
    return state.vista;
  }

  @Receiver()
  public static setDocument(ctx: Context, action: DocumentoAction) {
    const documento = action.payload.documento;
    const vista = action.payload.vista;
    ctx.patchState({ documento, vista });
  }
}
