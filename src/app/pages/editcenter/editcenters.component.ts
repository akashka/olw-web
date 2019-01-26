import { Component } from '@angular/core';
import * as _ from 'lodash'
import { Center } from '../../providers/center/center';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Router } from '@angular/router';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Component({
  selector: 'editcenters',
  templateUrl: './editcenters.component.html',
  styleUrls: ['./editcenter.scss'],
})

export class EditcentersComponent {

  // Variables to be saved in DB for Centers
  center_name: string;
  center_code: string;
  center_phoneno: string;
  center_email: string;
  center_address: string;
  active: Boolean = true;
  cash: Boolean = false;
  centers: any;
  btnText: string = "Save";
  myInput: string;
  center_id: string;
  mySelect: string;
  playgroup = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  nursery = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  lkg = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  ukg = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };

  public loader: Boolean = false;
  public submitted: Boolean = false;

  constructor(
    public centerService: Center,
    public router: Router,    
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.getCenters();
  }

  // Function to save new center
  save() {
    this.loader = true;
    let center = {
      center_name: this.center_name,
      center_code: this.center_code,
      center_phoneno: this.center_phoneno,
      center_email: this.center_email,
      center_address: this.center_address,
      active: this.active,
      cash: this.cash,
      playgroup: this.playgroup,
      nursery: this.nursery,
      lkg: this.lkg,
      ukg: this.ukg,
      _id: this.center_id
    };
    this.submitted = true;
    this.centerService.updateCenter(center).then((result) => {
      this.showToast(NbToastStatus.SUCCESS, 'Success!', 'Center is Updated Successfully');
      this.loader = false;
      this.router.navigate(['./pages/centers']);
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      this.loader = false;
    });
  }

  reset() {
    this.center_name = "";
    this.center_code = "";
    this.center_phoneno = "";
    this.center_email = "";
    this.center_address = "";
    this.active = true;
    this.cash = false;
    this.btnText = "Save";
    this.myInput = "";
    this.center_id = "";
    this.playgroup = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.nursery = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.lkg = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.ukg = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
  }

  // Function to get list of all the centers
  getCenters() {
    this.centers = [];
    this.loader = true;    
    this.centerService.searchCenter().then((result) => {
      this.centers = result;
      var params = window.location.hash.split('/').pop();
      for (var i = 0; i < this.centers.length; i++) {
        if (this.centers[i]._id == params) {
          this.center_name = this.centers[i].center_name;
          this.center_code = this.centers[i].center_code;
          this.center_phoneno = this.centers[i].center_phoneno;
          this.center_email = this.centers[i].center_email;
          this.center_address = this.centers[i].center_address;
          this.active = this.centers[i].active;
          this.cash = this.centers[i].cash;
          this.btnText = this.centers[i].btnText;
          this.myInput = this.centers[i].myInput;
          this.center_id = this.centers[i]._id;
          this.playgroup = this.centers[i].playgroup;
          this.nursery = this.centers[i].nursery;
          this.lkg = this.centers[i].lkg;
          this.ukg = this.centers[i].ukg;
        }
      }
      this.loader = false;
    }, (err) => {
      this.showToast(NbToastStatus.DANGER, 'Error!', err);
      console.log(err);
    });
  }

  // Function to make email small letters on change
  onEmailChange() {
    this.center_email = this.center_email.toLowerCase();
  }

  // Function to generate unique center code
  generateCode() {
    var fields = this.center_name.split(' ');
    var str = "";
    if (fields.length > 1) {
      var temp1 = fields[0];
      var temp2 = fields[1];
      if (temp1.length > 0) str += temp1[0];

      if (temp1.length > 1) {
        str += temp1[1];
        if (temp2.length > 0) {
          str += temp2[0];
        } else if (temp.length > 2) str += temp[2];
      } else if (temp2.length > 2) {
        str += temp2[0];
        str += temp2[1];
      }
    }
    else {
      var temp = fields[0];
      if (temp.length > 0) str += temp[0];
      if (temp.length > 1) str += temp[1];
      if (temp.length > 2) str += temp[2];
    }
    this.center_code = str.toUpperCase();
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
