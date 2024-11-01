import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewtaskComponent } from '../../dialogs/newtask/newtask.component';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../../shared/GlobalConstants';
import { TaskdeleteComponent } from '../../dialogs/taskdelete/taskdelete.component';

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

  displayedColumns: string[] = ['reorder', 'name', 'cost', 'endDate', 'action'];
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
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  handleAddTask() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '350px';
    dialogConfig.height = '400px';

    const dialogRef = this.dialog.open(NewtaskComponent, dialogConfig);
    this.route.events.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.componentInstance.taskOnAdd.subscribe(() => {
      this.tableData();
    });
  }

  handleEditTask(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      task: values,
    };
    dialogConfig.width = '350px';
    dialogConfig.height = '380px';
    const dialogRef = this.dialog.open(NewtaskComponent, dialogConfig);
    this.route.events.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.componentInstance.taskOnEdit.subscribe(() => {
      this.tableData();
    });
  }

  handleDeleteTask(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: '' + values.name + ' tarefa ',
    };
    dialogConfig.width = '250px';

    const dialogRef = this.dialog.open(TaskdeleteComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitDelete.subscribe(() => {
      this.deleteTask(values.id);
      dialogRef.close();
    });
  }

  deleteTask(id: any) {
    this.taskService.deleteTask(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackBar.openSnackbar(response.message, 'success');
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, 'error');
      }
    );
  }
}
