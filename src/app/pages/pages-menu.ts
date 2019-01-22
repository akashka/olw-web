import { NbMenuItem } from '@nebular/theme';
var storage = window.localStorage;
var user = JSON.parse(storage.getItem('user'));

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

// if (user.role == 'admin') {
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
// }

// if (user.role == 'counsellor') {
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
// }

// if (user.role == 'dispatcher') {
SMENU_ITEMS.push(
  {
    title: 'Dispatch',
    icon: 'nb-paper-plane',
    link: '/pages/dispatch',
  },
)

// }

export const MENU_ITEMS = SMENU_ITEMS;
