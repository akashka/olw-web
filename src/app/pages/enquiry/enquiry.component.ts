import { Component, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash'
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
      email_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"), Validators.required])],
      phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      parent_name: ['', Validators.compose([Validators.required])],
      alternate_contact: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      locality: ['', Validators.compose([Validators.required])],
      study_year: ['', Validators.compose([Validators.required])],
      center: [''],
      counsellor: [''],
      today_age: [''],
      month_date: [''],
      month_age: [''],
      class_group: [''],
      photo: [''],
      student_id: ['']
    });

    this.studentService.getAllStudents().then((data) => {
      this.studentsList = data;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log("not allowed");
    });
  }

  ngOnInit() {
    this.loader = true;
    this.studentForm.controls['study_year'].setValue("2019-20");
    let dialog: any;
    this.onYearChange(dialog);
    this.users = JSON.parse(this.storage.getItem('user'));
    this.centerService.searchCenter().then((centers) => {
      this.userCenter = _.find(centers, ['center_code', this.users.center]);
      this.studentService.getAllStudents().then((data) => {
        var student = _.filter(data, ['center', this.userCenter.center_code]);
        var student_ids = this.userCenter.center_code;
        student_ids += student ? (student.length > 0 ? student.length : 0) : 0;
        this.studentForm.controls['student_id'].setValue(student_ids);
        this.loader = false;
      }, (err) => {
        console.log("not allowed");
        this.showToast(NbToastStatus.DANGER, 'Error!', err);
        this.loader = false;
      });
    }, (err) => {
      console.log(err);
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
    this.studentForm.controls['study_year'].setValue("2019-20");
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
      this.studentForm.value.dob = moment(this.studentForm.value.dob, "YYYY-MM-DD").toDate();
      this.studentService.createStudent(this.studentForm.value).then((result) => {
        this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Student Data Saved Successfully');
        this.loader = false;
        this.router.navigate(['/pages/confirm']);        
      }, (err) => {
        this.showToast(NbToastStatus.DANGER, 'Error!', err);
      });
    }
  };

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
    this.isCurrentYear = (this.studentForm.value.study_year == "2019-20") ? true : false;
    if (this.studentForm.value.dob != '') this.onDobChange(dialog);
  }

  onDobChange = (dialog: TemplateRef<any>) => {
    var dob = this.studentForm.value.dob;
    var now = new Date();
    this.studentForm.value.today_age = this.getAge(dob, now);
    now.setDate(1);
    now.setMonth(5);
    var nowDate = new Date();
    if (nowDate.getMonth() < 12) now.setFullYear(now.getFullYear() - 1);
    this.studentForm.value.month_age = this.getAge(dob, now);
    this.studentForm.value.month_date = now;

    this.studentForm.value.today_age.years += 1900;
    this.today_age_years = this.studentForm.value.today_age.years;
    this.today_age_months = this.studentForm.value.today_age.months;
    this.today_age_days = this.studentForm.value.today_age.days;

    var tempYear = this.studentForm.value.month_date.getYear();
    if (!this.isCurrentYear) tempYear -= 1;
    this.month_date = this.studentForm.value.month_date.getDate() + "/June/" + (tempYear + 1901);

    this.studentForm.value.month_age.years += 1901;
    this.month_age_years = this.studentForm.value.month_age.years;
    this.month_age_months = this.studentForm.value.month_age.months;
    this.month_age_days = this.studentForm.value.month_age.days;

    if (!this.isCurrentYear) this.month_age_years -= 1;
    if (!this.isCurrentYear) this.studentForm.value.month_age.years -= 1;

    this.class_group = this.calculateClass(this.studentForm.value.month_age);
    this.studentForm.controls['class_group'].setValue(this.class_group);

    this.checkMatching(dialog);
  }

  public getAge = (birthday, tillday) => {
    var today = new Date(
      tillday.getYear(),
      tillday.getMonth(),
      tillday.getDate()
    );

    var yearNow = today.getFullYear();
    var monthNow = today.getMonth();
    var dateNow = today.getDate();

    var dob = new Date(
      birthday.substring(0, 4),
      birthday.substring(5, 7) - 1,
      birthday.substring(8, 10)
    );

    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age = {};

    var yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    return age;
  }

  calculateClass(birthday) {
    var age = (birthday.years * 100) + birthday.months;
    if (age >= 106 && age < 206) return "Play Group"
    else if (age >= 206 && age < 306) return "Nursery"
    else if (age >= 306 && age < 406) return "LKG"
    else if (age >= 406 && age < 506) return "UKG"
    return "Not eligible"
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
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
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;
    var path = targetPath + filename;

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
        var reader = new FileReader();
        reader.onloadend = function (e) {
          var content = this.result;
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
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.studentForm.patchValue({ 'photo': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
    console.log(this.studentForm.controls['photo'].value);
  }

  getProfileImageStyle() {
    return ('url(' + this.studentForm.controls['photo'].value + ')');
  }

  findDuplicates(data) {
    let result = [];
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
    var url = './pages/confirmstudent/' + this.stu._id;
    this.router.navigate([url]);
  }

  showConfirm(stu, dialog: TemplateRef<any>) {
    this.stu = stu;
    let msg = 'Name: ' + stu.name + '<br/> Email: ' + stu.email_id + "<br/> Phone: " + stu.phone_number + "<br/> Gender: " + stu.gender + "<br/> Parent: " + stu.parent_name + "<br/>Center: " + stu.center + "<br/> Confirm same student?";
    this.confirm = this.dialogService.open(
      dialog, {
        context: msg,
      }
    );
  }

  checkMatching(dialog: TemplateRef<any>) {
    var list = [];
    this.isMatching = false;
    this.matchingStudent = null;
    if (this.studentForm.controls['dob'].value != '') {
      for (var i = 0; i < this.studentsList.length; i++) {
        if (moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'day') && moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'month') && moment(this.studentsList[i].dob).isSame(moment(this.studentForm.controls['dob'].value), 'year')) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['email_id'].value != '') {
      for (var i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].email_id == this.studentForm.controls['email_id'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['phone_number'].value != '') {
      for (var i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].phone_number == this.studentForm.controls['phone_number'].value) {
          list.push(this.studentsList[i]);
        }
      }
      for (var i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].alternate_contact == this.studentForm.controls['phone_number'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (this.studentForm.controls['alternate_contact'].value != '') {
      for (var i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].phone_number == this.studentForm.controls['alternate_contact'].value) {
          list.push(this.studentsList[i]);
        }
      }
      for (var i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].alternate_contact == this.studentForm.controls['alternate_contact'].value) {
          list.push(this.studentsList[i]);
        }
      }
    }
    if (list.length > 0) {
      var resu = this.findDuplicates(list);
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
      var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + 
                  this.studentForm.controls['locality'].value +
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
