import { Injectable } from '@angular/core';

import { HttpService } from '@core/http.service';
import { NgxfUploaderService, UploadEvent } from 'ngxf-uploader';
import { Observable, of } from 'rxjs';
import { formatDate } from '@angular/common'

import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { BandejaFiltro, BuscarBandeja } from '@models/tramite/bandeja-filtro';
import { toAAmmdd, setUrl } from '@core/functions';
import { Remitente, TipoRemitente } from '@models/tramite/remitente';
import { Destinatario } from '@models/tramite/destinatario';
import { catchError } from 'rxjs/operators';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { ItemResultado } from '@models/item-resultado';
import { ResultadoBuscarDocumento } from '@models/tramite/resultado-buscar-documento';
import { ArchivoDocumento } from '@models/tramite/archivo.documento';
import { DetalleDocumento } from '@models/tramite/detalle-documento';
import { Resultado } from '@models/resultado';
import { ReporteFiltro } from '@models/tramite/reporte-filtro';
import { ReporteDocumento } from '@models/tramite/reporte-documento';
import { Usuario } from '@core/auth/usuario';
import { UsuarioApp } from '@models/tramite/usuario-app';
import { PopupPendientes } from '@models/tramite/popup-pendientes';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { SeguimientoFiltro} from '@models/tramite/seguimiento-filtro';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { GrafoReporte } from '@models/tramite/grafo-reporte';
import { Bandejas, BandejasInternas } from '@models/tramite/bandejas';
import { DocumentoInterno } from '@models/tramite/documento-interno';
import { AprobacionDocumento } from '@models/tramite/aprobacion-documento';

// import { BandejaSalida } from '@models/tramite/bandeja-salida';
@Injectable()
export class TramiteService {
  constructor(private http: HttpService, private Upload: NgxfUploaderService) {}

  //#region  BANDEJA ****************************************
  getBandeja(loginUsuarioBuzon:string,b: BandejaFiltro): Observable<BandejaDocumento[]> {
    const fi = formatDate(b.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(b.fechaFin,"yyyyMMdd","en-US");
    return this.http.get({
      uri: `api/bandeja/${loginUsuarioBuzon.trim()}/${b.bandeja}/${fi}/${ff}`,
      open: false,
      close: false
    });
  }
  //************************Bandeja buscar */
  buscarBandeja(loginUsuarioBuzon: string, s: BuscarBandeja): Observable<Bandejas> {
    return this.http.get({
      uri: `api/buscarDocumento/${loginUsuarioBuzon.trim()}/${s.tipoBusqueda}/${s.valorBusqueda.trim()}`,
      open: false,
      close: false
    });
  }
  buscarBandejaInterna(s: BuscarBandeja): Observable<BandejasInternas> {
    return this.http.get({
      uri: `api/buscarDocumentoInterno/${s.tipoBusqueda}/${s.valorBusqueda.trim()}`,
      open: false,
      close: false
    });
  }
  //#endregion ****************************************

  //#region  REMITENTE ****************************************
  buscarRemitente(tipoBusqueda, valorBusqueda): Observable<Remitente[]> {
    return this.http
      .get({
        uri: `api/buscarRemitente/${tipoBusqueda}/${valorBusqueda}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
  }
  //#endregion ****************************************

  //#region  DESTINATARIO ****************************************
  buscarDestinatario(
    porNombre,
    tipoBusqueda,
    valorBusqueda
  ): Observable<Destinatario[]> {
    return this.http
      .get({
        uri: `api/buscarDestinatario/${porNombre}/${tipoBusqueda}/${valorBusqueda}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
  }
  //#endregion ****************************************

  //#region  DOCUMENTO ****************************************
  tiposTramite(): Observable<TramiteTipos> {
    return this.http.get({
      uri: `api/tramiteTipos`,
      open: false,
      close: false
    });
  }
  guardarDocumento(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/guardarDocumento`,
      body,
      open: false,
      close: false
    });
  }
  guardarDocumentoInterno(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/guardarDocumentoInterno`,
      body,
      open: false,
      close: false
    });
  }
  derivarDocumento(body): Observable<ItemResultado[]> {
    return this.http.post({
      uri: `api/derivarDocumento`,
      body,
      open: false,
      close: false
    });
  }
  derivarDocumentoInterno(body): Observable<ItemResultado[]> {
    return this.http.post({
      uri: `api/derivarDocumentoInterno`,
      body,
      open: false,
      close: false
    });
  }
  buscarDocumento(body): Observable<ResultadoBuscarDocumento[]> {
    console.log(JSON.stringify(body))
    return this.http.post({
      uri: `api/buscarDocumento`,
      body,
      open: false,
      close: false
    });
  }
  archivosDocumento(codigoDocumento,loginUsuarioBuzon): Observable<ArchivoDocumento[]> {
    return this.http.get({
      uri: `api/archivosAdjuntos/${codigoDocumento}/${loginUsuarioBuzon}`,
      open: false,
      close: false
    });
  }
  archivosDocumentoInterno(codigoDocumento,tipo): Observable<ArchivoDocumento[]> {
    return this.http.get({
      uri: `api/adjuntosPrincipalesyAnexos/${codigoDocumento}/${tipo}`,
      open: false,
      close: false
    });
  }
  detalleDocumento(codigoDocumento): Observable<DetalleDocumento[]> {
    return this.http.get({
      uri: `api/detalleDocumento/${codigoDocumento}`,
      open: false,
      close: false
    });
  }
  // atencionesDocumento(
  //   codigoDocumento,
  //   nroAtencion
  // ): Observable<DetalleDocumento[]> {
  //   return this.http.get({
  //     uri: `api/atenciones/${codigoDocumento}/${nroAtencion}`,
  //     open: false,
  //     close: false
  //   });
  // }
   //#region  Atenciones****************************************
  listarAtenciones(
    codigoDocumento,
    ): Observable<DetalleDocumento[]> {
  return this.http.get({
    uri: `api/listarAtenciones/${codigoDocumento}`,
    open: false,
    close: false
  });
}
// Guardar la atención
  atenderDocumento(body): Observable<Resultado> {
    return this.http.post({
      uri: `api/atenderDocumento`,
      body,
      open: true,
      close: true
    });
  }

  atencionesAutomaticas(codigoDocumentoTramite,numeroAtencion):Observable<Resultado>{
    return this.http.get({
     uri: `api/atencionesAutomaticasDocumentos/${codigoDocumentoTramite}/${numeroAtencion}`,
     open: false,
     close: false
   });
 }
//#endRegion Atenciones****************************************
  recuperarDerivacion(body): Observable<Resultado> {
    return this.http.post({
      uri: `api/recuperarDerivacion`,
      body,
      open: true,
      close: true
    });
  }
  cancelarAtencion(body): Observable<Resultado> {
    return this.http.post({
      uri: `api/cancelarAtencion`,
      body,
      open: true,
      close: true
    });
  }
  adjuntarArchivoInterno(form, file: File): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/adjuntarArchivoInterno'),
      fields: form,
      files: file,
      process: true
    });
  }
  adjuntarArchivo(form, file: File): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/adjuntarArchivo'),
      fields: form,
      files: file,
      process: true
    });
  }
 //Actualizar el campo tipo de PDF - Principal o Anexo
  actualizarAdjunto(codigoDocumentoTramite:number,
    codigoDocumentoAdjunto:number,
    codigoTipoDocumentoAdjunto:number): Observable<Resultado> {
    return this.http.get({
    uri: `api/actualizarTipoAdjunto/${codigoDocumentoTramite}/${codigoDocumentoAdjunto}/${codigoTipoDocumentoAdjunto}`,
    open: true,
    close: true,
    });
  }
  /* actualizarAnexoInterno(codigoDocumentoInterno:string,
    codigoDocumentoAdjunto:number,
    codigoTipoDocumentoAdjunto:number): Observable<Resultado> {
    return this.http.get({
    uri: `api/actualizarTipoAdjunto/${codigoDocumentoInterno}/${codigoDocumentoAdjunto}/${codigoTipoDocumentoAdjunto}`,
    open: true,
    close: true,
    });
  } */
  //#endregion ****************************************
  guardarArchivoParaFirmar(file: File): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/guardarArchivoServidor'),
      files: file,
      process: true
    });
  }

  guardarArchivoFirmado(body): Observable<Resultado> {
    return this.http.post({
      uri: 'api/guardarArchivoFirmado',
      body,
      open: false,
      close: false
    });
  }

  descargarArchivo(
    codigoDocumento,
    itemId
  ): Observable<Blob> | Observable<any> {
    return this.http.get({
      uri: `api/DescargarArchivo/${codigoDocumento}/${itemId}`,
      open: true,
      close: true,
      options: { responseType: 'blob' }
    });
  }

  eliminarArchivo(
    codigoDocumento,
    itemId
  ): Observable<Blob> | Observable<any> {
    return this.http.get({
      uri: `api/eliminarArchivo/${codigoDocumento}/${itemId}`,
      open: true,
      close: true,
      //options: { responseType: 'blob' }
    });
  }
  //#region  REPORTE ****************************************
  getReporte(r: ReporteFiltro): Observable<ReporteDocumento[]> {
    const fi = formatDate(r.fechaInicio,"yyyyMMddHHmmss","en-US");
    const ff = formatDate(r.fechaFin,"yyyyMMddHHmmss","en-US");
    return this.http.get({
      uri: `api/reporte/${fi}/${ff}/${r.usuario}`,
      open: false,
      close: false
    });
  }

  buscarUsuario(valorBusqueda): Observable<UsuarioApp[]> {
    return this.http
      .get({
        uri: `api/buscarUsuario/${valorBusqueda}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
  }

  getReportePdf(r: ReporteFiltro): Observable<Blob> | Observable<any> {
    const fi = formatDate(r.fechaInicio,"yyyyMMddHHmmss","en-US");
    const ff = formatDate(r.fechaFin,"yyyyMMddHHmmss","en-US");
    return this.http.get({
    uri: `api/reportepdf/${fi}/${ff}/${r.usuario}`,
    open: true,
    close: true,
    options: { responseType: 'blob' }
    });
  }

  getReporteUrl(r: ReporteFiltro): string {
      const fi = formatDate(r.fechaInicio,"yyyyMMddHHmmss","en-US");
      const ff = formatDate(r.fechaFin,"yyyyMMddHHmmss","en-US");
      return setUrl(`api/reportepdf/${fi}/${ff}/${r.usuario}`);
  }
  //#endregion ***********************************************
  //#region REMITENTE ****************************************
  tiposRemitente(): Observable<TipoRemitente[]> {
      return this.http.get({
        uri: `api/tipoRemitente`,
        open: false,
        close: false
      });
  }
  guardarRemitente(body): Observable<ItemResultado> {
      return this.http.post({
        uri: `api/GuardarRemitente`,
        body,
        open: false,
        close: false
      });
  }
  //#endregion ***************************************************
  //#region VISTAS POP-UP ****************************************
  getPendientes(c:number):Observable<PopupPendientes>{
      const tipo=(c>1)?2:1;
      return this.http.get({
        uri: `api/vistaDocumentos/${tipo}`,
        open: false,
        close: false
      });
  }
  //#region Buscar Bandeja de Usuarioah ya ****************************
  buscarUsuarioBandeja(): Observable<BuzonesUsuario[]> {
     return this.http.get({
          uri: `api/buzonesUsuario`,
          open: false,
          close: false
      });
  }
  //#finendregion****************************************************
  //endregion********************************************************
  //BUSCAR DOCUMENTO - REPORTE **************************************
  buscarDoc(body:SeguimientoFiltro): Observable<SeguimientoDocumento[]> {
    let copia:SeguimientoFiltro={...body}
    if(copia.check){
    copia.fechaInicioTexto = formatDate(copia.fechaInicio, "yyyyMMdd","en-US");
    copia.fechaFinTexto = formatDate(copia.fechaFin, "yyyyMMdd","en-US");
    }
    else{
      copia.fechaInicioTexto = "";
      copia.fechaFinTexto =  "";
    }
    return this.http.post({
        body:copia,
        uri: `api/listarDocumentosInteresado`,
        open: false,
        close: false
    });
  }
  getBuscar(body:SeguimientoFiltro): Observable<SeguimientoDocumento[]> {
    let copia:SeguimientoFiltro={...body}
    //console.log(JSON.stringify(copia))
    //if(copia.check){
    copia.fechaInicioTexto = formatDate(copia.fechaInicio, "yyyyMMdd","en-US");
    copia.fechaFinTexto = formatDate(copia.fechaFin, "yyyyMMdd","en-US");
    //}
    //else{
    //  copia.fechaInicioTexto = "";
    //  copia.fechaFinTexto =  "";
    //}
    return this.http.post({
        body:copia,
        uri: `api/listarDocumentosInteresado`,
        open: false,
        close: false
    });
  }
  getReporteSeguimiento(codigo: number): Observable<Blob> | Observable<any> {
    return this.http.get({
    uri: `api/reporteprincipal/${codigo}`,
    open: true,
    close: true,
    options: { responseType: 'blob' }
    });
  }
  graphReport(codigoDocumento): Observable<GrafoReporte> {
    return this.http.get({
      uri: `api/graphReport/${codigoDocumento}`,
      open: false,
      close: false
    });
  }
  //#endregion *****************************************************

   //#region  BANDEJA INTERNA ****************************************
   getBandejaDocumentoInterno(b: BandejaFiltro): Observable<DocumentoInterno[]> {
    const fi = formatDate(b.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(b.fechaFin,"yyyyMMdd","en-US");
    return this.http.get({
      uri: `api/BandejaDocumentoInterno/${b.bandeja}/${fi}/${ff}`,
      open: false,
      close: false
    });
  }
  getListaAprobaciones(codigoDocumento:number):Observable<AprobacionDocumento[]>{
    return this.http.get({
      uri: `api/listarAprobadores/${codigoDocumento}`,
      open: false,
      close: false
    });
  }
  aprobarArchivo(form, file: File): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/aprobarArchivo'),
      fields: form,
      files: file,
      process: true
    });
  }
  rechazarDocumento(form): Observable<ItemResultado> {
    return this.http.post({
      body:form,
      uri: `api/rechazarDocumentoInterno`,
      open: false,
      close: false
    });
  }
}