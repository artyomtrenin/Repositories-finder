import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

/**
 * описывает репозиторий
 */
export interface IRepos {
  title: string;
  description: string;
  url: string;
}

/**
 * описывает пользователя
 */
export interface IUser {
  userName: string;
  avatar_url: string;
  countOfRepos: number;
  Name: string;
  html_url: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('login', {static: true})
  input!: ElementRef;

  title = 'testTask';
  userIsFound = false;
  repos: IRepos[] = [];
  user!: IUser;

  /**
   * отправляет запрос на нужный url
   * @param url - адрес на который нужно сделать запрос
   */
  sendRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 400) {
          this.userIsFound = false;
          reject(`Status: ${xhr.status}`);
        } else {
          this.userIsFound = true;
          resolve (xhr.response);
        }
      };
      xhr.onerror = () => {
        this.userIsFound = false;
        reject('XHR on error');
      };
      xhr.send();
    });
  }

  /**
   * получает репозитории пользователя GitHub, вызывая sendRequest, и добавляет их в массив repos
   * @param userName - имя пользователя, репозитории которого необходимо получить
   */
  getRepos(userName: string): void {
    const url = `https://api.github.com/users/${userName}/repos`;
    this.sendRequest(url)
      .then((data: {[index: string]: any}) => {
        let key: string;
        for (key of Object.keys(data)){
          this.repos.push({
            title: data[key].name,
            description: data[key].description,
            url: data[key].html_url
        });
      }
      })
      .catch((err: string) => console.error(err));
  }

  /**
   * получает данные о пользователе GitHub, вызывая sendRequest, и записывает их в user: IUser
   * @param userName - имя пользователя, дынные которого необходимо получить
   */
  getUser(userName: string): void {
    const url = `https://api.github.com/users/${userName}`;
    this.sendRequest(url)
      .then((data: {[index: string]: any}) => {
          this.user.avatar_url = data.avatar_url;
          this.user.userName = data.login;
          this.user.countOfRepos = data.public_repos;
          this.user.Name = data.name;
          this.user.html_url = data.html_url;
      })
      .catch((err: string) => {
        console.error(err);
      });
  }

  /**
   * Получает данные о пользователе и его репозиториях, вызывая getUser и getRepos
   * @param userName - имя пользователя, дынные которого необходимо получить
   */
  getData(userName: string): void {
    this.clear();
    sessionStorage.setItem('user', userName);
    this.getUser(userName);
    this.getRepos(userName);
  }

  /**
   * Очищает данные о пользователе
   */
  clear(): void {
    this.user = {
      avatar_url: '',
      userName: '',
      countOfRepos: 0,
      Name: '',
      html_url: '',
    };
    this.userIsFound = false;
    this.repos = [];
  }

  /**
   * проверяет контекст страницы при перезагрузке в sessionStorage
   * получает данные пользователя из sessionStorage или input
   */
  // tslint:disable-next-line:typedef
  ngOnInit() {
    const userName: string | null = sessionStorage.getItem('user');
    if (userName !== null) {
      this.input.nativeElement.value = userName;
      this.getData(userName);
    } else {
      this.getData(this.input.nativeElement.value);
    }
  }

  /**
   * вызывает .click() у button
   * @param button - ссылка на HTMLButtonElement, у которого нужно вызвать click()
   */
  clickButton(button: HTMLButtonElement): void {
    button.click();
  }
}
