import { OperationType, handleFirestoreError, auth, db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { UserProfile } from '../types';

export const progressService = {
  async ensureUserDoc(user: any) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        xp: 0,
        level: 1,
        badges: [],
        streak: 0,
        lastActive: new Date().toISOString()
      };
      await setDoc(userRef, profile);
    }
  },

  async addXP(amount: number) {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        xp: increment(amount),
        level: increment(Math.floor(amount / 500)) // Simple level up logic
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  },

  async awardBadge(badgeName: string) {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        badges: arrayUnion(badgeName)
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  }
};
