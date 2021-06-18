import { Injectable } from '@angular/core';

import { HttpService } from '@core/http.service';
import { NgxfUploaderService, UploadEvent } from 'ngxf-uploader';
import { Observable, of } from 'rxjs';
import { formatDate } from '@angular/common'

import { BandejaDocumento, BandejaRespuesta } from '@models/tramite/bandeja-documento';
import { BandejaFiltro, BuscarBandeja } from '@models/tramite/bandeja-filtro';
import { setUrl } from '@core/functions';
import { Remitente, TipoRemitente } from '@models/tramite/remitente';
import { Destinatario } from '@models/tramite/destinatario';
import { catchError } from 'rxjs/operators';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { ItemResultado } from '@models/item-resultado';
import { ResultadoBuscarDocumento } from '@models/tramite/resultado-buscar-documento';
import { ArchivoDocumento, ArchivosAnexos } from '@models/tramite/archivo.documento';
import { DetalleDocumento } from '@models/tramite/detalle-documento';
import { Resultado } from '@models/resultado';
import { ReporteFiltro } from '@models/tramite/reporte-filtro';
import { ReporteDocumento } from '@models/tramite/reporte-documento';
import { UsuarioApp } from '@models/tramite/usuario-app';
import { PopupPendientes } from '@models/tramite/popup-pendientes';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { SeguimientoFiltro} from '@models/tramite/seguimiento-filtro';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { GrafoReporte } from '@models/tramite/grafo-reporte';
import { Bandejas, BandejasInternas } from '@models/tramite/bandejas';
import { DocumentoInterno, BandejaInternaRespuesta } from '@models/tramite/documento-interno';
import { DocumentoInternoFiltro } from '@models/tramite/documento-interno-filtro';
import { Pair } from '@models/pair';
import { Area } from '@models/tramite/area';
import { DocumentoExternoReporte } from '@models/tramite/documento-externo-reporte';
import { DetalleSielse } from '@models/tramite/detalle-sielse';
import { Sielse } from '@models/tramite/sielse';
import { BuscarContrato } from '@models/tramite/buscar-contrato';
import { SeguimientoFiltroVb } from '@models/tramite/seguimiento-filtro-vb';

// import { BandejaSalida } from '@models/tramite/bandeja-salida';
@Injectable()
export class TramiteService {
  constructor(private http: HttpService, private Upload: NgxfUploaderService) {}

  //#region  BANDEJA ****************************************
  //getBandeja(loginUsuarioBuzon:string,b: BandejaFiltro): Observable<BandejaDocumento[]> {
getBandeja(loginUsuarioBuzon:string,b: BandejaFiltro): Observable<BandejaRespuesta> {
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
    //console.log(JSON.stringify(s))
    return this.http.get({
      uri: `api/buscarDocumento/${loginUsuarioBuzon.trim()}/${s.tipoBusqueda}/${s.valorBusqueda.trim()}`,
      open: false,
      close: false
    });
  }
  buscarBandejaInterna(loginUsuarioBuzon: string, s: BuscarBandeja): Observable<BandejasInternas> {
      return this.http.get({
      uri: `api/buscarDocumentoInterno/${loginUsuarioBuzon.trim()}/${s.tipoBusqueda}/${s.valorBusqueda.trim()}`,
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
    valorBusqueda,
    blacklist,
    loginUsuario
  ): Observable<Destinatario[]> {
    if(blacklist)
      return this.http
      .get({
        uri: `api/buscarDestinatarioBL/${porNombre}/${tipoBusqueda}/${blacklist}/${valorBusqueda.trim()}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
    return this.http
      .get({
        uri: (loginUsuario==null)?`api/buscarDestinatario/${porNombre}/${tipoBusqueda}/${valorBusqueda.trim()}`
        :`api/buscarDestinatario/${porNombre}/${tipoBusqueda}/${valorBusqueda.trim()}/${loginUsuario}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
  }
  buscarDestinatarioTodos(porNombre,
    tipoBusqueda,
    valorBusqueda
  ): Observable<Destinatario[]> {
    return this.http
      .get({
        uri: `api/buscarDestinatarioTodos/${porNombre}/${tipoBusqueda}/${valorBusqueda.trim()}`,
        open: false,
        close: false
      })
      .pipe(catchError(_err => of([])));
  }
  buscarArea(
    valorBusqueda
  ): Observable<Area[]> {
    return this.http
      .get({
        uri: `api/buscarArea/${valorBusqueda}`,
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

  guardarValorizacionContabilidad(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/guardarValorizacion`,
      body,
      open: false,
      close: false
    });
  }
  buscarContrato(body): Observable<BuscarContrato[]> {
      // console.log(JSON.stringify(body))
      return this.http.post({
      uri: `api/buscarContrato`,
      body,
      open: false,
      close: false
    });
  }

  retornarJefeyGerente(): Observable<any> {
    // console.log(JSON.stringify(body))
    return this.http.get({
    uri: `api/obtenerJefeyGerente`,
    open: false,
    close: false
  });
}
  
  guardarOTMantenimiento(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/guardarOTMantenimiento`,
      body,
      open: false,
      close: false
    });
  }
  derivarDocumento(body): Observable<ItemResultado> {
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
  derivarDocumentoInternoValorizacion(body): Observable<ItemResultado[]> {
    return this.http.post({
      uri: `api/DerivacionValorizacion`,
      body,
      open: false,
      close: false
    });
  }
  buscarDocumento(body): Observable<ResultadoBuscarDocumento[]> {
    //console.log(JSON.stringify(body))
    return this.http.post({
      uri: `api/buscarDocumento`,
      body,
      open: false,
      close: false
    });
  }
  archivosDocumento(codigoDocumento,loginUsuarioBuzon): Observable<ArchivosAnexos> {
    return this.http.get({
      uri: `api/archivosAdjuntos/${codigoDocumento}/${loginUsuarioBuzon}`,
      open: false,
      close: false
    });
  }
  archivosDocumentoInterno(loginUsuarioBuzon,codigoDocumento,tipo): Observable<ArchivoDocumento[]> {
    return this.http.get({
      uri: `api/adjuntosPrincipalesyAnexos/${loginUsuarioBuzon.trim()}/${codigoDocumento}/${tipo}`,
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
  detalleSielseSeguimiento(codigoSielse: string): Observable<DetalleSielse[]> {
    // console.log(`api/detalleSielseSeguimiento/${codigoSielse.trim()}`)
    return this.http.get({
      uri: `api/detalleSielseSeguimiento/${codigoSielse.trim()}`,
      open: false,
      close: false
    });
  }
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
  //#region  Valorizaciones ****************************************
  listarValorizacion(
    codigoDocumento,
    ): Observable<BuscarContrato> {
  return this.http.get({
    uri: `api/listarValorizacion/${codigoDocumento}`,
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

  guardarArchivoParaFirmarMemo(codigoDocumento): Observable<{rutaOrigen:string,
    rutaDestino:string,
    urlServicio:string}> {
      return this.http.get({
        uri: `api/firmarArchivoMemo/${codigoDocumento}`,
        open: true,
        close: true,
        });
  }
  guardarArchivoParaFirmarMemoAdjunto(codigoDocumento,codigoDocumentoAdjunto): Observable<{rutaOrigen:string,
    rutaDestino:string,
    urlServicio:string}> {
      return this.http.get({
        uri: `api/firmarArchivoMemoAdjunto/${codigoDocumento}/${codigoDocumentoAdjunto}`,
        open: true,
        close: true,
        });
  }

  guardarArchivoParaFirmarInterno(codigoDocumento,codigoDocumentoAdjunto): Observable<{rutaOrigen:string,
    rutaDestino:string,
    urlServicio:string}> {
      return this.http.get({
        uri: `api/firmarArchivoInterno/${codigoDocumento}/${codigoDocumentoAdjunto}`,
        open: true,
        close: true,
        });
  }

  guardarArchivoFirmado(body): Observable<ItemResultado> {
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
      open:  true,
      close: true,
      options: { responseType: 'blob' }
    });
  }
  //Aquí el componente se cambia por FALSE , para evitar que se habrá el componete 
  descargarArchivoZip(
    codigoDocumento,
    itemId
  ): Observable<Blob> | Observable<any> {
    return this.http.get({
      uri: `api/DescargarArchivo/${codigoDocumento}/${itemId}`,
      open: false,
      close: true,
      options: { responseType: 'blob' }
    });
  }


  /*eliminarArchivo(
    codigoDocumento,
    itemId
  ): Observable<Blob> | Observable<any> {
    return this.http.get({
      uri: `api/eliminarArchivo/${codigoDocumento}/${itemId}`,
      open: true,
      close: true,
      //options: { responseType: 'blob' }
    });
  }*/

  eliminarArchivo(
    codigoDocumento,
    itemId
  ): Observable<any> {
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
  getReporteInternoPdf(r: DocumentoInternoFiltro): Observable<Blob> | Observable<any> {
    const fi = formatDate(r.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(r.fechaFin,"yyyyMMdd","en-US");
    //const uri=(r.tipoEmisor==0 && (r.prefijoGerencia=='G' || r.prefijoGerencia=='GP'))? --Para que mas gerencias actuen como G
    const uri=(r.tipoEmisor==0 && (r.prefijoGerencia=='G'))?
                         `api/repDocIntGPDF/${r.loginUsuario}/${fi}/${ff}/${r.prefijoGerencia}/${r.codigoTipoDocumento}/${r.codigoEstado}`
      :(r.tipoEmisor==0)?`api/repDocIntGLyAreaPDF/${r.loginUsuario}/${fi}/${ff}/${r.prefijoGerencia}/${r.codigoTipoDocumento}/${r.codigoEstado}`
      :(r.tipoEmisor==1)?`api/repDocIntGLyAreaPDF/${r.loginUsuario}/${fi}/${ff}/${r.prefijoArea}/${r.codigoTipoDocumento}/${r.codigoEstado}`
      :(r.tipoEmisor==2)?`api/repDocIntPersonaPDF/${r.loginUsuario}/${fi}/${ff}/${r.codigoTipoDocumento}/${r.codigoEstado}`:"";
    return this.http.get({
    uri: uri,
    open: true,
    close: true,
    options: { responseType: 'blob' }
    });
  }
  getReporteExternoPdf(r: DocumentoExternoReporte): Observable<Blob> | Observable<any> {
    const fi = formatDate(r.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(r.fechaFin,"yyyyMMdd","en-US");
    //console.log(JSON.stringify(r))
    return this.http.get({
    uri: `api/ReporteDocExternosPDF/${fi}/${ff}/${+r.conRemitente}/
    ${r.conRemitente?r.codigoRemitente:"0"}/
    ${+r.conNroExpediente}/
    ${r.conNroExpediente?r.numeroExpediente:"0"}/
    ${r.conFechaVencimiento}/
    ${r.conPlazoAtencion}/
    ${r.diasPorVencer}/
    ${r.loginUsuarioDestino}/
    ${r.statusDoc}`,
    open: true,
    close: true,
    options: { responseType: 'blob' }
    });
  }
  getCargo(codigoDocumento:number): Observable<Blob> | Observable<any> {
    return this.http.get({
      uri: `api/ReporteCargoPDF/${codigoDocumento}`,
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
  getDetalleSielse(codigoDocumento): Observable<Sielse[]> {
    return this.http.get({
      uri: `api/detalleSielse/${codigoDocumento}`,
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
      //console.log(JSON.stringify(body))
    return this.http.post({
     
        body:copia,
        uri: `api/listarDocumentosInteresado`,
        open: false,
        close: false
    });
  }
  getBuscar(body:SeguimientoFiltro): Observable<SeguimientoDocumento[]> {
    let copia:SeguimientoFiltro={...body}
    copia.fechaInicioTexto = formatDate(copia.fechaInicio, "yyyyMMdd","en-US");
    copia.fechaFinTexto = formatDate(copia.fechaFin, "yyyyMMdd","en-US");
        //console.log(JSON.stringify(body))
        return this.http.post({
        body:copia,
        uri: `api/listarDocumentosInteresado`,
        open: false,
        close: false
    });
  }
  getBuscarVb(body:SeguimientoFiltroVb): Observable<SeguimientoDocumento[]> {
    let copia:SeguimientoFiltroVb={...body}
    copia.fechaInicioTexto = formatDate(copia.fechaInicio, "yyyyMMdd","en-US");
    copia.fechaFinTexto = formatDate(copia.fechaFin, "yyyyMMdd","en-US");
        //console.log(JSON.stringify(body))
        return this.http.post({
        body:copia,
        uri: `api/listarDocumentoVb`,
        open: false,
        close: false
    });
  }
  getReporteSeguimientoVB(codigo: number): Observable<Blob> | Observable<any> {
    return this.http.get({
    uri: `api/reporteVB/${codigo}`,
    open: true,
    close: true,
    options: { responseType: 'blob' }
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
  getReporteMemo(codigo: number): Observable<Blob> | Observable<any> {
    return this.http.get({
    uri: `api/reporteMemo/${codigo}`,
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
   getBandejaDocumentoInterno(loginBandeja:string,b: BandejaFiltro): Observable<BandejaInternaRespuesta> {
    const fi = formatDate(b.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(b.fechaFin,"yyyyMMdd","en-US");
    return this.http.get({
      uri: `api/BandejaDocumentoInterno/${loginBandeja.trim()}/${b.bandeja}/${fi}/${ff}`,
      open: false,
      close: false
    });
  }
  //reporteDocInternoEmitidos/{loginUsuario}/{fechaInicioTexto}/{fechaFinTexto}/{prefijo}/{codigoTipoDocumento}/{codigoEstado}"
  getReporteDocumentoInterno(b: DocumentoInternoFiltro): Observable<DocumentoInterno[]> {
    const fi = formatDate(b.fechaInicio,"yyyyMMdd","en-US");
    const ff = formatDate(b.fechaFin,"yyyyMMdd","en-US");
    const prefijo=(b.tipoEmisor==0)?
      b.prefijoGerencia:(b.tipoEmisor==1)?b.prefijoArea:b.prefijoUser;
    const lu=(b.tipoEmisor==2)?b.loginUsuario:null;
    return this.http.get({
      uri: `api/reporteDocInternoEmitidos/${lu}/${fi}/${ff}/${prefijo}/${b.codigoTipoDocumento}/${b.codigoEstado}`,
      open: false,
      close: false
    });
  }
  getListarPrefijosYGerencias(loginUsuario:string):Observable<Pair[]>{
    return this.http.get({
      uri: `api/listarPrefijosYGerencias/${loginUsuario}`,
      open: false,
      close: false
    });
  } 
  getListaAprobaciones(codigoDocumento:number):Observable<any>{
    return this.http.get({
      uri: `api/listarAprobadores/${codigoDocumento}`,
      open: false,
      close: false
    });
  }
  derivarArchivoFinal(form, file: File): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/derivarArchivoFinal'),
      fields: form,
      files: file,
      process: true
    });
  }
  derivarInternoFinal(body): Observable<ItemResultado> {
    // console.log("shushu del angular")
    // console.log(JSON.stringify(body))
    return this.http.post({
      uri: `api/derivarDelPrincipalInterno`,//api/derivarArchivoFinal
      body,
      open: false,
      close: false
    });
  }
  derivarDeFinal(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/derivarDelPrincipal`,
      body,
      open: false,
      close: false
    });
  }
  aprovarDeFinal(body): Observable<ItemResultado> {
    return this.http.post({
      uri: `api/atencionSecundaria`,
      body,
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
  aprobarValidacion(form): Observable<ItemResultado> {
    return this.http.post({
      body:form,
      uri: `api/aprobarValidacion`,
      open: false,
      close: false
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