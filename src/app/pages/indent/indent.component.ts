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
  selector: 'indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.scss'],
})

export class IndentComponent {

  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false
    },
    edit: {
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-checkmark-circle"></i> </button>',
    },
    rowClassFunction: (row) => {
      if (row.data.indented) {
        if (row.data.study_year !== '2019-20') {
          return 'hide-action-indented';
        } else {
          return 'indented';
        }
      } else {
        if (row.data.study_year !== '2019-20') {
          return 'hide-action';
        }
      }
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
  indented_students = [];
  user_center;
  isCash: boolean = false;
  myInput: string;
  total_amount: number = 0;
  payment_mode;
  payment_date = moment().format("YYYY-MM-DD");
  bank_name;
  transaction_no;
  cheque_no;
  email;
  center_code;
  students_amount = [];
  today_date = moment().format("YYYY-MM-DD");
  dia;
  counter = 0;

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
    this.reset();
  }

  reset() {
    this.indented_students = [];
    this.total_amount = 0;
    this.students_amount = [];
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      let user = JSON.parse(this.storage.getItem('user'));
      this.students = _.filter(data, function (o) {
        return (o.status == 'confirmed' && !o.is_Indented && o.center == user.center);
      });
      this.students = _.sortBy(this.students, 'enquiry_date');
      this.isLoading = false;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log("not allowed");
    });
    this.centerService.searchCenter().then((centers) => {
      let user = JSON.parse(this.storage.getItem('user'));
      this.email = user.email;
      this.center_code = user.center;
      this.user_center = _.find(centers, ['center_code', user.center]);
      this.isCash = this.user_center.cash;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
    });
  }

  update(event) {
    var isFound = false;
    for (var i = 0; i < this.indented_students.length; i++) {
      if (this.indented_students[i]._id == event.data._id) isFound = true;
    }
    if (!isFound) this.indent(event.data);
    else this.unindent(event.data);
  }

  indent(student) {
    if(student.study_year == '2019-20'){
      this.indented_students.push(student);
      for (var i = 0; i < this.students.length; i++) {
        if (this.students[i] === student) this.students[i].indented = true;
      }
      this.addAmount(student);
    }
  }

  unindent(student) {
    var s = -1;
    for (var i = 0; i < this.indented_students.length; i++) {
      if (this.indented_students[i] === student) {
        s = i;
        break;
      }
    }
    this.indented_students.splice(s, 1);
    for (var k = 0; k < this.students.length; k++) {
      if (this.students[k] === student) delete this.students[k].indented;
    }
    this.subtractAmount(student);
  }

  addAmount(student: any) {
    if (student.class_group === 'Play Group') {
      if (student.class_type === "Annual") this.total_amount += Number(this.user_center.playgroup.annual);
      if (student.class_type === "Mid-term") this.total_amount += Number(this.user_center.playgroup.mid_term);
      if (student.class_type === "Early start") this.total_amount += Number(this.user_center.playgroup.early_start);
    }
    else if (student.class_group === 'Nursery') {
      if (student.class_type === "Annual") this.total_amount += Number(this.user_center.nursery.annual);
      if (student.class_type === "Mid-term") this.total_amount += Number(this.user_center.nursery.mid_term);
      if (student.class_type === "Early start") this.total_amount += Number(this.user_center.nursery.early_start);
    }
    else if (student.class_group === 'LKG') {
      if (student.class_type === "Annual") this.total_amount += Number(this.user_center.lkg.annual);
      if (student.class_type === "Mid-term") this.total_amount += Number(this.user_center.lkg.mid_term);
      if (student.class_type === "Early start") this.total_amount += Number(this.user_center.lkg.early_start);
    }
    else if (student.class_group === 'UKG') {
      if (student.class_type === "Annual") this.total_amount += Number(this.user_center.ukg.annual);
      if (student.class_type === "Mid-term") this.total_amount += Number(this.user_center.ukg.mid_term);
      if (student.class_type === "Early start") this.total_amount += Number(this.user_center.ukg.early_start);
    }
  }

  subtractAmount(student: any) {
    if (student.class_group === 'Play Group') {
      if (student.class_type === "Annual") this.total_amount -= this.user_center.playgroup.annual;
      if (student.class_type === "Mid-term") this.total_amount -= this.user_center.playgroup.mid_term;
      if (student.class_type === "Early start") this.total_amount -= this.user_center.playgroup.early_start;
    }
    else if (student.class_group === 'Nursery') {
      if (student.class_type === "Annual") this.total_amount -= this.user_center.nursery.annual;
      if (student.class_type === "Mid-term") this.total_amount -= this.user_center.nursery.mid_term;
      if (student.class_type === "Early start") this.total_amount -= this.user_center.nursery.early_start;
    }
    else if (student.class_group === 'LKG') {
      if (student.class_type === "Annual") this.total_amount -= this.user_center.lkg.annual;
      if (student.class_type === "Mid-term") this.total_amount -= this.user_center.lkg.mid_term;
      if (student.class_type === "Early start") this.total_amount -= this.user_center.lkg.early_start;
    }
    else if (student.class_group === 'UKG') {
      if (student.class_type === "Annual") this.total_amount -= this.user_center.ukg.annual;
      if (student.class_type === "Mid-term") this.total_amount -= this.user_center.ukg.mid_term;
      if (student.class_type === "Early start") this.total_amount -= this.user_center.ukg.early_start;
    }
  }

  findAmount(cg, ct) {
    if (cg === 'Play Group' && ct === 'Annual') return (this.user_center.playgroup.annual);
    else if (cg === 'Play Group' && ct === 'Mid-term') return (this.user_center.playgroup.mid_term);
    else if (cg === 'Play Group' && ct === 'Early start') return (this.user_center.playgroup.early_start);
    else if (cg === 'Nursery' && ct === 'Annual') return (this.user_center.nursery.annual);
    else if (cg === 'Nursery' && ct === 'Mid-term') return (this.user_center.nursery.mid_term);
    else if (cg === 'Nursery' && ct === 'Early start') return (this.user_center.nursery.early_start);
    else if (cg === 'LKG' && ct === 'Annual') return (this.user_center.lkg.annual);
    else if (cg === 'LKG' && ct === 'Mid-term') return (this.user_center.lkg.mid_term);
    else if (cg === 'LKG' && ct === 'Early start') return (this.user_center.lkg.early_start);
    else if (cg === 'UKG' && ct === 'Annual') return (this.user_center.ukg.annual);
    else if (cg === 'UKG' && ct === 'Mid-term') return (this.user_center.ukg.mid_term);
    else if (cg === 'UKG' && ct === 'Early start') return (this.user_center.ukg.early_start);
    else return 0;
  }

  indentStudents(dialog: TemplateRef<any>) {
    this.setCheque();
    this.dia = this.dialogService.open(dialog);
  }

  setCash() {
    this.payment_mode = "cash";
  }

  setCheque() {
    this.payment_mode = "cheque";
  }

  setOnline() {
    this.payment_mode = "online";
  }

  confirmIndent() {
    this.isLoading = true;
    let indentation = {
      total_amount: this.total_amount,
      payment_mode: this.payment_mode,
      payment_date: moment(this.payment_date, "YYYY-MM-DD").toDate(),
      bank_name: this.bank_name,
      transaction_no: this.transaction_no,
      cheque_no: this.cheque_no,
      email: this.email,
      center_code: this.center_code,
      students_amount: []
    };

    for (var is = 0; is < this.indented_students.length; is++) {
      var tempis = {
        student_id: this.indented_students[is].student_id,
        student_key: this.indented_students[is]._id,
        student_name: this.indented_students[is].name,
        phone_number: this.indented_students[is].phone_number,
        gender: this.indented_students[is].gender,
        class_group: this.indented_students[is].class_group,
        class_type: this.indented_students[is].class_type,
        uniform_size: this.indented_students[is].uniform_size,
        shoe_size: this.indented_students[is].shoe_size,
        amount: this.findAmount(this.indented_students[is].class_group, this.indented_students[is].class_type),
        is_dispatched: false
      };
      indentation.students_amount.push(tempis);
    }

    this.indentationService.createIndentation(indentation).then((result) => {
      for (var ik = 0; ik < this.indented_students.length; ik++) {
        this.indented_students[ik].status = "indented";
        this.indented_students[ik].is_Indented = true;
        this.indented_students[ik].admin_edit = false;
        delete this.indented_students[ik].indented;
        this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Indentation Completed Successfully');

        this.studentService.updateStudent(this.indented_students[ik]).then((result) => {
          this.counter++;
          if(this.counter == this.indented_students.length) {
            this.dia.close();
            this.isLoading = false;
            this.router.navigate(['/pages/confirm']);        
          }
        }, (err) => {
          this.counter++;
          if(this.counter == this.indented_students.length) {
            this.dia.close();
            this.isLoading = false;
            this.router.navigate(['/pages/confirm']);        
          }
        });
      }
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      this.isLoading = false;
    });

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
