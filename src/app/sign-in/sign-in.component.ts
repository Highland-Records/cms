import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

	constructor(private router: Router) { }

	username = '';
	password = '';

	ngOnInit() {
		if (localStorage.getItem('sessionId') === '999') {
			this.router.navigate(['']);
		}
	}

	onSubmit(value: any) {
		this.username = value.username;
		this.password = value.password;
		if (this.username === 'admin' && this.password === 'password') {
			const sessionId: string = Math.random().toString();
			localStorage.setItem('sessionId', '999');
			this.router.navigate(['']);
		}
	}

}
