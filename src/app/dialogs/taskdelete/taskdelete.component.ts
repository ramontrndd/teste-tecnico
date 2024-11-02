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
  // O construtor injeta dados do diálogo usando MAT_DIALOG_DATA
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  // Evento que será emitido quando a ação de deletar for acionada
  @Output() onEmitDelete = new EventEmitter();

  // Detalhes dos dados recebidos pelo diálogo
  details: any;

  // Método chamado quando o componente é inicializado
  ngOnInit(): void {
    // Se houver dados no diálogo, eles são atribuídos a 'details'
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }

  // Método que emite o evento de deletar
  handleChangeAction() {
    this.onEmitDelete.emit();
  }
}
