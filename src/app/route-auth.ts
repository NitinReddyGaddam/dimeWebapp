import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

    loggedIn = new BehaviorSubject<boolean>(false);

    constructor(private router: Router) { }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    logout() {
        this.loggedIn.next(false);
    }
}