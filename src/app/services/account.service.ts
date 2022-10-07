import { Injectable } from '@angular/core';
import {ILoginForm} from "../interfaces/ILoginForm";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {IAccount} from "../interfaces/IAccount";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  $loginError = new Subject<string>();
  $account = new BehaviorSubject<IAccount | null>(null);
  constructor(private httpService: HttpService) { }

  //TODO - figure out how this regex works
  validateEmail(email: string){
 let checker = email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    if(checker === null) return false;
    return true
  }

  login(loginCreds: ILoginForm){
    const isEmailValid = this.validateEmail(loginCreds.email)
    if(loginCreds.email.length < 1){
      this.$loginError.next('please enter a email')
      return
    }
    if(!isEmailValid){
      this.$loginError.next('please enter a valid email')
      return
    }
    if(loginCreds.password.length < 1){
      this.$loginError.next('please enter a password')
      return
    }

    this.httpService.findAccountByEmail(loginCreds.email).subscribe({
      next: returnedAccounts => {
        const validAccount = returnedAccounts.find(
          account => account.password === loginCreds.password
        )
        if (!validAccount) {
          this.$loginError.next("Invalid login, try again");
          return;
        }
       localStorage.setItem("account", `${validAccount}`)
        const acc = localStorage.getItem('account')
        this.$account.next(validAccount);
      },
      error: (err) => {
        console.error(err);
        this.$loginError.next("Unable to login")
      }
    })



  }
}
