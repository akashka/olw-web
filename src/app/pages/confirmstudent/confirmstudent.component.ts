import { Component, ViewChild } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
interface Window {
  resolveLocalFileSystemURL: any;
}
declare var windows: Window;

@Component({
  selector: 'confirmstudent',
  templateUrl: './confirmstudent.component.html',
  styleUrls: ['./confirmstudent.scss'],
})

export class ConfirmstudentComponent {

  @ViewChild('fileInput') fileInput;
  isLoading: Boolean = false;
  storage = window.localStorage;
  confirmForm: FormGroup;
  submitAttempt: Boolean = false;
  public lastImage: any;
  student;

  constructor(
    public centerService: Center,
    public studentService: Students,
    public authService: Auth,
    public router: Router,
    public formBuilder: FormBuilder,
  ) {
    this.confirmForm = formBuilder.group({
      gender: ['', Validators.compose([Validators.required])],
      study_year: ['', Validators.compose([Validators.required])],
      class_group: ['', Validators.compose([Validators.required])],
      student_id: [''],
      class_type: ['Annual', Validators.compose([Validators.required])],
      uniform_size: ['', Validators.compose([Validators.required])],
      shoe_size: ['', Validators.compose([Validators.required])],
      photo: [''],
      needUniform: true,
      needShoe: true
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getStudents().then((data) => {
      let params = window.location.hash.split('/').pop();
      data = _.filter(data, function (o) {
        return (o._id == params);
      });
      this.student = data[0];
      this.confirmForm.controls['gender'].setValue(this.student.gender);
      this.confirmForm.controls['study_year'].setValue(this.student.study_year);
      this.confirmForm.controls['class_group'].setValue(this.student.class_group);
      this.confirmForm.controls['student_id'].setValue(this.student.student_id);
      this.confirmForm.controls['photo'].setValue(this.student.photo);
      if (this.student.study_year == '2019-20')
        this.confirmForm.controls['class_type'].setValue('Early start');
      this.isLoading = false;
    });
  }

  confirmStudent = () => {
    this.submitAttempt = true;
    this.isLoading = true;
    this.student.gender = this.confirmForm.value.gender;
    this.student.study_year = this.confirmForm.value.study_year;
    this.student.class_group = this.confirmForm.value.class_group;
    this.student.status = "confirmed";
    this.student.is_Confirmed = true;
    this.student.photo = this.confirmForm.value.photo;
    this.student.class_type = this.confirmForm.value.class_type;
    this.student.uniform_size = this.confirmForm.value.uniform_size;
    this.student.shoe_size = this.confirmForm.value.shoe_size;
    this.student.is_Delivered = false;
    this.student.is_Indented = false;
    this.student.confirmation_date = null;
    this.student.indentation_date = null;
    this.student.delivery_date = null;
    this.student.is_Active = true;
    this.student.admin_edit = false;

    this.studentService.updateStudent(this.student).then((result) => {
      this.isLoading = false;
      // this.presentToast('student data saved successfully');
      // this.goBack();
    }, (err) => {
      this.isLoading = false;
      // this.presentToast('Error! Please try again.');
    });
  };

  onUniformChange() {
    if (this.confirmForm.value.needUniform)
      this.confirmForm.controls['uniform_size'].setValue('');
    else
      this.confirmForm.controls['uniform_size'].setValue('NA');
  }

  onShoeChange() {
    if (this.confirmForm.value.needShoe)
      this.confirmForm.controls['shoe_size'].setValue('');
    else
      this.confirmForm.controls['shoe_size'].setValue('NA');
  }

  onYearChange() {
    if (this.confirmForm.controls['study_year'].value == '2019-20') {
      if (this.confirmForm.controls['class_group'].value == "Play Group")
        this.confirmForm.controls['class_group'].setValue('Nursery');
      else if (this.confirmForm.controls['class_group'].value == "Nursery")
        this.confirmForm.controls['class_group'].setValue('LKG');
      else if (this.confirmForm.controls['class_group'].value == "LKG")
        this.confirmForm.controls['class_group'].setValue('UKG');
      else if (this.confirmForm.controls['class_group'].value == "UKG")
        this.confirmForm.controls['class_group'].setValue('UKG');
      else this.confirmForm.controls['class_group'].setValue('Play Group');
    } else {
      if (this.confirmForm.controls['class_group'].value == "Play Group")
        this.confirmForm.controls['class_group'].setValue('Play Group');
      else if (this.confirmForm.controls['class_group'].value == "Nursery")
        this.confirmForm.controls['class_group'].setValue('Play Group');
      else if (this.confirmForm.controls['class_group'].value == "LKG")
        this.confirmForm.controls['class_group'].setValue('Nursery');
      else if (this.confirmForm.controls['class_group'].value == "UKG")
        this.confirmForm.controls['class_group'].setValue('LKG');
      else this.confirmForm.controls['class_group'].setValue('UKG');
    }
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public pathForImage(img) {
    // if (img === null) return '';
    // else return this.file + img;
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
      this.confirmForm.patchValue({ 'photo': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
    console.log(this.confirmForm.controls['photo'].value);
  }

  getProfileImageStyle() {
    return ('url(' + this.confirmForm.controls['photo'].value + ')');
  }

}
