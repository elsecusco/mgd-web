import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: ['./chips-autocomplete.component.scss']
})
export class ChipsAutocompleteComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  objectControl = new FormControl();
  filteredObjects: Observable<string[]>;
  objects: any[] = [];
  private _matLabel = '';
  private _allObjects: any[] = [];
  private _nameObject: string;
  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }

  @Input()
  set nameObject(nameObject: string) {
    this._nameObject = nameObject || '';
  }
  get nameObject(): string {
    return this._nameObject;
  }

  @Input()
  set allObjects(allObjects: any[]) {
    this._allObjects = allObjects || [];
  }
  get allObjects(): any[] {
    return this._allObjects;
  }

  @Output() returnObjects = new EventEmitter< any[] >();

  @ViewChild('objectInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredObjects = this.objectControl.valueChanges.pipe(
        startWith(null),
        map((object: string | null) => object ? this._filter(object) : this.allObjects.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add object only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our object
      if ((value || '').trim()) {
        this.objects.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.returnObjects.emit(this.objects);
      this.objectControl.setValue(null);
    }
  }

  remove(object: string): void {
    const index = this.objects.indexOf(object);

    if (index >= 0) {
      this.objects.splice(index, 1);
    }
    this.returnObjects.emit(this.objects);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.objects.push(event.option.viewValue);
    this.returnObjects.emit(this.objects);
    this.fruitInput.nativeElement.value = '';
    this.objectControl.setValue(null);
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.allObjects.filter(object => object[this.nameObject].toLowerCase().indexOf(filterValue) === 0);
  }
}
