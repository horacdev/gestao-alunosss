import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  displayedColumns: string[] = ['name', 'age', 'course', 'period', 'actions'];
  dataSource: Student[] = [];
  originalData: Student[] = [];
  searchTerm = '';
  currentSort: Sort | null = null;

  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.studentService.getStudents().subscribe(students => {
      this.originalData = [...students];
      this.dataSource = [...students];
      

      if (this.searchTerm) this.applyFilter();
      if (this.currentSort) this.sortData(this.currentSort);
    });
  }

  applyFilter() {
    let filteredData = this.originalData.filter(student =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.currentSort) {
      filteredData = this.sortDataInternal(filteredData, this.currentSort);
    }

    this.dataSource = filteredData;
  }

  sortData(sort: Sort) {
    this.currentSort = sort;
    this.dataSource = this.sortDataInternal([...this.dataSource], sort);
  }

  private sortDataInternal(data: Student[], sort: Sort): Student[] {
    if (!sort.active || sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'age': return compare(a.age, b.age, isAsc);
        default: return 0;
      }
    });
  }

  deleteStudent(student: Student) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Deseja excluir o aluno ${student.name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(student.id);
      }
    });
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}