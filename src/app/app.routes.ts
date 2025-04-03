import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentFormComponent } from './student-form/student-form.component';

export const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'form', component: StudentFormComponent },
  { path: 'form/:id', component: StudentFormComponent }
];