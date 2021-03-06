import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from '@firebase/auth-types';
import { AngularFirestore } from 'angularfire2/firestore';
@Injectable()
export class AuthService {
  authState: any = null;
  userRef: AngularFireObject<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
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
    return this.authenticated ? this.authState.user.uid : '';
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
  addUserData() {
    this.afs.collection('users').add({ email: this.authState.user.email });
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
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.authState = user;
      this.addUserData();
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
      email: this.authState.user.email,
      name: this.authState.user.displayName
    };
    userRef.update(data)
      .catch(error => console.log(error));
  }
}
