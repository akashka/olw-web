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
  selector: 'dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.scss'],
})

export class DispatchComponent {

  settings_indent = {
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

  settings_student = {
    actions: {
      add: false,
      edit: true,
      delete: true
    },
    edit: {
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-edit"></i> </button>',
    },
    delete: {
      deleteButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-edit"></i> </button>',
    },
    noDataMessage: '',
    columns: {
      student_name: {
        title: 'Student Name',
        type: 'String',
      },
      phone_number: {
        title: 'Phone No',
        type: 'String',
      },
      gender: {
        title: 'Gender',
        type: 'String',
      },
      class_type: {
        title: 'Class Type',
        type: 'String',
      },
      class_group: {
        title: 'Class Group',
        type: 'String',
      },
      shoe_size: {
        title: 'Shoe Size',
        type: 'String',
      },
      uniform_size: {
        title: 'Uniform Size',
        type: 'String',
      },
    },
    mode: 'external',
  }

  isLoading: Boolean = false;
  storage = window.localStorage;
  dia;
  indentations: any = [];
  selected_indentation: any;
  list_of_students: any = [];
  all_list_of_students: any = [];
  confirm_dispatch: boolean = false;
  show_button: any = 0;
  msg: string = "";
  showModal: boolean = false;
  this_student: any;
  myInputIndentation: String = "";
  myInputStudent: String = "";

  constructor(
    public centerService: Center,
    public studentService: Students,
    public authService: Auth,
    public router: Router,
    private dialogService: NbDialogService,
    public indentationService: Indentation,
  ) { }

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.list_of_students = [];
    this.all_list_of_students = [];
    this.confirm_dispatch = false;
    this.show_button = 0;
    this.msg = "";
    this.myInputIndentation = "";
    this.myInputStudent = "";
    this.isLoading = true;
    this.indentationService.searchIndentation().then((data) => {
      this.indentations = _.filter(data, function (o) {
        return (o.status != 'closed');
      });
      this.isLoading = false;
    }, (err) => {
      console.log("not allowed");
    });
  }

  update_indent(event) {
    this.confirm_dispatch = true;
    this.selected_indentation = event.data;
    this.list_of_students = _.filter(this.selected_indentation.students_amount, function (o) {
      return (!o.is_dispatched);
    });
    this.all_list_of_students = this.list_of_students;
  }

  update_student(event, dialog: TemplateRef<any>) {
    this.dispatch(event.data);
  }

  delete_student(event, dialog: TemplateRef<any>) {
    this.partial(event.data, dialog);
  }

  dispatch(student) {
    this.show_button++;
    for (var i = 0; i < this.list_of_students.length; i++) {
      if (this.list_of_students[i].student_id == student.student_id) {
        this.list_of_students[i].is_dispatched = true;
        this.list_of_students[i].is_partial = false;
      }
    }
    for (var i = 0; i < this.selected_indentation.students_amount.length; i++) {
      if (this.selected_indentation.students_amount[i].student_id == student.student_id) {
        this.selected_indentation.students_amount[i].is_dispatched = true;
        this.selected_indentation.students_amount[i].is_partial = false;
      }
    }
  }

  undispatch(student) {
    this.show_button--;
    for (var i = 0; i < this.list_of_students.length; i++) {
      if (this.list_of_students[i].student_id == student.student_id) {
        this.list_of_students[i].is_dispatched = false;
        this.list_of_students[i].is_partial = true;
        if (this.list_of_students[i].remarks != undefined && this.list_of_students[i].remarks.length > 0)
          this.list_of_students[i].remarks.pop();
        this.list_of_students[i].is_partial = false;
      }
    }
    for (var i = 0; i < this.selected_indentation.students_amount.length; i++) {
      if (this.selected_indentation.students_amount[i].student_id == student.student_id) {
        this.selected_indentation.students_amount[i].is_dispatched = false;
        this.selected_indentation.students_amount[i].is_partial = true;
        if (this.selected_indentation.students_amount[i].remarks != undefined && this.selected_indentation.students_amount[i].remarks.length > 0)
          this.selected_indentation.students_amount[i].remarks.pop();
        this.selected_indentation.students_amount[i].is_partial = false;
      }
    }
  }

  confirmIndentStudents() {
    this.isLoading = true;
    for (var i = 0; i < this.selected_indentation.students_amount.length; i++) {
      if (this.selected_indentation.students_amount[i].is_partial == true)
        this.selected_indentation.students_amount[i].is_dispatched = false;
    }
    this.indentationService.updateIndentation(this.selected_indentation).then((result) => {
      this.isLoading = false;
      // this.presentToast('Dispatch Data saved successfully');
      // this.reset();
    }, (err) => {
      this.isLoading = false;
      // this.presentToast('Error! Please try again.');
    });
  }

  partial(student, dialog) {
    this.this_student = student;
    this.dia = this.dialogService.open(dialog);
  }

  partialDispatch(student) {
    this.show_button++;
    for (var i = 0; i < this.list_of_students.length; i++) {
      if (this.list_of_students[i].student_id == student.student_id) {
        this.list_of_students[i].is_dispatched = true;
        this.list_of_students[i].is_partial = true;
      }
    }
    for (var i = 0; i < this.selected_indentation.students_amount.length; i++) {
      if (this.selected_indentation.students_amount[i].student_id == student.student_id) {
        this.selected_indentation.students_amount[i].is_dispatched = true;
        this.selected_indentation.students_amount[i].is_partial = true;
      }
    }
  }

  handler(data) {
    if (this.this_student.remarks != undefined && this.this_student.remarks.length > 0)
      this.this_student.remarks.push(data.msg);
    else
      this.this_student.remarks = [data.msg];
    this.partialDispatch(this.this_student);
    this.dia.close();
  }

}
