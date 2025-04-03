import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students = new BehaviorSubject<Student[]>([
    { id: 1, name: 'João Victor', age: 22, course: 'Ciência da computação', period: 'Noturno' },
    { id: 2, name: 'Gustavo', age: 20, course: 'Ciência da computação', period: 'Noturno' },
    { id: 2, name: 'Horácio', age: 21, course: 'Ciência da computação', period: 'Noturno' },
    { id: 2, name: 'Marcely', age: 22, course: 'Ciência da computação', period: 'Noturno' }
  ]);

  private currentId = 3;

  getStudents() {
    return this.students.asObservable();
  }

  addStudent(student: Omit<Student, 'id'>) {
    const newStudent = { ...student, id: this.currentId++ };
    this.students.next([...this.students.value, newStudent]);
  }

  updateStudent(updatedStudent: Student) {
    const students = this.students.value.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    );
    this.students.next(students);
  }

  deleteStudent(id: number) {
    const students = this.students.value.filter(s => s.id !== id);
    this.students.next(students);
  }
}
