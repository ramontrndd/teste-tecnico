import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewtaskComponent } from '../../dialogs/newtask/newtask.component';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../../shared/GlobalConstants';
import { TaskdeleteComponent } from '../../dialogs/taskdelete/taskdelete.component';
import { TaskModel } from '../../../shared/TaskModel';
import { MatTooltip } from '@angular/material/tooltip';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    DragDropModule,
    MatTooltip,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = ['reorder', 'name', 'cost', 'endDate', 'action'];
  dataSource: MatTableDataSource<TaskModel> = new MatTableDataSource();
  responseMessage: string = '';
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private snackBar: SnackbarService,
    private dialog: MatDialog,
    private route: Router,
    private ngx: NgxUiLoaderService
  ) {}

  // Método chamado ao inicializar o componente
  ngOnInit(): void {
    this.tableData();
  }

  // Carrega os dados da tabela de tarefas
  tableData() {
    this.taskService.getTasks().subscribe(
      (response: TaskModel[]) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  // Método chamado ao arrastar e soltar uma tarefa para reordenar
  drop(event: CdkDragDrop<TaskModel[]>): void {
    moveItemInArray(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    );
    this.dataSource.data = [...this.dataSource.data];

    const taskIds = this.dataSource.data.map((task) => task.id);
    this.ngx.start();
    this.taskService.reorderTasks(taskIds).subscribe(
      (response: any) => {
        this.ngx.stop();
        this.snackBar.openSnackbar(response.message, 'success');
        this.tableData();
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  // Abre o diálogo para adicionar uma nova tarefa
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

  // Abre o diálogo para editar uma tarefa existente
  handleEditTask(values: TaskModel) {
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

  // Abre o diálogo para confirmar a exclusão de uma tarefa
  handleDeleteTask(values: TaskModel) {
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

  // Exclui uma tarefa pelo ID
  deleteTask(id: string) {
    this.ngx.start();
    this.taskService.deleteTask(id).subscribe(
      (response: any) => {
        this.ngx.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackBar.openSnackbar(response.message, 'success');
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  // Carrega as tarefas do serviço
  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  // Move uma tarefa para cima ou para baixo na lista
  moveTask(taskId: string, direction: 'up' | 'down'): void {
    this.ngx.start();
    this.taskService.moveTask(taskId, direction).subscribe(
      (response: any) => {
        this.ngx.stop();
        this.responseMessage = response.message;
        this.tableData();
        this.snackBar.openSnackbar(this.responseMessage, 'success');
        this.loadTasks();
      },
      (error: any) => {
        this.ngx.stop();
        this.handleError(error);
      }
    );
  }

  // Método para tratar erros, centralizando o tratamento de erros
  private handleError(error: any) {
    this.ngx.stop();
    if (error.error?.message) {
      this.responseMessage = error.error.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackbar(this.responseMessage, 'error');
  }
}
