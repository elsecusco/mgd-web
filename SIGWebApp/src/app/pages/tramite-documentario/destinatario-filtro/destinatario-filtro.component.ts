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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  destinatarioCtrl = new FormControl();
  allDestinatarios: Observable<Destinatario[]>;
  destinatarios: Array<Destinatario> = [];

  private _tipoBusqueda: number;
  private _porNombre: number;
  private _matLabel: string;

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
    return this.api
      .buscarDestinatario(this.porNombre, this.tipoBusqueda, value)
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
    this.returnDestinatarios.emit(this.destinatarios);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allDestinatarios.filter(destinatario => destinatario.toLowerCase().indexOf(filterValue) === 0);
  // }
  //#endregion
}
