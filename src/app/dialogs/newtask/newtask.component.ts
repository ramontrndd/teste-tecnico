import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  provideMomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import 'moment/locale/pt-br';
import { TaskService } from '../../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CurrencyMaskDirective } from '../../../shared/directives/currecy-mastk.directive';
import { GlobalConstants } from '../../../shared/GlobalConstants';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';

const moment = _rollupMoment || _moment;
moment.locale('pt-br'); // Define o locale para 'pt-br'

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-newtask',
  standalone: true,
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatToolbarModule,
    CurrencyMaskDirective,
  ],
  templateUrl: './newtask.component.html',
  styleUrls: ['./newtask.component.scss'],
})
export class NewtaskComponent implements OnInit {
  taskForm!: FormGroup;
  responseMessage: string = '';
  dialogAction = 'Add';
  action: any = 'ADICIONAR';
  title = 'Nova Tarefa';

  @Output() taskOnAdd = new EventEmitter();
  @Output() taskOnEdit = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<NewtaskComponent>,
    private snackBar: SnackbarService,
    private ngx: NgxUiLoaderService
  ) {}

  // Inicializa o formulário e define os valores iniciais com base nos dados do diálogo
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(GlobalConstants.nameRegexWithAccents),
        ],
      ],
      cost: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'ATUALIZAR';
      this.title = 'Editar Tarefa';
      this.taskForm.patchValue(this.dialogData.task);
    }
  }

  // Lida com a submissão do formulário, chamando a função apropriada com base na ação do diálogo
  handleSubmit() {
    if (this.dialogData.action === 'Add') {
      this.onAdd();
    } else if (this.dialogData.action === 'Edit') {
      this.onEdit();
    }
  }

  // Adiciona uma nova tarefa usando os dados do formulário
  onAdd() {
    const formData = this.taskForm.value;
    const data = {
      name: formData.name,
      cost: formData.cost,
      endDate: formData.endDate
        ? moment(formData.endDate).format('YYYY-MM-DD')
        : null,
    };
    this.ngx.start();
    this.taskService.addTask(data).subscribe(
      (response) => {
        this.ngx.stop();
        this.dialogRef.close();
        this.taskOnAdd.emit();
        this.responseMessage = response.message;
        this.snackBar.openSnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngx.stop();
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Edita uma tarefa existente usando os dados do formulário
  onEdit(): void {
    const formData = this.taskForm.value;
    const data = {
      id: this.dialogData.task.id,
      name: formData.name,
      cost: formData.cost,
      endDate: formData.endDate
        ? moment(formData.endDate).format('YYYY-MM-DD')
        : null,
    };
    this.ngx.start();
    this.taskService.updateTask(data).subscribe(
      (response) => {
        this.ngx.stop();
        this.dialogRef.close();
        this.taskOnEdit.emit();
        this.responseMessage = response.message;
        this.snackBar.openSnackbar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngx.stop();
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
