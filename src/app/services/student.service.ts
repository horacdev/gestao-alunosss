import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  birthDate: Date;
  course: string;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students = new BehaviorSubject<Student[]>([
    { id: 1, name: 'João Victor', birthDate: new Date(2003,0,1), course: 'Ciência da computação', period: 'Noturno' },
    { id: 2, name: 'Gustavo', birthDate: new Date(2002,0,1), course: 'Ciência da computação', period: 'Noturno' },
    { id: 3, name: 'Lucas', birthDate: new Date(2007,0,1), course: 'Ciência da computação', period: 'Noturno' },
    { id: 4, name: 'Marcely', birthDate: new Date(2001,0,1), course: 'Ciência da computação', period: 'Noturno' }
  ]);

  getStudents() {
    return this.students.asObservable();
  }

  addStudent(student: Omit<Student, 'id'>) {
    const currentStudents = this.students.value;
    const maxId = currentStudents.length ? Math.max(...currentStudents.map(s => s.id)) : 0;
    const newStudent: Student = {
      ...student,
      id: maxId + 1
    };
    this.students.next([...currentStudents, newStudent]);
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
