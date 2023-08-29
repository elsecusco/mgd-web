import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'extern-page',
  templateUrl: './extern-page.component.html',
  styleUrls: ['./extern-page.component.scss']
})
export class ExternPageComponent implements OnInit {
  showForm = false;
  titulo: string = '';
  subtitulo:string = '';
  footer: string = '';
  constructor() { }

  ngOnInit() {
    this.titulo = 'Mesa de Partes Virtual';
    this.subtitulo = 'Electro Sur Este'
    this.footer = `ELSE © ${new Date().getFullYear()} | Todos los derechos reservados.`;
  }


}
