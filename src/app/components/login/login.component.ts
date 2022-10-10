import { Component, OnInit } from '@angular/core';
import {ILoginForm} from "../../interfaces/ILoginForm";
import {NgForm} from "@angular/forms";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 loginError: string | null = null;

  constructor(private accountService: AccountService) {
      this.accountService.$loginError.pipe().subscribe({
        next: loginError => this.loginError = loginError
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  onLogin(loginCreds: ILoginForm) {

    console.log(loginCreds)
    this.accountService.login(loginCreds)
  }

  goToRegister() {
    this.accountService.$isRegistering.next(true);
  }
}
