import { afterNextRender, Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector: 'app-shop-login',
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
],
    templateUrl: './shop-login.component.html',
    styleUrls: ['./shop-login.component.css'],
    host: { ngSkipHydration: 'true' }
})
export class ShopLoginComponent implements OnInit {

  public loginForm:any = "";
  public mensaje:any = "";
  public modal: boolean = true;
  public userLogin:any = "";
  public userObj:object = {};
  public ver:boolean = false;
  public inputType: string = "password";
  get user() { return this.loginForm.get('user'); }
  get pass() { return this.loginForm.get('pass'); }
  
  constructor(
    private authService:AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    afterNextRender(() => {
      this.estaLogueado();
    });
  }
  

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }  

  

  estaLogueado():any{
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('userAdmin')){
        this.userLogin = localStorage.getItem('userAdmin');
        this.userObj = JSON.parse(this.userLogin).user;
        //console.log('esta logueado');
        return true;
      }else{
        return false;
      }
    }
  }

  login(): void {
    
    this.authService.loginAdmin(this.user.value, this.pass.value).subscribe((d: any) => {
      if (d.length == 0) {
        this.mensaje = " No coinciden el usuario con la contraseña...";
      } else {
        this.modal = false;
        this.authService.SetUserDataAdmin(d);
      }
    });
  }

    onSubmit(): void {
      this.loginForm.reset();
    }

    ngOnInit(): void {
      this.loginForm = new FormGroup({
        user: new FormControl('',[Validators.required]),
        pass: new FormControl('',[Validators.required]),
    });
  }

}
