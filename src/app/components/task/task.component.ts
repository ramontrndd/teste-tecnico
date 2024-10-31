import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { NewtaskComponent } from '../../dialogs/newtask/newtask.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CdkDrag,
    CdkDragHandle,
    MatTableModule,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private snackBar: SnackbarService,
    private dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.tableData();
  }

  displayedColumns: string[] = ['name', 'cost', 'endDate', 'action'];
  dataSource: any;
  responseMessage: any;

  tableData() {
    this.taskService.getTasks().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = 'Error occurred while fetching';
        }
        this.snackBar.openSnackbar(this.responseMessage, 'error');
      }
    );
  }

  handleAddTask() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'add',
    };
    dialogConfig.width = '350px';
    dialogConfig.height = '400px';

    const dialogRef = this.dialog.open(NewtaskComponent, dialogConfig);
    dialogRef.componentInstance.taskOnAdd.subscribe(() => {
      this.tableData();
    });
  }
}
