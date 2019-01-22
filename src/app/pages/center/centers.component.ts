import { Component } from '@angular/core';
import * as _ from 'lodash'
import { Center } from '../../providers/center/center';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'centers',
  templateUrl: './centers.component.html',
  styleUrls: ['./center.scss'],
})

export class CentersComponent {

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
      center_name: {
          title: 'Center Name',
          type: 'String',
      },
      center_code: {
          title: 'Center Code',
          type: 'String',
      },
      center_email: {
          title: 'Email',
          type: 'String',
      },
      center_phoneno:  {
          title: 'Phone No',
          type: 'String',
      },
      center_address: {
          title: 'Address',
          type: 'String',
      },
      active: {
          title: 'Active',
          type: 'Boolean',
      },
      cash: {
          title: 'Cash',
          type: 'Boolean',
      }
    },
    mode: 'external', 
  };

  centers;
  isLoading: Boolean = false;

  constructor(
    public centerService: Center,
    public router : Router,
  ) { }

  ngOnInit() {
    this.getCenters();
  }

  // Function to get list of all the centers
  getCenters() {
    this.isLoading = true;
    this.centers = [];
    this.centerService.searchCenter().then((result) => {
      this.centers = result;
      this.isLoading = false;
    }, (err) => {
      console.log(err);
    });
  }

  editCenter(event): void {
    var url = './pages/editcenters/' + event.data._id;
    this.router.navigate([url]);
  }

}
