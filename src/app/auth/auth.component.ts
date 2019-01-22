import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  styleUrls: ['auth.component.scss'],
  template: `\n    
    <nb-layout>\n      
      <nb-layout-column>\n
        <nb-card>\n          
          <nb-card-body>\n   
              <div style="width:60%;float:left;margin:30px;"> 
                <img src="../assets/images/logo_littleW_0.png" style="width:60%;height:auto;margin:60px;">
              </div>         
              <div style="width:40%;float:left;margin:30px;">
                <router-outlet></router-outlet>\n            
              </div>
          </nb-card-body>\n        
        </nb-card>\n      
      </nb-layout-column>\n    
    </nb-layout>\n  `,
})

export class AuthComponent {

}
