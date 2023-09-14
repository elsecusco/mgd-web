import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  finalize,
} from 'rxjs/operators';

import { Area } from '../../../@models/tramite/area';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'area-filtro',
  templateUrl: './area-filtro.component.html',
  styleUrls: ['./area-filtro.component.scss'],
})
export class AreaFiltroComponent implements OnInit {
  show = 'hidden';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonlyChips = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  areaCtrl = new FormControl();
  allAreas!: Observable<Area[]>;
  areas: Array<Area> = [];

  private _matLabel: string = '';

  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }

  @Output() returnAreas = new EventEmitter<Area[]>();

  @ViewChild('areaInput') areaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(private api: TramiteService) {}

  displayFn = (d?: Area) => (d ? d.nombreArea : '');

  ngOnInit() {
    this.allAreas = this.areaCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((nombre) => this.buscarArea(nombre))
    );
  }
  buscarArea(value: any): Observable<Area[]> {
    if (typeof value == 'object' || value.length < 5) return of([]);

    this.show = 'visible';
    return this.api
      .buscarArea(value)
      .pipe(finalize(() => (this.show = 'hidden')));
  }

  //#region Funciones de Chips-AutoComplete
  add(event: MatChipInputEvent): void {
    // Add area only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //   // Add our area
    //   if ((value || '').trim()) {
    //     this.areas.push(value);
    //   }
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //   this.areaCtrl.setValue(null);
    // }
  }

  remove(area: Area): void {
    const index = this.areas.indexOf(area);

    if (index >= 0) {
      this.areas.splice(index, 1);
    }
    this.returnAreas.emit(this.areas);
    this.readonlyChips = this.areas.length > 0;
  }
  removeAll(): void {
    this.areas = [];
    this.returnAreas.emit(this.areas);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const destAux = <Area>event.option.value;
    const dest = this.areas.find(
      (d) => d.nombreArea.toUpperCase() == destAux.nombreArea.toUpperCase()
    );
    if (dest === null || dest === undefined) {
      this.areas.push(<Area>event.option.value);
      this.areaInput.nativeElement.value = '';
      this.areaCtrl.setValue(null);
    } else if (dest != null) {
      this.areaInput.nativeElement.value = '';
      this.areaCtrl.setValue(null);
    }
    this.readonlyChips = this.areas.length > 0;
    this.returnAreas.emit(this.areas);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allAreas.filter(area => area.toLowerCase().indexOf(filterValue) === 0);
  // }
  //#endregion
}
