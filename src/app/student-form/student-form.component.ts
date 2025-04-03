import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isEdit = false;
  studentId?: number;

  studentForm = this.fb.group({
    name: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(1)]], // Alterado de null para 0
    course: ['', Validators.required],
    period: ['', Validators.required]
  });

  periods = ['Matutino', 'Vespertino', 'Noturno'];
  courses = ['Administração', 'Ciência da Computação', 'Direito', 'Enfermagem', 'Engenharia', 'Medicina', 'Odontologia'];

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.studentId = +id;
      this.studentService.getStudents().subscribe(students => {
        const foundStudent = students.find(s => s.id === this.studentId);
        if (foundStudent) {
          this.studentForm.patchValue({
            ...foundStudent,
            age: foundStudent.age // Garante que o tipo number seja mantido
          });
        }
      });
    }
  }
  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const studentData: Omit<Student, 'id'> = {
        name: formValue.name!,
        age: Number(formValue.age),
        course: formValue.course!,
        period: formValue.period!
      };
  
      if (this.isEdit && this.studentId) {
        this.studentService.updateStudent({ ...studentData, id: this.studentId });
      } else {
        this.studentService.addStudent(studentData);
      }
      
      this.router.navigate(['/']);
    }
  }
}