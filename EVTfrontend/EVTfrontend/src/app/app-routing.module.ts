import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AboutComponent } from './pages/about/about.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { AuthGuard} from "./services/auth.guard";
import {ChatbotComponent} from "./chatbot/chatbot.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'events/create', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'create-event', component: EventFormComponent },
  { path: 'edit-event/:id', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: 'event-details/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: 'chatbot', component: ChatbotComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
