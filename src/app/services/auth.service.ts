import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from '@firebase/auth-types';
@Injectable()
export class AuthService {
  authState: any = null;
  userRef: AngularFireObject<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      // console.log(`002${auth.uid}`);
      this.authState = auth;
      // console.log(`003${this.authState.uid}`);
    });
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }
  get currentUserId(): string {
    console.log('id01' + this.authenticated + this.authState.uid);
    return this.authenticated ? this.authState.uid : '';
  }
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState.displayName || 'User without a Name';
    }
  }
  // tslint:disable-next-line: typedef
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }
  // tslint:disable-next-line: typedef
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }
  // tslint:disable-next-line: typedef
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }
  // tslint:disable-next-line: typedef
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }
  // tslint:disable-next-line: typedef
  private async socialSignIn(provider: GithubAuthProvider | GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider) {
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      console.log(credential.user);
      this.authState = credential.user;
      this.updateUserData();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  // tslint:disable-next-line: typedef
  async anonymousLogin() {
    try {
      const user = await this.afAuth.auth.signInAnonymously();
      this.authState = user;
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  // tslint:disable-next-line: typedef
  async emailSignUp(email: string, password: string) {
    try {
      const user = this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      console.log('user ' + user);
      this.authState = user;
      console.log('authState ' + this.authState);
      this.updateUserData();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  // tslint:disable-next-line: typedef
  async emailLogin(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.authState = user;
      this.updateUserData();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  // tslint:disable-next-line: typedef
  async resetPassword(email: string) {
    const fbAuth = firebase.auth();
    try {
      await fbAuth.sendPasswordResetEmail(email);
      return console.log('email sent');
    } catch (error) {
      return console.log(error);
    }
  }
  // tslint:disable-next-line: typedef
  getCurrentLoggedIn() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigate(['/']);
      }
    });
  }
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
  private updateUserData(): void {
    const path = `users/${this.currentUserId}`; // Endpoint on firebase
    const userRef: AngularFireObject<any> = this.db.object(path);
    const data = {
      email: this.authState.email,
      name: this.authState.displayName
    };
    userRef.update(data)
      .catch(error => console.log(error));
  }
}
