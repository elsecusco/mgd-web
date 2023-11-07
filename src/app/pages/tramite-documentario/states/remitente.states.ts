import { Injectable } from '@angular/core';
import { State, StateContext, Selector, Action } from '@ngxs/store';

export interface RespuestaRemitente {
  id: number;
  idItem: string;
  mensaje: string;
}
export interface RespuestaRemitenteStateModel {
  respuesta: RespuestaRemitente[];
}
export class ActualizarRemitente {
  static readonly type = '[RespuestaRemitente] actualizarRemitente';
  constructor(public readonly payload: RespuestaRemitente[]) {}
}
const defaultStateRespuestaRemitente = {
  respuesta: [],
};

@State<RespuestaRemitenteStateModel>({
  name: 'respuestaRemitente',
  defaults: defaultStateRespuestaRemitente,
})
@Injectable()
export class RespuestaRemitenteState {
  @Action(ActualizarRemitente)
  actualizarRemitente(ctx: StateContext<RespuestaRemitenteStateModel>, action: ActualizarRemitente) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      respuesta: action.payload
    })

  }
}
