import { Component } from '@angular/core';
import * as _ from 'lodash'
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Router } from '@angular/router'; 
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./user.scss'],
})

export class UsersComponent {

  settings = {
    actions: {
      add: false,
      edit: true,
      delete: false
    },
    edit: {
      editButtonContent: '<button class="btn btn-outline-primary btn-icon" type="button"> <i class="nb-edit"></i> </button>'
    },
    noDataMessage: '',
    columns: {
        name: {
            title: 'Name',
            type: 'String',
        },
        email: {
            title: 'Email',
            type: 'String',
        },
        role: {
            title: 'Role',
            type: 'String',
        },
        center: {
            title: 'Center',
            type: 'String',
        },
        active: {
            title: 'Active',
            type: 'Boolean',
        }
    },
    mode: 'external',
  };

  users;
  centers;
  isLoading: Boolean = false;

  constructor(
    public studentService: Students,
    public authService: Auth,
    public centerService: Center,
    public router: Router,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.getCenters();
    this.getUsers();
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
    this.isLoading = true;
    this.users = [];
    this.authService.searchUser().then((result) => {
      this.users = result;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].password = "";
      }
      this.isLoading = false;    
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log(err);
    });
  }

  editUser(event): void {
    var url = './pages/editusers/' + event.data._id;
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
