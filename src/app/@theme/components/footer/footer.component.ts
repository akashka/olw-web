import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="https://www.little-wonders.in/" target="_blank">Our Little Wonders</a></b> 2019</span>
    <div class="socials">
      <a href="https://www.facebook.com/ourlittlewondershmt/" target="_blank" class="ion ion-social-facebook"></a>
    </div>
  `,
})
export class FooterComponent {
}
