import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // save role at login

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check role access
    const allowedRoles = route.data['roles'] as Array<string>;
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole!)) {
      // Not authorized
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
