import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import api from '../../api/axios/axiosInstance';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser]                       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const fetchProfilePicture = useCallback(async () => {
    try {
      const r = await api.get('/settings/profile');
      setProfilePictureUrl(r.data?.pictureUrl || null);
    } catch {
      setProfilePictureUrl(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        const verified = firebaseUser.emailVerified ? firebaseUser : null;
        setUser(verified);
        if (verified) fetchProfilePicture();
        else setProfilePictureUrl(null);
      } else {
        setUser(null);
        setProfilePictureUrl(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchProfilePicture]);

  const login        = (email, password)  => signInWithEmailAndPassword(auth, email, password);
  const signup       = (email, password)  => createUserWithEmailAndPassword(auth, email, password);
  const loginGoogle  = ()                 => signInWithPopup(auth, googleProvider);
  const logout       = ()                 => signOut(auth);
  const resetPassword = (email)           => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginGoogle, logout, resetPassword, profilePictureUrl, setProfilePictureUrl }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
