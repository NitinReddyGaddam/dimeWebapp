import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { AuthService } from '../route-auth';

declare var $: any;

@Component({
	selector: 'section-content',
	templateUrl: './login.component.html',
	styleUrls: ['../../assets/css/login.css'],
	providers: [LoginService]
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	errorMsg: string = "";

	constructor(private loginService: LoginService, private router: Router, private authService: AuthService) { }

	ngOnInit() {
		this.initLoginForm();
	}

	initLoginForm() {
		this.loginForm = new FormGroup({
			Name: new FormControl("", Validators.required),
			Password: new FormControl("", Validators.required),
			RememberMe: new FormControl("")
		});
	}

	submitLoginForm(formValue: any) {
		this.errorMsg = "";
		Object.keys(this.loginForm.controls).forEach(field => {
			const control = this.loginForm.get(field);
			control.markAsTouched({ onlySelf: true });
		});
		console.log('form value: ', formValue);
		if (this.loginForm.valid) {
			this.loginService.login(formValue).subscribe((response: any) => {

				console.log("submitLoginForm(): ", response);
				if (response._body != "0") {
					this.errorMsg = "";
					localStorage.setItem('islogged', 'true');
					localStorage.setItem('UserName', formValue.Name);
					localStorage.setItem('uId', response._body);
					this.authService.loggedIn.next(true);
					this.router.navigateByUrl("/home");
				}
				else {
					this.errorMsg = response._body;
				}
			});
		}
	}

}
