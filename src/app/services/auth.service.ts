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
            .then(userData => resolve(userData),
                  err => reject(err));
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

  // Metodo para 'cerrar la sesisión' de un usuario
  logout() {
    this.afsAuth.auth.signOut();
  }

  // Metodo para comprobar si un usuario esta logueado.
  estaAutenticado() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  private updateUserData( user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);
    const data: Usuario = {
      id: user.uid,
      correo: user.email,
      perfil: {
        roles:{
          editor: true
        }
      }
    }
    return userRef.set(data, { merge: true })
  }


  isUserAdmin(userUid) {
    return this.afs.doc<Usuario>(`usuarios/${userUid}`).valueChanges();
  }
}
