import { Component } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';
import { Router } from '@angular/router';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.scss'],
})

export class ConfirmComponent {

  // Variables to be saved in DB for users

  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false
    },
    edit: {
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-edit"></i> </button>',
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
      study_year: {
        title: 'Study Year',
        type: 'String',
      },
    },
    mode: 'external',
  };
  students;
  isLoading: Boolean = false;
  storage = window.localStorage;

  constructor(
    public centerService: Center,
    public studentService: Students,
    public authService: Auth,
    public router: Router,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      var user = JSON.parse(this.storage.getItem('user'));
      data = _.filter(data, function (o) {
        return (o.status == 'enquiry' && !o.is_Confirmed && o.center == user.center);
      });
      this.students = (_.sortBy(data, 'enquiry_date')).reverse();
      this.isLoading = false;
    }, (err) => {
      console.log("not allowed");
    });
  }

  update(event) {
    var url = './pages/confirmstudent/' + event.data._id;
    this.router.navigate([url]);
  }

}
