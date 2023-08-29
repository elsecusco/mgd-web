import {
  Component,
  EventEmitter,
  OnInit,
  Output} from '@angular/core';
import {FormBuilder } from '@angular/forms';

@Component({
  selector: 'mesa-form',
  templateUrl: './mesa-form.component.html',
  styleUrls: ['./mesa-form.component.scss']
})
export class MesaFormComponent implements OnInit {
  @Output() show = new EventEmitter<boolean>();
  constructor(public fb: FormBuilder) {}

  ngOnInit() {}

  send() {
    this.show.emit(true);
  }
}
