import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { RouterLink } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

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
    RouterLink,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' }
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
  today: Date = new Date();

  studentForm = this.fb.group({
    name: ['', [Validators.required, this.onlyLettersValidator()]],
    birthDate: [null as Date | null, [Validators.required, this.futureDateValidator]],
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
            name: foundStudent.name,
            birthDate: foundStudent.birthDate ?? null,
            course: foundStudent.course,
            period: foundStudent.period
          });
        }
      });
    }
  }

  toTitleCase(value: string): string {
    return value.replace(/\S+/g, word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value;
      if (!raw) return null;

      const value = raw.trim().replace(/\s+/g, ' ');
      const isEmpty = value.replace(/\s/g, '') === '';
      const valid = /^[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/.test(value);

      return !isEmpty && valid ? null : { onlyLetters: true };
    };
  }

  futureDateValidator(control: AbstractControl) {
    const date = new Date(control.value);
    const today = new Date();
    return date > today ? { futureDate: true } : null;
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - new Date(birthDate).getFullYear();
    const m = today.getMonth() - new Date(birthDate).getMonth();
    if (m < 0 || (m === 0 && today.getDate() < new Date(birthDate).getDate())) {
      age--;
    }
    return age;
  }

  private fromAgeToDate(age: number): Date {
    const now = new Date();
    return new Date(now.getFullYear() - age, now.getMonth(), now.getDate());
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const birthDate = new Date(formValue.birthDate!);

      const cleanedName = this.toTitleCase(
        formValue.name!.replace(/\s+/g, ' ').trim()
      );

      const studentData: Omit<Student, 'id'> = {
        name: cleanedName,
        birthDate: birthDate,
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