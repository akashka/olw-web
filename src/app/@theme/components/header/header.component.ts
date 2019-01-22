import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';

import { Auth } from '../../../providers/auth/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';
  user: any;
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  storage = window.localStorage;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private router: Router,
    public authService: Auth,
) {
  }

  ngOnInit() {
    this.user = JSON.parse(this.storage.getItem('user'));
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.router.navigate(['./pages/iot-dashboard']);
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  log_out() {
    this.authService.logout();
  }

  go_to_profile() {

  }
}
