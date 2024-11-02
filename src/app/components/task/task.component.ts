import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop'; // Importando CdkDragDrop e moveItemInArray
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewtaskComponent } from '../../dialogs/newtask/newtask.component';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../../shared/GlobalConstants';
import { TaskdeleteComponent } from '../../dialogs/taskdelete/taskdelete.component';
import { TaskModel } from '../../../shared/TaskModel';

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
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = ['reorder', 'name', 'cost', 'endDate', 'action'];
  dataSource: MatTableDataSource<TaskModel> = new MatTableDataSource(); // Definindo dataSource como MatTableDataSource<TaskModel> com inicializador
  responseMessage: string = '';
  tasks: any[] = [];
  constructor(
    private taskService: TaskService,
    private snackBar: SnackbarService,
    private dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.taskService.getTasks().subscribe(
      (response: TaskModel[]) => {
        // Tipando a resposta como TaskModel[]
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.handleError(error); // Chamada do método handleError para simplificar o tratamento de erros
      }
    );
  }

  drop(event: CdkDragDrop<TaskModel[]>): void {
    // Tipando o evento drop
    moveItemInArray(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    ); // Movendo o item no array
    this.dataSource.data = [...this.dataSource.data]; // Atualiza a referência da dataSource

    // Extrair os IDs da nova ordem
    const taskIds = this.dataSource.data.map((task) => task.id);

    // Enviar a nova ordem para o backend
    this.taskService.reorderTasks(taskIds).subscribe(
      (response: any) => {
        this.snackBar.openSnackbar(response.message, 'success');
        this.tableData(); // Atualiza a tabela após a reordenação
      },
      (error: any) => {
        this.handleError(error); // Chamada do método handleError para simplificar o tratamento de erros
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

  handleEditTask(values: TaskModel) {
    // Tipando valores como TaskModel
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

  handleDeleteTask(values: TaskModel) {
    // Tipando valores como TaskModel
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

  deleteTask(id: string) {
    // Tipando o id como string
    this.taskService.deleteTask(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackBar.openSnackbar(response.message, 'success');
      },
      (error: any) => {
        this.handleError(error); // Chamada do método handleError para simplificar o tratamento de erros
      }
    );
  }

  // Método para tratar erros, centralizando o tratamento de erros
  private handleError(error: any) {
    if (error.error?.message) {
      this.responseMessage = error.error.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackbar(this.responseMessage, 'error');
  }
  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  moveTask(taskId: string, direction: 'up' | 'down'): void {
    this.taskService.moveTask(taskId, direction).subscribe(
      (response: any) => {
        this.responseMessage = response.message;
        this.tableData();
        this.snackBar.openSnackbar(this.responseMessage, 'success');
        this.loadTasks(); // Recarregar as tarefas para atualizar a UI
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
}
