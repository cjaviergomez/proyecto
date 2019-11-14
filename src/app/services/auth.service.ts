import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// Para trabajar con AngularFire2
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

// Models
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore) { }

  // Metodo para autenticar y crear un nuevo usuario en Firebase.
  nuevoUsuario(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.createUserWithEmailAndPassword(usuario.correo, usuario.password)
        .then(userData => {
          resolve(userData),
          this.updateUserData(userData.user, usuario)
        }).catch(err => console.log(reject(err)))
    });
  }

  // Loguear a un usuario con correo y contraseña.
  login(usuario: Usuario) {
    return new Promise((resolve, reject) => {
       this.afsAuth.auth.signInWithEmailAndPassword(usuario.correo, usuario.password)
           .then(userData => resolve(userData),
                  err => reject(err));
                });
  }

  /**
   * Iniciar el proceso de restablecimiento de contraseña para este usuario
   * @param email correo del usuario
   */
  resetPasswordInit(email: string) {
    return this.afsAuth.auth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' });
  }

  // Metodo para 'cerrar la sessión' de un usuario
  logout() {
    this.afsAuth.auth.signOut();
  }

  getAuth() {
    return this.afsAuth.auth;
  }

  // Metodo para comprobar si un usuario esta logueado.
  estaAutenticado() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  private updateUserData( user: any, usuario: Usuario) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);
    const data: Usuario = {
      ...usuario
    };
    return userRef.set(data, { merge: true });
  }

  isUserAdmin(userUid: string) {
    return this.afs.doc<Usuario>(`usuarios/${userUid}`).valueChanges();
  }
}
