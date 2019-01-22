import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../@core/data/smart-table.service';
import { Students } from '../../providers/students/students';
import { Center } from '../../providers/center/center';
import { Auth } from '../../providers/auth/auth';

import * as _ from 'lodash'
import * as moment from 'moment';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ReportsComponent {

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: 'Oops! No Students found!',
    columns: {
      student_id: {
        title: 'Student ID',
        type: 'string',
      },
      center: {
        title: 'Center',
        type: 'string',
      },
      email_id: {
        title: 'Email ID',
        type: 'string',
      },
      gender: {
        title: 'Gender',
        type: 'string',
      },
      locality: {
        title: 'Locality',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      parent_name: {
        title: 'Parent Name',
        type: 'string',        
      },
      phone_number: {
        title: 'Phone Number',
        type: 'Number',        
      },

    },
  };

  students;
  centers;
  users;
  centerList;

  constructor(
    private service: SmartTableService,
    public studentService: Students,
    public centerService: Center,
    public authService: Auth
  ) {
    this.loadData();
  }

  loadData() {
    this.studentService.getStudents().then((data) => {
      // this.storage.get('user').then((user) => {
        // if (user.role != "admin") {
          // data = _.filter(data, function (o) {
            // return (o.center == user.center);
          // });
        // }
        // else {
          // this.showFilters = true;
        // }
        this.students = (_.sortBy(data, 'enquiry_date')).reverse();
        this.centers = _.uniq(_.map(this.students, 'center'));
        this.users = _.uniq(_.map(this.students, 'counsellor'));
      // });
      // this.setAll();
    }, (err) => {
      console.log("not allowed");
    });
    this.centerService.searchCenter().then((data) => {
      this.centerList = data;
    }, (err) => {
      console.log("not allowed");
    });
  }

}

  // search(startDate, endDate) {
  //   this.loop = false;
  // 	this.startDate = startDate;
  // 	this.endDate = endDate;
  // 	if(this.searchType === 'enquiry') {
	//   	this.reports = _.filter(this.students, function(o) { 
	//       return (moment(o.enquiry_date) >= startDate && moment(o.enquiry_date) <= endDate); 
	//     });
	//     this.reports = _.filter(this.reports, function(o) { 
	//       return (!o.is_Confirmed); 
	//     });
  //   } else if(this.searchType === 'confirmed') {
  //   	this.reports = _.filter(this.students, function(o) { 
	//       return (o.is_Confirmed && moment(o.confirmation_date) >= startDate && moment(o.confirmation_date) <= endDate); 
	//     });
	//     this.reports = _.filter(this.reports, function(o) { 
	//       return (o.is_Confirmed && !o.is_Indented); 
	//     });
  //   } else if(this.searchType === 'indented') {
  //   	this.reports = _.filter(this.students, function(o) { 
	//       return (o.is_Indented && moment(o.indentation_date) >= startDate && moment(o.indentation_date) <= endDate); 
	//     });
  //   } else {
  //   	this.reports = _.filter(this.students, function(o) { 
	//       return ((moment(o.enquiryDate) >= startDate && moment(o.enquiryDate) <= endDate) || (o.is_Confirmed && moment(o.confirmation_date) >= startDate && moment(o.confirmation_date) <= endDate) || (o.is_Indented && moment(o.indentation_date) >= startDate && moment(o.indentation_date) <= endDate)); 
	//     });
  //   }
  // }

  // searchCenter() {
  //   if(!this.loop) {
  //     this.allStudents = this.reports;
  //     this.loop = true;
  //   }
  //   var selectedCenter = this.selectedCenter;
  //   this.reports = _.filter(this.allStudents, function(o) { 
  //       return (o.center == selectedCenter)
  //   }); 
  // }

  // searchUser() {
  //   if(!this.loop) {
  //     this.allStudents = this.reports;
  //     this.loop = true;
  //   }
  //   var selectedUser = this.selectedUser;
  //   this.reports = _.filter(this.allStudents, function(o) { 
  //       return (o.counsellor == selectedUser)
  //   }); 
  // }

  // clearFilter() {
  //   if(!this.loop) {
  //     this.allStudents = this.reports;
  //     this.loop = true;
  //   }
  //   this.reports = this.allStudents;
  //   this.selectedUser = null;
  //   this.selectedCenter = null;
  // }

  // searchFilter() {
  //   if(this.selectedCenter) this.searchCenter();
  //   if(this.selectedUser) this.searchUser();
  // }

  // searchToday() {
  // 	this.buttonStyleToday = "button-active";
  // 	this.buttonStyleWeek = "button-option";
  // 	this.buttonStyleMonth = "button-option";
  // 	this.buttonStyleRange = "button-option";

  // 	this.searchByDates = "today";
  // 	var startDate = moment().subtract(1, 'day');
  // 	var endDate = moment();
  // 	this.search(startDate, endDate);
  // }

  // searchWeek() {
  // 	this.buttonStyleToday = "button-option";
  // 	this.buttonStyleWeek = "button-active";
  // 	this.buttonStyleMonth = "button-option";
  // 	this.buttonStyleRange = "button-option";

  // 	this.searchByDates = "week";
  // 	var startDate = moment().subtract(7, 'day');
  // 	var endDate = moment();
  // 	this.search(startDate, endDate);
  // }

  // searchMonth() {
  // 	this.buttonStyleToday = "button-option";
  // 	this.buttonStyleWeek = "button-option";
  // 	this.buttonStyleMonth = "button-active";
  // 	this.buttonStyleRange = "button-option";

  // 	this.searchByDates = "month";
  // 	var startDate = moment().subtract(30, 'day');
  // 	var endDate = moment();
  // 	this.search(startDate, endDate);
  // }

  // searchDates(res) {
  // 	this.buttonStyleToday = "button-option";
  // 	this.buttonStyleWeek = "button-option";
  // 	this.buttonStyleMonth = "button-option";
  // 	this.buttonStyleRange = "button-active";

  // 	this.searchByDates = "dates";
  // 	var startDate = moment(res.from);
  // 	var endDate = moment(res.to);
  // 	this.search(startDate, endDate);
  // }

  // setEnquiry() {
  // 		this.searchType = "enquiry";
  //     this.btn_enq = "button-optioni";
  //     this.btn_astv = "";
  //     this.btn_indt = "";
  //     this.btn_all = "";
  // 		this.searchOnChange();
  // }

  // setConfirmed() {
  // 		this.searchType = "confirmed";
  //     this.btn_enq = "";
  //     this.btn_astv = "button-optioni";
  //     this.btn_indt = "";
  //     this.btn_all = "";
  // 		this.searchOnChange();
  // }

  // setIndented() {
  // 		this.searchType = "indented";
  //     this.btn_enq = "";
  //     this.btn_astv = "";
  //     this.btn_indt = "button-optioni";
  //     this.btn_all = "";
  // 		this.searchOnChange();
  // }

  // setAll() {
  // 		this.searchType = "";
  //     this.btn_enq = "";
  //     this.btn_astv = "";
  //     this.btn_indt = "";
  //     this.btn_all = "button-optioni";
  // 		this.searchOnChange();
  // }

  // searchOnChange() {
  //   this.loop = false;
  // 	if(this.searchByDates === "dates") {
  // 		var res = {
  // 			from: this.startDate,
  // 			to: this.endDate
  // 		};
  // 		this.searchDates(res);
  // 	} else if (this.searchByDates === "month") this.searchMonth();
  // 	else if (this.searchByDates === "week") this.searchWeek();
  // 	else this.searchToday();
  // }

  // 	//Function to covert object to csv format
  // convertToCSV(objArray) {
	// 	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	// 	var str = '';
	// 	for (var i = 0; i < array.length; i++) {
	// 	    var line = '';
	// 	    for (var index in array[i]) {
	// 	        if (line != '') line += ','
	// 	        line += array[i][index];
	// 	    }
	// 	    str += line + '\r\n';
	// 	}
	// 	return str;
	// }

	// downloadReport() {
	// 	var url = this.convertToCSV(this.reports);
	//   this.fileTransfer.download(url, this.file.dataDirectory + 'reports.csv').then((entry) => {
	// 	    console.log('download complete: ' + entry.toURL());
	// 	}, (error) => {
	// 	    console.log(error);
	// 	});
	// }

	// convertJsonToHtml(objArray) {
	// 	var array = typeof objArray != 'object' ? JSON.parse(objArray) : new Array(objArray);
  //   	var keys = Object.keys(array[0]);
	// 	var str = '<table>';
	// 	str += '<tbody>';
	//     for (var i = 0; i < array.length; i++) {
	//         str += (i % 2 == 0) ? '<tr class="alt">' : '<tr>';
	//         for (var index in keys) {
	//             var objValue = array[i][keys[index]];

	//             // Support for Nested Tables
	//             if (typeof objValue === 'object' && objValue !== null) {
	//                 if (Array.isArray(objValue)) {
	//                     str += '<td>';
	//                     for (var aindex in objValue) {
	//                         str += this.convertJsonToHtml(objValue[aindex]);
	//                     }
	//                     str += '</td>';
	//                 } else {
	//                     str += '<td>' + this.convertJsonToHtml(objValue) + '</td>';
	//                 }
	//             } else {
	//                 str += '<td>' + objValue + '</td>';
	//             }

	//         }
	//         str += '</tr>';
	//     }
	//     str += '</tbody>'
	//     str += '</table>';
  //     console.log(str);
	//     return str;
	// }

	// mailReport() {
	// 			this.storage.get('user').then((user) => {
  //           this.studentService.sendReportsMail(user.email).then((data) => {
  //               this.presentToast('Successfully mailed to your id');              
  //           }, (err) => {
  //               this.presentToast('Error while sending mail');
	// 					});
	// 					if(user.role == "admin"){
	// 							this.studentService.sendIndentationReport(user.email).then((data) => {}, (err) => {});
	// 					}
	// 			});
	// }

	// dateRange() {
	//     this.calendarCtrl.openCalendar({
	//       isRadio: false,
	//       from: new Date(2017, 1 - 1, 1),
	//       to: new Date(),
	//       weekdaysTitle: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
  //       	defaultDate: new Date()
	//     })
	//       .then( (res:any) => { 
	//       	this.searchDates(res);
  // 		  })
	//       .catch( () => {} )
	// }

  // findCenter(cen) {
  //   for(var i = 0; i < this.centerList.length; i++) {
  //     if(this.centerList[i].center_code == cen) return this.centerList[i].center_name;
  //   }
	// }
