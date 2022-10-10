import { Injectable } from '@angular/core';
import {ILoginForm} from "../interfaces/ILoginForm";
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";
import {IAccount} from "../interfaces/IAccount";
import {IRegisterForm} from "../interfaces/IRegisterForm";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  $isRegistering = new BehaviorSubject<boolean>(false);
  $registerError = new Subject<string>();
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

  register(registrationData: IRegisterForm) {
    console.log(registrationData)
    if (registrationData.firstName.length < 1){
      this.$registerError.next("Please enter a first name");

      return;
    }
    if (registrationData.lastName.length < 1){
      this.$registerError.next("Please enter a last name");
      return;
    }
    const isEmailValid = this.validateEmail(registrationData.email)
    if(!isEmailValid){
      this.$registerError.next('please enter a valid email');
      return;
    }
    if (registrationData.password.length < 1){
      this.$registerError.next("Please enter a password")
      return;
    }
    if (registrationData.password !== registrationData.confirmPassword){
      this.$registerError.next("Passwords do not match")
      return
    }

    this.httpService.findAccountByEmail(registrationData.email).subscribe({
      next: accountList => {
        if(accountList.length > 0){
          this.$registerError.next("Account with that email already exists")
          return
        }
      },  error: (err) => {
        console.error(err);
        this.$registerError.next("Unable to Register, try again later")
      }
    })

    this.httpService.register({
      id: uuidv4(),
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      password: registrationData.password
    }
    ).pipe(first())
      .subscribe({
        next: newAccount => this.$account.next(newAccount)
      })
  }
}
