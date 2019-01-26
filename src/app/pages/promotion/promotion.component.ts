import { Component, TemplateRef } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';
import { Router } from '@angular/router';
import { Indentation } from '../../providers/indentation/indentation';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Component({
  selector: 'promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.scss'],
})

export class PromotionComponent {

  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false
    },
    edit: {
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-checkmark-circle"></i> </button>',
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

  isLoading: Boolean = false;
  storage = window.localStorage;
  dia;
  students;

  constructor(
    public centerService: Center,
    public studentService: Students,
    public authService: Auth,
    public router: Router,
    private dialogService: NbDialogService,
    public indentationService: Indentation,    
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      var user = JSON.parse(this.storage.getItem('user'));
      data = _.filter(data, function (o) {
        return (o.status == 'indented' && o.is_Indented && o.study_year == '2018-19' && o.center == user.center);
      });
      this.students = _.sortBy(data, 'name');
      this.isLoading = false;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log("not allowed");
    });
  }

  update(event) {
    var url = './pages/promotestudent/' + event.data._id;
    this.router.navigate([url]);
  }

  private showToast(type: NbToastStatus, title: string, body: string) {
    let audio = new Audio();
    audio.src = "http://www.noiseaddicts.com/samples_1w72b820/3724.mp3";
    audio.load();
    audio.play();
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = title ? `${title}` : '';
    this.toastrService.show(body, `${titleContent}`, config);
  }

}
