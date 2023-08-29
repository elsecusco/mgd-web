import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'table-toggle-column',
  templateUrl: 'table-toggle-column.html'
})
export class TableToggleColumn implements OnInit {
  @Input() headers: string[];
  @Input() columnas: string[];
  @Output() changeSelect = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}
  changeDisplayColumn(checked, index) {
    this.changeSelect.emit({ checked, index });
  }
}
