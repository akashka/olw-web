import { Component, TemplateRef } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { NbDialogService } from '@nebular/theme';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';

@Component({
  selector: 'adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.scss'],
})

export class AdmineditComponent {

  studentForm;
  students;
  student;
  isLoading: Boolean = false;
  locationOptions;

  constructor(
    public studentService: Students,
    public authService: Auth,
    private dialogService: NbDialogService,
    public centerService: Center,
    public formBuilder: FormBuilder,
    public router: Router,
    public http: Http,    
    private toastrService: NbToastrService,
  ) {
    this.studentForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"), Validators.required])],
      phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      parent_name: ['', Validators.compose([Validators.required])],
      alternate_contact: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      locality: ['', Validators.compose([Validators.required])],
      study_year: ['', Validators.compose([Validators.required])],
      class_group: [''],
      class_type: [''],
      uniform_size: [''],
      shoe_size: ['']
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      this.students = data;
      var params = window.location.hash.split('/').pop();
      for (var i = 0; i < this.students.length; i++) {
        if (this.students[i]._id == params) {
          let student = this.students[i];
          this.student = student;
          this.studentForm.controls['name'].setValue(student.name);
          this.studentForm.controls['email_id'].setValue(student.email_id);
          this.studentForm.controls['phone_number'].setValue(student.phone_number);
          this.studentForm.controls['gender'].setValue(student.gender);
          this.studentForm.controls['dob'].setValue(new Date(student.dob));
          this.studentForm.controls['parent_name'].setValue(student.parent_name);
          this.studentForm.controls['alternate_contact'].setValue(student.alternate_contact);
          this.studentForm.controls['locality'].setValue(student.locality);
          this.studentForm.controls['study_year'].setValue(student.study_year);
          this.studentForm.controls['class_group'].setValue(student.class_group);
          this.studentForm.controls['uniform_size'].setValue(student.uniform_size);
          this.studentForm.controls['class_type'].setValue(student.class_type);
          this.studentForm.controls['shoe_size'].setValue(student.shoe_size);
        }
      }
      this.isLoading = false;
    }, (err) => {
      console.log("not allowed");
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
    });
  }

  onNameChange = () => {
    this.studentForm.value.name = this.studentForm.value.name.toUpperCase();
  }

  onEmailChange = () => {
    this.studentForm.value.email_id = this.studentForm.value.email_id.toLowerCase();
  }

  confirmStudent = () => {
    this.isLoading = true;
    this.student.name = this.studentForm.value.name;
    this.student.email_id = this.studentForm.value.email_id;
    this.student.phone_number = this.studentForm.value.phone_number;
    this.student.gender = this.studentForm.value.gender;
    this.student.dob = moment(this.studentForm.value.dob, "YYYY-MM-DD").toDate();
    this.student.parent_name = this.studentForm.value.parent_name;
    this.student.alternate_contact = this.studentForm.value.alternate_contact;
    this.student.locality = this.studentForm.value.locality;
    this.student.study_year = this.studentForm.value.study_year;
    this.student.class_group = this.studentForm.value.class_group;
    this.student.uniform_size = this.studentForm.value.uniform_size;
    this.student.class_type = this.studentForm.value.class_type;
    this.student.shoe_size = this.studentForm.value.shoe_size;
    this.student.admin_edit = true;
    this.studentService.updateStudent(this.student).then((result) => {
      this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Student data is successfully updated');
      this.isLoading = false;
      this.router.navigate(['./pages/editstudent']);
    }, (err) => {
      this.isLoading = false;
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
    });
  };

  onLocalityChange($event) {
    this.locationOptions = [];
    if ($event._value.length > 4) {
      var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + $event._value +
        "&types=geocode&key=AIzaSyDxiToPCcr2LL1EC_vkzYtBiQO_9kbIfqs";
      this.http.get(url)
        .subscribe(res => {
          let data = res.json();
          this.locationOptions = data.predictions;
        }, (err) => { });
    }
  }

  onLocSelect(description) {
    this.studentForm.controls['locality'].setValue(description);
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