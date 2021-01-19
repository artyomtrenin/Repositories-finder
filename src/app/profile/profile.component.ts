import {Component, Input} from '@angular/core';
import {IUser} from '../app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() user!: IUser;
}
