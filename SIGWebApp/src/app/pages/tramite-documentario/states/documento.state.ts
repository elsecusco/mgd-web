import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';

import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { of } from 'rxjs';

export interface DocumentoStateModel {
  documento: BandejaDocumento;
  vista: string;
}
type DocumentoAction = EmitterAction<{
  documento: BandejaDocumento;
  vista: string;
}>;
type Context = StateContext<DocumentoStateModel>;

const defaultStateDocumento = {
  documento: new BandejaDocumento(),
  vista: ''
};

@State<DocumentoStateModel>({
  name: 'documento',
  defaults: defaultStateDocumento
})
export class DocumentoState {
  constructor() {}

  @Selector()
  static documento(state: DocumentoStateModel) {
    return state.documento;
  }

  @Selector()
  static leido(state: DocumentoStateModel) {
    return state.documento.leido;
  }

  @Selector()
  static vista(state: DocumentoStateModel) {
    return state.vista;
  }

  @Receiver()
  public static setDocument(ctx: Context, action: DocumentoAction) {
    const documento = action.payload.documento;
    const vista = action.payload.vista;
    ctx.patchState({ documento, vista });
  }
}
