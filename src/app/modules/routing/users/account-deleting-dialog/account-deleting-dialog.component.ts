import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../../../shared/posts/single-post/single-post.component';

@Component({
  selector: 'app-account-deleting-dialog',
  templateUrl: './account-deleting-dialog.component.html',
  styleUrls: ['./account-deleting-dialog.component.scss']
})
export class AccountDeletingDialogComponent implements OnInit {
  output!: object;
  constructor(public dialogRef: MatDialogRef<AccountDeletingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.data.outputHandler = 'confirm';
  }
  onAbort(): void {
    this.dialogRef.close();
  }
}
