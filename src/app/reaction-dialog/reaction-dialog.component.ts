import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../single-post/single-post.component';

@Component({
  selector: 'app-reaction-dialog',
  templateUrl: './reaction-dialog.component.html',
  styleUrls: ['./reaction-dialog.component.scss']
})
export class ReactionDialogComponent implements OnInit {
  output!: object;
  constructor(public dialogRef: MatDialogRef<ReactionDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    if(this.data.askedReaction == this.data.currentReaction)
      this.data.outputHandler = 'unset';
    else
      this.data.outputHandler = 'replace';
  }

  onAbort(): void {
    this.dialogRef.close();
  }
}
