import { Injector, Injectable } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver} from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TramiteService } from '../tramite-documentario.service';
import { PopupPendientes } from '../../../@models/tramite/popup-pendientes';

export interface PendienteStateModel {
    count:number;
    pendientes: PopupPendientes;
    loaded: boolean;
    loading: boolean;
}

type Context = StateContext<PendienteStateModel>;

const defaultStatePendiente = {
    count:0,
    pendientes: new PopupPendientes(),
    loaded: false,
    loading: false
};

@State<PendienteStateModel>({
    name: 'Pendiente',
    defaults: defaultStatePendiente
})
@Injectable()
export class PendienteState {
    private static api: TramiteService;

    constructor(injector: Injector) {
      PendienteState.api = injector.get<TramiteService>(TramiteService);
    }

    @Selector()
    static pendientes(state: PendienteStateModel) {
        return state.pendientes;
    }

    @Selector()
    static loading(state: PendienteStateModel) {
        return state.loading;
    }
    @Selector()
    static loaded(state: PendienteStateModel) {
        return state.loaded;
    }

    @Receiver({ cancelUncompleted: true })
    public static loadPendientes(ctx: Context) {
      const countL=ctx.getState().count +1;
      ctx.patchState({ loading: true});
    return this.api.getPendientes(countL).pipe(
      tap(pendientes => ctx.patchState({ pendientes, loaded: true, loading: false ,count:countL})),
      catchError(_err => {
        ctx.patchState(defaultStatePendiente);
        return of(new PopupPendientes());
      })
    );
  }
   @Receiver({ cancelUncompleted: true })
   public static clearCount(ctx: Context) {
   ctx.patchState({ count:0})
 }
}
