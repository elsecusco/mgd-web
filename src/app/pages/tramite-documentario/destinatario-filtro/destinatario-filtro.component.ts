import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { Observable, of } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  finalize
} from 'rxjs/operators';

import { Destinatario } from '@models/tramite/destinatario';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'destinatario-filtro',
  templateUrl: './destinatario-filtro.component.html',
  styleUrls: ['./destinatario-filtro.component.scss']
})
export class DestinatarioFiltroComponent implements OnInit {
  show = 'hidden';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonlyChips=false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  destinatarioCtrl = new FormControl();
  allDestinatarios: Observable<Destinatario[]>;
  destinatarios: Array<Destinatario> = [];
  

  private _tipoBusqueda: number;
  private _porNombre: number;
  private _matLabel: string;
  private _onlyOne: boolean=false;
  private _all: boolean=false;
  private _blacklist: string = '';
  private _loginUsuario: string =null;
  
  @Input()
  set tipoBusqueda(tipoBusqueda: number) {
    this._tipoBusqueda = tipoBusqueda || 1;
  }
  get tipoBusqueda(): number {
    return this._tipoBusqueda;
  }

  @Input()
  set porNombre(porNombre: number) {
    this._porNombre = porNombre || 1;
  }
  get porNombre(): number {
    return this._porNombre;
  }

  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }

  @Input()
  set onlyOne(onlyOne: boolean) {
    this._onlyOne = onlyOne || false;
  }
  get onlyOne(): boolean {
    return this._onlyOne;
  }

  @Input()
  set all(all: boolean) {
    this._all = all || false;
  }
  get all(): boolean {
    return this._onlyOne;
  }

  @Input()
  set blacklist(blacklist: string) {
    this._blacklist = blacklist || '';
  }
  get blacklist(): string {
    return this._blacklist;
  }

  @Input()
  set loginUsuario(loginUsuario: string) {
    this._loginUsuario = loginUsuario || null;
  }
  get loginUsuario(): string {
    return this._loginUsuario;
  }

  @Output() returnDestinatarios = new EventEmitter<Destinatario[]>();

  @ViewChild('destinatarioInput') destinatarioInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private api: TramiteService) {}

  displayFn = (d?: Destinatario) => (d ? d.nombreUsuario : undefined);

  ngOnInit() {
    this.allDestinatarios = this.destinatarioCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(nombre => this.buscarDestinatario(nombre))
    );
  }
  buscarDestinatario(value): Observable<Destinatario[]> {
    if (typeof value == 'object' || value.length < 5) return of([]);

    this.show = 'visible';
    if(this.all)
      return this.api
      .buscarDestinatarioTodos(this.porNombre, this.tipoBusqueda, value)
      .pipe(finalize(() => (this.show = 'hidden')));
    else
    return this.api
      .buscarDestinatario(this.porNombre, this.tipoBusqueda, value, this.blacklist,this.loginUsuario)
      .pipe(finalize(() => (this.show = 'hidden')));
  }

  //#region Funciones de Chips-AutoComplete
  add(event: MatChipInputEvent): void {
    // Add destinatario only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //   // Add our destinatario
    //   if ((value || '').trim()) {
    //     this.destinatarios.push(value);
    //   }
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //   this.destinatarioCtrl.setValue(null);
    // }
  }
  

  remove(destinatario: Destinatario): void {
    const index = this.destinatarios.indexOf(destinatario);

    if (index >= 0) {
      this.destinatarios.splice(index, 1);
    }
    this.returnDestinatarios.emit(this.destinatarios);
    this.readonlyChips = (this.onlyOne && (this.destinatarios.length>0));
  }
  removeAll():void{
    this.destinatarios=[];
    this.returnDestinatarios.emit(this.destinatarios);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const destAux = <Destinatario>event.option.value;
    const dest = this.destinatarios.find(
      d => d.nombreUsuario.toUpperCase() == destAux.nombreUsuario.toUpperCase()
    );
    if (dest === null || dest === undefined) {
      this.destinatarios.push(<Destinatario>event.option.value);
      this.destinatarioInput.nativeElement.value = '';
      this.destinatarioCtrl.setValue(null);
    } else if (dest != null) {
      this.destinatarioInput.nativeElement.value = '';
      this.destinatarioCtrl.setValue(null);
    }
    this.readonlyChips = (this.onlyOne && (this.destinatarios.length>0));
    this.returnDestinatarios.emit(this.destinatarios);
  }
  public setDefault(destinatarioDefault:Destinatario){
    this.destinatarios=[destinatarioDefault];
    this.returnDestinatarios.emit(this.destinatarios);
  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allDestinatarios.filter(destinatario => destinatario.toLowerCase().indexOf(filterValue) === 0);
  // }
  //#endregion
}
