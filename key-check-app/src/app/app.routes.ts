import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoggedInComponent } from './logged-in/logged-in.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{path:'', component:HomeComponent},
	{path:'login', component:LoginComponent},
	{path:'logged-in', component:LoggedInComponent ,canActivate:[AuthGuard]},
];
