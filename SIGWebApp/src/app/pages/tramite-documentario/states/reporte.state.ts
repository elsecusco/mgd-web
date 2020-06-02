import { Injector } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ReporteFiltro } from "@models/tramite/reporte-filtro";
import { ReporteDocumento } from "@models/tramite/reporte-documento";
import { TramiteService } from '../tramite-documentario.service';

export interface ReporteStateModel {
    reporteFiltro: ReporteFiltro;
    documentos: ReporteDocumento[];
    loaded: boolean;
    pending: boolean;
}
type FiltroAction = EmitterAction<ReporteFiltro>;
type Context = StateContext<ReporteStateModel>;

const defaultStateReporte = {
    reporteFiltro: new ReporteFiltro(),
    documentos: [],
    loaded: false,
    pending: false
};

@State<ReporteStateModel>({
    name: 'reporte',
    defaults: defaultStateReporte
})
export class ReporteState {
    private static api: TramiteService;

    constructor(injector: Injector) {
      ReporteState.api = injector.get<TramiteService>(TramiteService);
    }
    @Selector()
    static reporteFiltro(state: ReporteStateModel) {
    return state.reporteFiltro;
    }

    // @Selector()
    // static usuario(state: ReporteStateModel) {
    //     return state.reporteFiltro.usuario;
    // }

    @Selector()
    static documentos(state: ReporteStateModel) {
        return state.documentos;
    }

    @Selector()
    static pending(state: ReporteStateModel) {
        return state.pending;
    }
    @Selector()
    static loaded(state: ReporteStateModel) {
        return state.loaded;
    }
    @Receiver({ cancelUncompleted: true })
    public static loadDocuments(ctx: Context, action: FiltroAction) {
        const reporteFiltro = action.payload;
        ctx.patchState({ reporteFiltro, pending: true });

        return this.api.getReporte(reporteFiltro).pipe(
        tap(documentos =>
            ctx.patchState({ documentos, loaded: true, pending: false })
        ),
        catchError(_err => {
            defaultStateReporte.reporteFiltro=reporteFiltro;
            ctx.patchState(defaultStateReporte);
            return of([]);
        })
        );
    }
}
