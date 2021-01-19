import {Component, Input} from '@angular/core';
import {IRepos} from '../app.component';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent {

  @Input() rep!: IRepos;
  @Input() index = 0;
}
