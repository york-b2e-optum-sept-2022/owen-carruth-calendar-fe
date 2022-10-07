import { Injectable } from '@angular/core';
import {ILoginForm} from "../interfaces/ILoginForm";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAccount} from "../interfaces/IAccount";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  findAccountByEmail(loginEmail: string) {
    //using query string to get data from /accounts where email = loginEmail, returning as Observable<IAccount> to be able to assign to $account in account service
    return this.httpClient.get(`http://localhost:3000/accounts?email=${loginEmail}`) as Observable<IAccount[]>;

  }

}
