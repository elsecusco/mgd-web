import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { AuthService, TiposMesa } from '../auth.service';
import { DocumentoMesa, Persona, FileAdjunto } from '../../../@models/documento-mesa';
import { ConfirmarMesaComponent } from '../confirmar-mesa/confirmar-mesa.component';
import { formatDate } from '@angular/common';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'mesa-datos',
  templateUrl: './mesa-datos.component.html',
  styleUrls: ['./mesa-datos.component.scss']
})
export class MesaDatosComponent implements OnInit {

 // codigoDocumento = 0;
  form!: FormGroup;
  editPerson = false;
  editDocument = false;

  loading=false;//verificar despues
  @ViewChild('f') f: any;
  listAnexos: Array<FileAdjunto> = [];

  tipos: TiposMesa={tiposDocumento:[],tiposProceso:[],tiposDocIdentidad:[]};

  saving!: boolean;
  @Output() save = new EventEmitter<string>();

  doc: DocumentoMesa = new DocumentoMesa();
  persona:Persona = new Persona();

  constructor(private fb: FormBuilder
    ,private api: AuthService
    ,public dialog: MatDialog) {
  }

  ngOnInit() {
    this.api.getTipos().subscribe(tipos =>
      {
        this.tipos = tipos;
        this.doc.codigoTipoDocumento = this.tipos.tiposDocumento[0].codigo;
        this.doc.codigoProceso=this.tipos.tiposProceso[0].codigo;
      });
    this.initForm();
  }
  ngOnDestroy() {}
  get numeroDocumentoPersona(){
    return this.form.get("numeroDocumentoPersona")
  }
  initForm() {
    this.form = this.fb.group({
      tipoDocumentoPersona: [this.persona.codigoTipoDocumento,Validators.required],
      numeroDocumentoPersona: [this.persona.numeroDocumentoIdentidad,[Validators.required,
        Validators.minLength(8),
        Validators.pattern("^[0-9¿]*$")]],
      correoPersona: [this.persona.emailContacto,[Validators.email,Validators.required]],
      celularPersona: [this.persona.telefonoContacto,[Validators.required,
        Validators.minLength(9),
        Validators.pattern("^[0-9]*$")]],
      nombrePersona: [this.persona.nombreRemitenteDocumento,[Validators.required]],
        // Validators.minLength(9),
        // Validators.pattern("^[0-9]*$")]],
      codigoTipoDocumento: [this.doc.codigoTipoDocumento, Validators.required],
      numeroDocumento: [this.doc.numeroDocumento, Validators.required],
      fechaDocumento: [new Date(), Validators.required],
      numeroPaginas: [this.doc.numeroPaginas, Validators.required],
      numeroExpediente: [this.doc.numeroExpediente],
      filePrincipal:[null, Validators.required],
      codigoProceso: [this.doc.codigoProceso,Validators.required],
      asunto: [this.doc.asunto, Validators.required]
      });
  }

  search(){
    const id=this.form.get("tipoDocumentoPersona")?.value;
    const number=this.form.get("numeroDocumentoPersona")?.value;
    this.saving = true;
    this.api.getRemitente(id,number).subscribe(p=>{
      if(p.length>0){
        this.persona=p[0];
        this.initForm();
        this.editPerson=false;
        this.editDocument=true;
      }
      else{
        this.persona=new Persona();
        this.editPerson=true;
        this.editDocument=true;
      }
      this.saving=false;
    });
  }
  setPrincipal(p:FileAdjunto){
    if(p.file!= null)
      this.form.patchValue({ filePrincipal: p});
    else
      this.form.patchValue({ filePrincipal: null});
  }
  formPullPerson(){
    this.persona={
      codigoRemitenteDocumento:this.persona.codigoRemitenteDocumento,
      codigoTipoDocumento:this.form.get("tipoDocumentoPersona")?.value,
      emailContacto:this.form.get("correoPersona")?.value,
      nombreRemitenteDocumento:this.form.get("nombrePersona")?.value,
      numeroDocumentoIdentidad:this.form.get("numeroDocumentoPersona")?.value,
      telefonoContacto:this.form.get("celularPersona")?.value
    }
  }
  formPullDocumento(){
    this.doc.codigoRemitenteDocumento= this.persona.codigoRemitenteDocumento;
    this.doc.codigoTipoDocumento = this.form.value.codigoTipoDocumento;
    this.doc.fechaDocumento =formatDate(this.form.value.fechaDocumento,"yyyyMMdd","en-US");
    this.doc.codigoProceso=this.form.value.codigoProceso;
    this.doc.numeroDocumento=this.form.value.numeroDocumento;
    this.doc.numeroExpediente=this.form.value.numeroExpediente;
    this.doc.numeroPaginas=this.form.value.numeroPaginas;
    this.doc.asunto=this.form.value.asunto;
  }
  pedirCodigo() {
    this.formPullPerson();
    this.formPullDocumento();
    this.saving = true;
    this.api.pedirCodigo(this.persona).subscribe(
      res => {
        this.persona.codigoRemitenteDocumento=res.codigoRemitenteDocumento;
        this.saving = false;
        this.showConfirmacion();
      }
    );
  }
  showConfirmacion(){
    const dialogRef = this.dialog.open( ConfirmarMesaComponent, {
      width: '600px',
      data: { doc:this.doc,
              persona:this.persona,
              principal:this.form.get("filePrincipal")?.value,
              listAnexos:this.listAnexos}
    });
    dialogRef.afterClosed().subscribe(ok => {
    if(ok){
      this.doc=new DocumentoMesa();
      this.persona=new Persona();
      this.save.emit(this.doc.codigoDocumentoTramite.toString());
      window.location.reload();
    }
    });
  }
}
