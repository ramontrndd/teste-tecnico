import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, CdkDrag, CdkDragHandle, MatTableModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.tableData();
  }

  displayedColumns: string[] = ['name', 'cost', 'endDate'];
  dataSource: any;
  responseMessage: any;

  tableData() {
    this.taskService.getTasks().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error.message;
      } else {
        this.responseMessage = 'Error occurred while fetching';
      }
      this.snackBar.openSnackbar(this.responseMessage, 'error');
    });
  }
}
