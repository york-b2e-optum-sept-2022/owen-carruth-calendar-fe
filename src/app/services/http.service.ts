import { Injectable } from '@angular/core';
import {ILoginForm} from "../interfaces/ILoginForm";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAccount} from "../interfaces/IAccount";
import {IEvent} from "../interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  findAccountByEmail(loginEmail: string) {
    //using query string to get data from /accounts where email = loginEmail, returning as Observable<IAccount> to be able to assign to $account in account service
    return this.httpClient.get(`http://localhost:3000/accounts?email=${loginEmail}`) as Observable<IAccount[]>;
  }

  register(registerAccount: IAccount){
    return this.httpClient.post(`http://localhost:3000/accounts`, registerAccount) as Observable<IAccount>
  }

  getAccounts(email: string) {
    //ne operator excludes returning account of current user
    return this.httpClient.get(`http://localhost:3000/accounts?email_ne=${email}`) as Observable<IAccount[]>
  }

  getInviteList(item: string) {

  }

  createEvent(newEvent: IEvent) {
    console.log(typeof newEvent.date)
    return this.httpClient.post('http://localhost:3000/events', newEvent ) as Observable<IEvent>
  }

  getEvents(userId: string) {
    return this.httpClient.get(`http://localhost:3000/events?createdBy.id=${userId}`) as Observable<IEvent[]>
  }

  deleteEvent(eventID: string) {
    return this.httpClient.delete(`http://localhost:3000/events/${eventID}`)
  }
}
