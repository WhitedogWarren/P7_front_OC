import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-deleting-dialog',
  templateUrl: './deleting-dialog.component.html',
  styleUrls: ['./deleting-dialog.component.scss']
})
export class DeletingDialogComponent implements OnInit {
  output!: object;
  constructor(public dialogRef: MatDialogRef<DeletingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {handler:string}) { }

  ngOnInit(): void {
    this.data.handler = 'confirm';
  }
  onAbort(): void {
    this.dialogRef.close();
  }
}
