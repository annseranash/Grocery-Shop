import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guard/auth.guard';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { NavComponent } from './components/nav/nav.component';
import { RecipesComponent } from './components/recipes/recipes.component';

const routes: Routes = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'dashboard',component:DashboardComponent},
  {path:'login',component:LoginComponent},
  {path:'signUp',component:SignUpComponent},
  {path:'reset',component:ResetPassComponent},
  {path:'scroll',component:ScrollTopComponent,canActivate: [AuthGuard]},
  {path:'nav',component:NavComponent,canActivate: [AuthGuard]},
  {path:'home',component:HomeComponent,canActivate: [AuthGuard]},
  {path:'products',component:ProductsComponent,canActivate: [AuthGuard]},
  {path:'cart',component:CartComponent,canActivate: [AuthGuard]},
  {path:'recipes',component:RecipesComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
