import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Authenticate } from '../usuario';

@Component({
  selector: 'login-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });

  get emailInput() { return this.signin.get('email'); }
  get passwordInput() { return this.signin.get('password'); }



  _pending = false;

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
    this._pending = isPending;
  }

  @Input()
  errorMessage: string | null = '';

  @Output()
  submitted = new EventEmitter<Authenticate>();

  hide = true;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.submitted.emit(this.loginForm.value);
    } else if (this.loginForm.get('username')?.valid) {
      if (!this.loginForm.get('password')?.valid) {
        this.errorMessage = 'Ingrese contraseña';
      }
    } else {
      this.errorMessage = 'Ingrese usuario';
    }
  }
}
