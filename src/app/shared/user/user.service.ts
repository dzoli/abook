import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router, RouterLinkWithHref } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public test: string;
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    private baseUrl: string = environment.apiUrl;

    public loginData: any;
    public isAuthenticated: boolean;

    constructor(private http: HttpClient, private router: Router) {
        this.isAuthenticated = false;
    }

    loginUser(userData: any): Observable<any> {
        const authUrl = this.baseUrl + 'authenticate/';
        return new Observable((o) => {
            this.http.post(authUrl, userData, { headers: this.httpHeaders })
                .subscribe((res) => {
                    this.loginData = res;
                    this.isAuthenticated = true;
                    this.router.navigateByUrl('home');
                    o.next(res);
                    return o.complete();
                }, (err) => {
                    return o.error(err);
                })
        });
    }

    register(userData: any): Observable<any> {
        const registerUrl = this.baseUrl + 'users/';
        console.log('--register--', userData);
        return new Observable((o) => {
            this.http.post(registerUrl, {
                'first_name': userData.first_name,
                'last_name': userData.last_name,
                'password': userData.password,
                'username': userData.username,
                'email': userData.username     // email is like username
            }, { headers: this.httpHeaders })
                .subscribe((res) => {
                    o.next(res);
                    this.router.navigateByUrl('login');
                    return o.complete();
                },
                     (err) => o.error(err));
        });
    }

    logout() {
        this.isAuthenticated = false;
        this.loginData = {};
        console.log('user is logged out: ', this.isAuthenticated, this.loginData);
        this.router.navigateByUrl('login');
    }

    currentProfile(): Observable<any> {
        const url = this.baseUrl + 'profiles/' + this.loginData.user.id + '/';
        return new Observable((o: any) => {
            this.http.get(url, { headers: this.httpHeaders })
                .subscribe((res) => {
                    o.next(res);
                    return o.complete();
                }, (err) => {
                    return o.error(err);
                });
        })
    }

    updateProfile(profileId: number, formData: any): Observable<any> {
        const url = this.baseUrl + 'profiles/' + profileId + '/';
        return new Observable((o: any) => {
            this.http.put(url, {
                'id': profileId,
                'department': formData.department,
                'workplace': formData.workplace,
                'office': formData.office,
                'phone': formData.phone,
                'address': formData.address,
                'personal_web_site': formData.personal_web_site,
                'user': {
                    'id': this.loginData.user.id,
                    'username': formData.username,
                    'first_name': formData.first_name,
                    'last_name': formData.last_name
                }
            }, { headers: this.httpHeaders }).subscribe((res) => {
                o.next(res);
                return o.complete();
            }, (err) => {
                o.error(err);
            });
        });


        return null;
    }

}
