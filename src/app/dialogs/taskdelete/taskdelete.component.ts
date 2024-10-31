import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-taskdelete',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './taskdelete.component.html',
  styleUrl: './taskdelete.component.scss',
})
export class TaskdeleteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}
  @Output() onEmitDelete = new EventEmitter();
  details: any;

  ngOnInit(): void {
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }
  handleChangeAction() {
    this.onEmitDelete.emit();
  }
}
