import { Injector } from '@angular/core';
import { State, StateContext, Selector } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { tap, catchError } from 'rxjs/operators';

import { TramiteService } from '../tramite-documentario.service';

import { BandejaFiltro, BuscarBandeja } from '@models/tramite/bandeja-filtro';
import { of } from 'rxjs';
import { BandejasInternas } from '@models/tramite/bandejas';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { Destinatario } from '@models/tramite/destinatario';

export interface BandejaInternoStateModel {
  bandejaFiltro: BandejaFiltro;
  bandejaBuscar: BuscarBandeja;
  listaBuzones: BuzonesUsuario[];
  destinatarioGerente: Destinatario;
  destinatarioJefe:Destinatario;
  buzonActual:BuzonesUsuario;
  bandejas:BandejasInternas;
  bandejaActiva: string;
  loaded: boolean;
  pending: boolean;
  externos:string;
}

type FiltroAction = EmitterAction<BandejaFiltro>;
type BuscarAction = EmitterAction<BuscarBandeja>;
type BandejaActivaAction = EmitterAction<string>;
type BuzonUsuarioAction = EmitterAction<BuzonesUsuario>;
type Context = StateContext<BandejaInternoStateModel>;

const defaultStateBandejaInterno = {
  bandejaFiltro: new BandejaFiltro(),
  bandejaBuscar: new BuscarBandeja(),
  listaBuzones:[],
  destinatarioGerente:null,
  destinatarioJefe:null,
  buzonActual:new BuzonesUsuario(),
  bandejas:new BandejasInternas(),
  bandejaActiva:'e',
  loaded: false,
  pending: false,
  externos:""
};

@State<BandejaInternoStateModel>({
  name: 'bandejaInterno',
  defaults: defaultStateBandejaInterno
})
export class BandejaInternoState {
  private static api: TramiteService;

  constructor(injector: Injector) {
    BandejaInternoState.api = injector.get<TramiteService>(TramiteService);
  }

  @Selector()
  static bandejaFiltro(state: BandejaInternoStateModel) {
    return state.bandejaFiltro;
  }

  @Selector()
  static bandejaBuscar(state: BandejaInternoStateModel) {
    return state.bandejaBuscar;
  }

  @Selector()
  static bandejaActiva(state: BandejaInternoStateModel) {
    return state.bandejaActiva;
  }

  @Selector()
  static externos(state: BandejaInternoStateModel) {
    return state.externos;
  }

  @Selector()
  static documentos(state: BandejaInternoStateModel) {
    // return state.documentos;
    return state.bandejas[state.bandejaActiva];
  }

  @Selector()
  static counts(state: BandejaInternoStateModel) {
    return {
      e:state.bandejas.e.length,
      a:state.bandejas.a.length,
      s:state.bandejas.s.length,
    };
  }

  @Selector()
  static buzonActual(state: BandejaInternoStateModel) {
    return state.buzonActual;
  }

  @Selector()
  static currentUserBuzon(state: BandejaInternoStateModel) {
    return state.listaBuzones[0];
  }

  @Selector()
  static destinatarioGerente(state:BandejaInternoStateModel){
    return state.destinatarioGerente;
  }

  @Selector()
  static destinatarioJefe(state:BandejaInternoStateModel){
    return state.destinatarioJefe;
  }

  @Selector()
  static listaBuzones(state:BandejaInternoStateModel){
    return state.listaBuzones;
  }

  @Selector()
  static pending(state: BandejaInternoStateModel) {
    return state.pending;
  }

  @Selector()
  static loaded(state: BandejaInternoStateModel) {
    return state.loaded;
  }

  @Receiver({ cancelUncompleted: true })
  public static loadDocuments(ctx: Context, action: FiltroAction) {
    const bandejaFiltro = action.payload;
    const buzonUsuario=ctx.getState().buzonActual;
    //verificar si hay algun buzon seleccionado
    if(buzonUsuario.permiso==0) return of([]);
    ctx.patchState({ bandejaFiltro, pending: true });
    return this.api.getBandejaDocumentoInterno(buzonUsuario.loginUsuarioBuzon,bandejaFiltro).pipe(
      tap(d =>{
        let bandejas= new BandejasInternas();
        bandejas[bandejaFiltro.bandeja]=d.bandeja;
        ctx.patchState({bandejas:bandejas,
                        bandejaActiva:bandejaFiltro.bandeja,
                        externos:d.externos,
                        loaded: true,
                        pending: false })}
      ),
      catchError(_err => {
        //ctx.patchState(defaultStateBandeja);
        return of([]);
      })
    );
  }

  @Receiver({ cancelUncompleted: true })
  public static searchDocuments(ctx: Context, action: BuscarAction) {
    const bandejaBuscar = action.payload;
    const buzonUsuario=ctx.getState().buzonActual;
    ctx.patchState({bandejaActiva:'e',bandejas:new BandejasInternas(), bandejaBuscar, pending: true });
    return this.api.buscarBandejaInterna(buzonUsuario.loginUsuarioBuzon, bandejaBuscar).pipe(
      tap(
        b =>{
          const bandejaActiva=(b.e.length>0)?'e':
                              (b.a.length>0)?'a':
                              (b.s.length>0)?'s':'e'
          ctx.patchState({ bandejas:b, bandejaActiva, pending: false })
        }
      ),
      catchError(_err => {
        //ctx.patchState(defaultStateBandeja);
        return of([]);
      })
    );
  }

  @Receiver({ cancelUncompleted: true })
  public static loadListaBuzonesInternos(ctx: Context) {
    ctx.patchState({pending: true });
    return this.api.buscarUsuarioBandeja().pipe(
      tap(
        buzones =>{
            ctx.patchState({listaBuzones:buzones,
            buzonActual:buzones[0],
            pending: false })
        }
      ),
      catchError(_err => {
        return of([]);
      })
    );
  }
  @Receiver({ cancelUncompleted: true })
  public static loadDestinatarios(ctx: Context) {
    ctx.patchState({pending: true });
    return this.api.retornarJefeyGerente().pipe(
      tap(
        djg =>{
            ctx.patchState({destinatarioGerente:(djg.gerente.length == 0)? null:djg.gerente[0],
              destinatarioJefe:(djg.jefeArea.length == 0)? null:djg.jefeArea[0],
              pending: false })
        }
      ),
      catchError(_err => {
        return of([]);
      })
    );
  }
  
  @Receiver()
  public static setBandejaActiva(ctx: Context, action: BandejaActivaAction) {
    const bandejaActiva = action.payload;
    ctx.patchState({ bandejaActiva:bandejaActiva });
  }
  @Receiver()
  public static setBuzonActual(ctx: Context, action: BuzonUsuarioAction) {
    const buzonUsuario = action.payload;
    ctx.patchState({buzonActual:buzonUsuario});
  }

}
