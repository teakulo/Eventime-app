import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventFormComponent} from "./pages/event-form/event-form.component";
import {AboutComponent} from "./pages/about/about.component";
import {ProfileEditComponent} from "./pages/profile-edit/profile-edit.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ChatbotComponent } from './chatbot/chatbot.component';
import {AuthInterceptor} from "./auth.interceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    EventDetailsComponent,
    UserProfileComponent,
    CalendarComponent,
    EventFormComponent,
    AboutComponent,
    ProfileEditComponent,
    ChatbotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
