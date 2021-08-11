import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class NoAuthGuard implements CanActivate {

    constructor(
        private auth: AuthService, 
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        if(!this.auth.isAuthenticated()){
            this.auth.logout()
            return true;
        } else {
            return this.router.navigate(['/admin', 'dashboard'])
        }
    }
}