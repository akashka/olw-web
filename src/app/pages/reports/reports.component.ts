import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Students } from '../../providers/students/students';
import { Center } from '../../providers/center/center';
import { Auth } from '../../providers/auth/auth';
import * as _ from 'lodash'
import * as moment from 'moment';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ReportsComponent {

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
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
  };

  students;
  centers;
  users;
  centerList;
  isLoading: Boolean = false;
  storage = window.localStorage;

  constructor(
    private service: SmartTableService,
    public studentService: Students,
    public centerService: Center,
    public authService: Auth,
    private toastrService: NbToastrService,
  ) {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      var user = JSON.parse(this.storage.getItem('user'));
      if (user.role != "admin") {
        data = _.filter(data, function (o) {
          return (o.center == user.center);
        });
      }
      this.students = (_.sortBy(data, 'enquiry_date')).reverse();
      this.centers = _.uniq(_.map(this.students, 'center'));
      this.users = _.uniq(_.map(this.students, 'counsellor'));
      this.isLoading = false;
    }, (err) => {
      console.log("not allowed");
    });
  }

  //Function to covert object to csv format
  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadReport() {
    var data = this.convertToCSV(this.students);
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.download = "reports.csv";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }

  mailReport() {
    var user = JSON.parse(this.storage.getItem('user'));
    this.studentService.sendReportsMail(user.email).then((data) => {
      this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Mail sent to your ID');
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', 'Please try again');
    });
    if (user.role == "admin") {
      this.studentService.sendIndentationReport(user.email).then((data) => { }, (err) => { });
    }
  }

  private showToast(type: NbToastStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 2000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = title ? `. ${title}` : '';
    this.toastrService.show(body, `${titleContent}`, config);
  }

}