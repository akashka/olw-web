import { Component, Input, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { Router } from '@angular/router';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})

export class PagesComponent implements OnInit { 

  menu;
  user;
  storage = window.localStorage;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(this.storage.getItem('user'));

    var SMENU_ITEMS: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'nb-keypad',
        link: '/pages/iot-dashboard',
      },
      {
        title: 'Reports',
        icon: 'nb-tables',
        link: '/pages/reports',
      }
    ];

    if (this.user.role == 'admin') {
      SMENU_ITEMS.push(
        {
          title: 'Centers',
          icon: 'nb-home',
          children: [
            {
              title: 'List Centers',
              link: '/pages/centers',
            },
            {
              title: 'Add Center',
              link: '/pages/createcenters',
            },
          ],
        },
        {
          title: 'Users',
          icon: 'nb-person',
          children: [
            {
              title: 'List Users',
              link: '/pages/users',
            },
            {
              title: 'Add User',
              link: '/pages/createusers',
            },
          ],
        },
        {
          title: 'Edit / Delete',
          icon: 'nb-arrow-retweet',
          children: [
            {
              title: 'Edit / Delete Student',
              link: '/pages/editstudent',
            },
            {
              title: 'Restore Student',
              link: '/pages/restore',
            },
          ],
        },
      );
    }

    if (this.user.role == 'counsellor') {
      SMENU_ITEMS.push(
        {
          title: 'Enquiry',
          icon: 'nb-compose',
          link: '/pages/enquiry',
        },
        {
          title: 'Confirm',
          icon: 'nb-roller-shades',
          link: '/pages/confirm',
        },
        {
          title: 'Indent',
          icon: 'nb-e-commerce',
          link: '/pages/indent',
        },
        {
          title: 'Promotion',
          icon: 'nb-bar-chart',
          link: '/pages/promotion',
        },
      );
    }

    if (this.user.role == 'dispatcher') {
      SMENU_ITEMS.push(
        {
          title: 'Dispatch',
          icon: 'nb-paper-plane',
          link: '/pages/dispatch',
        },
      )
    }

    this.menu = SMENU_ITEMS;

  }

}

