import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-account-deleting-dialog',
  templateUrl: './account-deleting-dialog.component.html',
  styleUrls: ['./account-deleting-dialog.component.scss']
})
export class AccountDeletingDialogComponent implements OnInit {
  output!: object;
  //data!: {handler:string};
  constructor(public dialogRef: MatDialogRef<AccountDeletingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {handler:string}) { }

  ngOnInit(): void {
    this.data.handler = 'confirm';
  }
  onAbort(): void {
    this.dialogRef.close();
  }
}
