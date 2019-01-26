import { Component } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';
import { Router } from '@angular/router'; 
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Component({
  selector: 'createusers',
  templateUrl: './createusers.component.html',
  styleUrls: ['./createuser.scss'],
})

export class CreateusersComponent {

  // Variables to be saved in DB for users
  role: string;
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  center: string;
  active: Boolean = true;
  isPasswordMatching: Boolean = true;
  isExisting: Boolean = false;
  centers;
  users;
  _id;
  myInput;
  mySelect;
  btnText: String = "Save";
  existingUser: Boolean = false;

  public loader: Boolean = false;
  public isUserDeletable: Boolean = false;
  public submitted: Boolean = false;

  constructor(
    public centerService: Center,
    public studentService: Students,
    public authService: Auth,
    public router: Router,    
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.getCenters();
    this.getUsers();
  }

  // Function to make email small letters on change
  onEmailChange() {
    this.email = this.email.toLowerCase();
  }

  reset() {
    this.existingUser = false;
    this.role = "";
    this.email = "";
    this.password = "";
    this.confirm_password = "";
    this.name = "";
    this.center = "";
    this.active = true;
    this.isPasswordMatching = true;
    this.isExisting = false;
    this._id = "";
    this.myInput = "";
    this.mySelect = "";
    this.btnText = "Save";
    this.existingUser = false;
    this.isUserDeletable = false;
  }

  // Function to get list of all the centers
  getCenters() {
    this.centers = [];
    this.centerService.searchCenter().then((result) => {
      result = _.filter(result, function (o) {
        return (o.active == true);
      });
      this.centers = result;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log(err);
    });
  }

  // Function to get list of all the Users
  getUsers() {
    this.loader = true;
    this.users = [];
    this.authService.searchUser().then((result) => {
      this.users = result;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].password = "";
      }
      this.loader = false;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log(err);
    });
  }

  save() {
    if (!this.isExisting && this.isPasswordMatching) {
      this.loader = true;
      let details = {
        email: this.email,
        password: this.password,
        role: this.role,
        name: this.name,
        center: this.center,
        active: this.active
      };
      this.authService.createAccount(details).then((result) => {
        this.showToast(NbToastStatus.SUCCESS, 'Success!', 'User created Successfully');
        this.loader = false;
        this.router.navigate(['./pages/users']);
      }, (err) => {
        this.loader = false;
        this.showToast(NbToastStatus.DANGER, 'Error!', err);
      });
    }
  }

  // Function to check if user exists with same email ID
  checkEmail() {
    this.isExisting = false;
    var result = _.find(this.users, ['email', this.email])
    this.isExisting = (result != null && result != undefined) ? true : false;
  }

  // Function to check if password and confirm password match
  checkPassword() {
    this.isPasswordMatching = false;
    if ((this.password == undefined || this.password == null)
      && (this.confirm_password == undefined || this.confirm_password == null)) {
      this.isPasswordMatching = false;
    } else {
      this.isPasswordMatching = (this.password == this.confirm_password) ? true : false;
    }
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
