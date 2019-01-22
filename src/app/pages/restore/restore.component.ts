import { Component, TemplateRef } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { NbDialogService } from '@nebular/theme';

import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';

@Component({
  selector: 'restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.scss'],
})

export class RestoreComponent {

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: true
    },
    delete: {
      deleteButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-checkmark-circle"></i> </button>',
      confirmDelete: false
    },
    noDataMessage: '',
    columns: {
      student_id: {
        title: 'Student ID',
        type: 'String',
      },
      center: {
        title: 'Center',
        type: 'String',
      },
      name: {
        title: 'Name',
        type: 'String',
      },
      parent_name: {
        title: 'Parent Name',
        type: 'String',
      },
      phone_number: {
        title: 'Phone Number',
        type: 'String',
      },
      alternate_contact: {
        title: 'Alternate No.',
        type: 'String',
      },
      class_group: {
        title: 'Class Group',
        type: 'String',
      },
      class_type: {
        title: 'Class Type',
        type: 'String',
      },
      dob: {
        title: 'DOB',
        type: 'Date',
      },
      email_id: {
        title: 'Email ID',
        type: 'String',
      },
      gender: {
        title: 'Gender',
        type: 'String',
      },
      locality: {
        title: 'Locality',
        type: 'String',
      },
      status: {
        title: 'Status',
        type: 'String',
      },
      study_year: {
        title: 'Study Year',
        type: 'String',
      },
    },
    mode: 'external',
  };
  users;
  centers;
  students;
  isLoading: Boolean = false;
  student;
  confirm;

  constructor(
    public studentService: Students,
    public authService: Auth,
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getInactiveStudents().then((data) => {
      this.students = data;
      this.isLoading = false;
    }, (err) => {
      console.log("not allowed");
    });
  }

  handle() {
    this.isLoading = true;
    this.student.is_Active = true;
    this.student.admin_edit = true;
    this.studentService.updateStudent(this.student).then((result) => {
      this.studentService.getInactiveStudents().then((data) => {
        this.students = data;
        this.confirm.close();
        this.isLoading = false;        
      }, (err) => {
        console.log("err");
        this.isLoading = false;                
      });
    }, (err) => {
        console.log("err");      
        this.isLoading = false;                
    });
  }

  delete(event, dialog: TemplateRef<any>) {
    this.student = event.data;
    this.confirm = this.dialogService.open(
      dialog, {
        context: 'Are you sure you want to restore this student data? The data can then be accessed by the center and the student.',
      }
    );
  }

}