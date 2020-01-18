import { Component, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Http, Headers } from '@angular/http';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

// Providers
import { Students } from '../../providers/students/students';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';

declare var cordova: any;
declare let Appsee: any;

interface Window {
  resolveLocalFileSystemURL: any;
}
declare var windows: Window;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.scss'],
})

export class EnquiryComponent {

  @ViewChild('fileInput') fileInput;
  studentForm: FormGroup;
  public submitAttempt: Boolean = false;
  public counter: Boolean = false;
  public lastImage: any;
  public centers: any;
  public userCenter: any;
  public users: any;
  public studentsList: any;
  public matchingStudent: any;
  stu;
  confirm;

  public today_age_years: any;
  public today_age_months: any;
  public today_age_days: any;

  public month_date: any;

  public month_age_years: any;
  public month_age_months: any;
  public month_age_days: any;

  public class_group: any;
  public isAdmin: Boolean = false;
  public isCurrentYear: Boolean = true;
  public isDispatcher: Boolean = false;
  public isCenterAdmin: Boolean = false;
  public isCounsellor: Boolean = false;
  public isMatching: Boolean = false;

  public loader: Boolean = false;
  public submitted: Boolean = false;

  public locationOptions: Array<Object> = [];
  storage = window.localStorage;

  public today_date = moment(new Date()).format('DD-MMM-YYYY');

  constructor(
    public studentService: Students,
    public authService: Auth,
    public formBuilder: FormBuilder,
    public centerService: Center,
    public http: Http,
    private dialogService: NbDialogService,
    private router: Router,
    private toastrService: NbToastrService,
  ) {
    this.studentForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email_id: ['', Validators.compose([Validators.maxLength(30),
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:quotemark
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"),
        Validators.required])],
      phone_number: ['', Validators.compose([Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      parent_name: ['', Validators.compose([Validators.required])],
      alternate_contact: ['', Validators.compose([Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      locality: ['', Validators.compose([Validators.required])],
      study_year: ['', Validators.compose([Validators.required])],
      center: [''],
      counsellor: [''],
      today_age: [''],
      month_date: [''],
      month_age: [''],
      class_group: [''],
      photo: [''],
      student_id: [''],
    });

    this.studentService.getAllStudents().then((data) => {
      this.studentsList = data;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.loader = true;
    this.studentForm.controls['study_year'].setValue('2020-21');
    // tslint:disable-next-line:prefer-const
    let dialog: any;
    this.onYearChange(dialog);
    this.users = JSON.parse(this.storage.getItem('user'));
    this.centerService.searchCenter().then((centers) => {
      this.userCenter = _.find(centers, ['center_code', this.users.center]);
      this.studentService.getAllStudents().then((data) => {
        const student = _.filter(data, ['center', this.userCenter.center_code]);
        let student_ids = this.userCenter.center_code;
        student_ids += student ? (student.length > 0 ? student.length : 0) : 0;
        this.studentForm.controls['student_id'].setValue(student_ids);
        this.loader = false;
      }, (err) => {
        this.showToast(NbToastStatus.DANGER, 'Error!', err);
        this.loader = false;
      });
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      this.loader = false;
    });
  }

  resetStudent() {
    this.studentForm.controls['name'].setValue('');
    this.studentForm.controls['email_id'].setValue('');
    this.studentForm.controls['phone_number'].setValue('');
    this.studentForm.controls['parent_name'].setValue('');
    this.studentForm.controls['alternate_contact'].setValue('');
    this.studentForm.controls['locality'].setValue('');
    this.studentForm.controls['today_age'].setValue('');
    this.studentForm.controls['month_date'].setValue('');
    this.studentForm.controls['month_age'].setValue('');
    this.studentForm.controls['class_group'].setValue('');
    this.studentForm.controls['photo'].setValue('');
    this.studentForm.controls['dob'].setValue('');
    this.studentForm.controls['study_year'].setValue('2020-21');
    this.today_age_years = '';
    this.today_age_months = '';
    this.today_age_days = '';
    this.month_date = '';
    this.month_age_years = '';
    this.month_age_months = '';
    this.month_age_days = '';
    this.class_group = '';
  }

  addStudent = () => {
    this.submitAttempt = true;
    if (this.studentForm.valid) {
      this.loader = true;
      this.studentForm.value.dob = moment(this.studentForm.value.dob, 'YYYY-MM-DD').toDate();
      this.studentService.createStudent(this.studentForm.value).then((result) => {
        this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Student Data Saved Successfully');
        this.loader = false;
        this.router.navigate(['/pages/confirm']);
      }, (err) => {
        this.showToast(NbToastStatus.DANGER, 'Error!', err);
      });
    }
  }

  onNameChange = () => {
    this.studentForm.value.name = this.studentForm.value.name.toUpperCase();
  }

  onEmailChange = (dialog: TemplateRef<any>) => {
    this.studentForm.value.email_id = this.studentForm.value.email_id.toLowerCase();
    this.checkMatching(dialog);
  }

  onPhoneChange = (dialog: TemplateRef<any>) => {
    this.checkMatching(dialog);
  }

  onYearChange = (dialog: TemplateRef<any>) => {
    this.isCurrentYear = (this.studentForm.value.study_year === '2020-21') ? true : false;
    if (this.studentForm.value.dob !== '') this.onDobChange(dialog);
  }

  onDobChange = (dialog: TemplateRef<any>) => {
    const dob = this.studentForm.value.dob;
    const now = new Date();
    this.studentForm.value.today_age = this.getAge(dob, now);
    now.setDate(1);
    now.setMonth(5);
    const nowDate = new Date();
    if (nowDate.getMonth() < 12) now.setFullYear(now.getFullYear() - 1);
    this.studentForm.value.month_age = this.getAge(dob, now);
    this.studentForm.value.month_date = now;

    this.studentForm.value.today_age.years += 1900;
    this.today_age_years = this.studentForm.value.today_age.years;
    this.today_age_months = this.studentForm.value.today_age.months;
    this.today_age_days = this.studentForm.value.today_age.days;

    let tempYear = this.studentForm.value.month_date.getYear();
    if (!this.isCurrentYear) tempYear += 1;
    this.month_date = this.studentForm.value.month_date.getDate() + '/June/' + (tempYear + 1901);

    this.studentForm.value.month_age.years += 1901;
    this.month_age_years = this.studentForm.value.month_age.years;
    this.month_age_months = this.studentForm.value.month_age.months;
    this.month_age_days = this.studentForm.value.month_age.days;

    if (!this.isCurrentYear) this.month_age_years += 1;
    if (!this.isCurrentYear) this.studentForm.value.month_age.years += 1;

    this.class_group = this.calculateClass(this.studentForm.value.month_age);
    this.studentForm.controls['class_group'].setValue(this.class_group);

    this.checkMatching(dialog);
  }

  public getAge = (birthday, tillday) => {
    const today = new Date(
      tillday.getYear(),
      tillday.getMonth(),
      tillday.getDate(),
    );

    const yearNow = today.getFullYear();
    const monthNow = today.getMonth();
    const dateNow = today.getDate();

    const dob = new Date(
      birthday.substring(0, 4),
      birthday.substring(5, 7) - 1,
      birthday.substring(8, 10),
    );

    const yearDob = dob.getFullYear();
    const monthDob = dob.getMonth();
    const dateDob = dob.getDate();
    let age = {};

    let yearAge = yearNow - yearDob;

    let monthAge = 0;
    if (monthNow >= monthDob)
      monthAge = monthNow - monthDob;
    else {
      yearAge--;
      monthAge = 12 + monthNow - monthDob;
    }

    let dateAge = 0;
    if (dateNow >= dateDob)
      dateAge = dateNow - dateDob;
    else {
      monthAge--;
      dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge,
    };

    return age;
  }

  calculateClass(birthday) {
    const age = (birthday.years * 100) + birthday.months;
    if (age >= 106 && age < 206) return 'Play Group';
    else if (age >= 206 && age < 306) return 'Nursery';
    else if (age >= 306 && age < 406) return 'LKG';
    else if (age >= 406 && age < 506) return 'UKG';
    return 'Not eligible';
  }

  private createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // File for Upload
    const targetPath = this.pathForImage(this.lastImage);

    // File name only
    const filename = this.lastImage;
    const path = targetPath + filename;

    this.getFileContentAsBase64(path, function (base64Image) {
      this.studentForm.photo = base64Image;
    });
  }

  getFileContentAsBase64(path, callback) {
    windows.resolveLocalFileSystemURL(path, gotFile, fail);

    function fail(e) {
      alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
      fileEntry.file(function (file) {
        const reader = new FileReader();
        reader.onloadend = function (e) {
          const content = this.result;
          callback(content);
        };
        // The most important point, use the readAsDatURL Method from the file plugin
        reader.readAsDataURL(file);
      });
    }
  }

  getPicture() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {

      const imageData = (readerEvent.target as any).result;
      this.studentForm.patchValue({ 'photo': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return ('url(' + this.studentForm.controls['photo'].value + ')');
  }

  findDuplicates(data) {
    const result = [];
    data.forEach(function (element, index) {
      // Find if there is a duplicate or not
      if (data.indexOf(element, index + 1) > -1) {
        // Find if the element is already in the result array or not
        if (result.indexOf(element) === -1) {
          result.push(element);
        }
      }
    });
    return result;
  }

  handler() {
    const url = './pages/confirmstudent/' + this.stu._id;
    this.router.navigate([url]);
  }

  showConfirm(stu, dialog: TemplateRef<any>) {
    this.stu = stu;
    const msg = 'Name: ' + stu.name + '<br/> Email: ' + stu.email_id + '<br/> Phone: ' +
      stu.phone_number + '<br/> Gender: ' + stu.gender + '<br/> Parent: ' + stu.parent_name +
      '<br/>Center: ' + stu.center + '<br/> Confirm same student?';
    this.confirm = this.dialogService.open(
      dialog, {
        context: msg,
      },
    );
  }

  checkMatching(dialog: TemplateRef<any>) {
    const list = [];
    this.isMatching = false;
    this.matchingStudent = null;
    if (this.studentForm.controls['dob'].value !== '') {
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < this.studentsList.length; i++) {
        if (moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'day') &&
            moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'month') &&
            moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'year')) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['email_id'].value !== '') {
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].email_id === this.studentForm.controls['email_id'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['phone_number'].value !== '') {
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].phone_number === this.studentForm.controls['phone_number'].value) {
          list.push(this.studentsList[i]);
        }
      }
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].alternate_contact === this.studentForm.controls['phone_number'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['alternate_contact'].value !== '') {
      // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].phone_number === this.studentForm.controls['alternate_contact'].value) {
          list.push(this.studentsList[i]);
        }
      }
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].alternate_contact === this.studentForm.controls['alternate_contact'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (list.length > 0) {
      const resu = this.findDuplicates(list);
      if (resu.length > 0 && !this.counter) {
        this.isMatching = true;
        this.counter = true;
        this.matchingStudent = resu[0];
        this.showConfirm(this.matchingStudent, dialog);
      }
    }
  }

  onLocalityChange($event) {
    this.locationOptions = [];
    if (this.studentForm.controls['locality'].value.length > 4) {
      const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
                  this.studentForm.controls['locality'].value +
                  '&types=geocode&key=AIzaSyDxiToPCcr2LL1EC_vkzYtBiQO_9kbIfqs';
      this.http.get(url)
        .subscribe(res => {
          const data = res.json();
          this.locationOptions = data.predictions;
        }, (err) => { });
    }
  }

  onLocSelect(description) {
    this.studentForm.controls['locality'].setValue(description);
  }

  private showToast(type: NbToastStatus, title: string, body: string) {
    const audio = new Audio();
    audio.src = 'http://www.noiseaddicts.com/samples_1w72b820/3724.mp3';
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
