import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        const path = route.routeConfig?.path;
        console.log(`AuthGuard: Checking access for route: ${path}`);
        console.log(`AuthGuard: Current auth status: ${isLoggedIn}`);

        // Identify routes that should be accessible when not authenticated
        const isAuthRoute = ['login', 'register'].includes(path || '');

        if (!isLoggedIn && isAuthRoute) {
          console.log(`AuthGuard: Access granted to ${path} for unauthenticated user.`);
          return true;  // Allow access to auth routes if not logged in
        }

        if (isLoggedIn && isAuthRoute) {
          // Redirect to home if trying to access login/register while logged in
          console.log(`AuthGuard: Redirecting to home because user is logged in and tried to access ${path}.`);
          this.router.navigate(['/home']);
          return false;
        }

        if (!isLoggedIn && !isAuthRoute) {
          // Redirect to login if trying to access a protected route and not logged in
          console.log(`AuthGuard: Redirecting to login because user is not authenticated and tried to access a protected route.`);
          this.router.navigate(['/login']);
          return false;
        }

        // Allow access if none of the above conditions apply
        console.log(`AuthGuard: Access granted to ${path}.`);
        return true;
      })
    );
  }
}
