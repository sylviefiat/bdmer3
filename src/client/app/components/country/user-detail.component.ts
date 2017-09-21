import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from './../../modules/auth/models/user';

@Component({
  selector: 'bc-country-detail',
  template: `
    <div>
      <p>{{firstname}} {{lastname}} {{email}}</p>
      <button md-raised-button color="warn" (click)="removeuser.emit(user)">
        Remove user for country
      </button>
    </div>
  </div>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
  `,
  ],
})
export class UserDetailComponent {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() user: User;
  @Output() removeuser = new EventEmitter<User>();

  /**
   * Tip: Utilize getters to keep templates clean
   */
 
  get firstname() {
    return this.user.firstname;
  }

  get lastname() {
    return this.user.lastname;
  }

  get email() {
    return this.user.email;
  }
}
