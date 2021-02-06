import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'detalle-sielse',
  templateUrl: './detalle-sielse.component.html',
  styleUrls: ['./detalle-sielse.component.scss']
})
export class DetalleSielseComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetalleSielseComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }
  
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  ngOnInit() {
  }

}

