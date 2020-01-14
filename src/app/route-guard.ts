import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './route-auth';
@Injectable()
export class ActivateRouteGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem("islogged")) {
            var prevLoc = this.router.url;
            this.authService.loggedIn.next(true);
            return true;
        }
        else {
            this.router.navigate(['/login']);
            this.authService.loggedIn.next(false);
            return false;
        }

    }
}