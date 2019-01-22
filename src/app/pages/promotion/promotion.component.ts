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
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-edit"></i> </button>',
    },
    noDataMessage: '',
    columns: {
      num: {
        title: 'Indentation No',
        type: 'String',
      },
      email: {
        title: 'Email ID',
        type: 'String',
      },
      center_code: {
        title: 'Center Code',
        type: 'String',
      },
      total_amount: {
        title: 'Total Amount',
        type: 'String',
      },
      payment_mode: {
        title: 'Payment Mode',
        type: 'String',
      },
      payment_date: {
        title: 'Payment Date',
        type: 'String',
      },
      bank_name: {
        title: 'Bank Name',
        type: 'String',
      },
      transaction_no: {
        title: 'Transaction No',
        type: 'String',
      },
      cheque_no: {
        title: 'Cheque No',
        type: 'String',
      },
      deliveryTime: {
        title: 'Delivery Time',
        type: 'String',
      },
      status: {
        title: 'Status',
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
      console.log("not allowed");
    });
  }

  update(event) {
    var url = './pages/promotestudent/' + event.data._id;
    this.router.navigate([url]);
  }

  // showMessage(student) {
  // let alert = this.alertCtrl.create({
  //   title: 'Details Missing',
  //   inputs: [
  //     {
  //       name: 'parent_name',
  //       placeholder: 'Parent Name'
  //     },
  //     {
  //       name: 'locality',
  //       placeholder: 'Locality'
  //     }
  //   ],
  //   buttons: [
  //     {
  //       text: 'Cancel',
  //       role: 'cancel',
  //       handler: data => {
  //         this.storage.set('confirmed_student', student);
  //         this.navCtrl.setRoot(ConfirmPage);
  //       }
  //     },
  //     {
  //       text: 'Save',
  //       handler: data => {
  //         student.parent_name = data.parent_name;
  //         student.locality = data.locality;
  //         this.storage.set('confirmed_student', student);
  //         this.navCtrl.setRoot(ConfirmPage);
  //       }
  //     }
  //   ]
  // });
  // alert.present();
  // }

  // update(student) {
  //   student.is_Indented = false;
  //   student.is_Confirmed = false;
  //   student.is_Delivered = false;
  //   student.confirmation_date = null;
  //   student.indentation_date = null;
  //   student.delivery_date = null;

  //   if (student.class_group === 'UKG') { student.class_group = 'UKG'; }
  //   if (student.class_group === 'LKG') { student.class_group = 'UKG'; }
  //   if (student.class_group === 'Nursery') { student.class_group = 'LKG'; }
  //   if (student.class_group === 'Play Group') { student.class_group = 'Nursery'; }

  //   if (student.study_year === '2019-20') { student.study_year = '2020-21'; }
  //   if (student.study_year === '2018-19') { student.study_year = '2019-20'; }
  //   if (student.study_year === '2017-18') { student.study_year = '2018-19'; }
  //   if (student.study_year === '2016-17') { student.study_year = '2017-18'; }

  //   this.storage.set('confirmed_student', student);
  //   if (student.parent_name == "") this.showMessage(student);
  //   else this.navCtrl.setRoot(ConfirmPage);
  // }

}
