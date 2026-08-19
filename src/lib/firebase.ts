import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { MealDetail, SavedMealRecord } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Enable local persistence so user session survives refreshes
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence warning:', err);
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Check redirect result on startup in case redirect was used
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log('Redirect sign-in successful:', result.user.email);
    }
  })
  .catch((error) => {
    console.warn('Redirect sign-in note:', error);
  });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on load per skill
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration or network status.');
    }
  }
}
testFirestoreConnection();

/**
 * Sign In with Google
 * Uses popup by default; falls back gracefully if popup is blocked or closed.
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    // If popup is blocked by browser in iframe, attempt redirect
    if (error.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.error('Redirect sign-in error:', redirectErr);
      }
    }
    throw error;
  }
}

/**
 * Sign Out
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Helper to sanitize ID to match ^[a-zA-Z0-9_\-]+$
 */
export function sanitizeDocId(rawId: string): string {
  const sanitized = (rawId || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
  return sanitized || `meal-${Date.now()}`;
}

/**
 * Save Meal to Firestore
 */
export async function saveMeal(
  userId: string,
  meal: MealDetail,
  userNotes?: string
): Promise<void> {
  if (!userId) throw new Error('User must be logged in to save a meal');

  const cleanMealId = sanitizeDocId(meal.id || meal.title);
  const path = `users/${userId}/savedMeals/${cleanMealId}`;

  try {
    const now = new Date().toISOString();
    const docRef = doc(db, 'users', userId, 'savedMeals', cleanMealId);

    const payload: SavedMealRecord = {
      id: cleanMealId,
      userId,
      title: (meal.title || 'Untitled Meal').slice(0, 200),
      tagline: (meal.tagline || '').slice(0, 300),
      cuisine: (meal.cuisine || 'Fusion').slice(0, 100),
      spiceLevel: (meal.spiceLevel || 'Medium').slice(0, 50),
      prepTimeMinutes: Number(meal.prepTimeMinutes) || 15,
      cookTimeMinutes: Number(meal.cookTimeMinutes) || 20,
      servings: Number(meal.servings) || 2,
      calories: Number(meal.calories) || 500,
      proteinG: Number(meal.proteinG) || 30,
      carbsG: Number(meal.carbsG) || 40,
      fatG: Number(meal.fatG) || 15,
      healthScore: Number(meal.healthInsight?.score) || 85,
      healthBadge: (meal.healthInsight?.badge || 'Nutrient Dense').slice(0, 100),
      healthPros: (meal.healthInsight?.healthPros || []).slice(0, 20),
      healthCons: (meal.healthInsight?.healthCons || []).slice(0, 20),
      ingredients: (meal.ingredients || []).slice(0, 100),
      instructions: (meal.instructions || []).slice(0, 100),
      similarMeals: (meal.similarMeals || []).slice(0, 20),
      betterAlternatives: (meal.betterAlternatives || []).slice(0, 20),
      notes: (userNotes || '').slice(0, 2000),
      isFavorite: false,
      hasCooked: false,
      createdAt: now,
      updatedAt: now,
      fullDetail: {
        ...meal,
        id: cleanMealId,
      },
    };

    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update saved meal (favorite status, cooked, notes)
 */
export async function updateSavedMealStatus(
  userId: string,
  mealId: string,
  updates: Partial<SavedMealRecord>
): Promise<void> {
  const cleanMealId = sanitizeDocId(mealId);
  const path = `users/${userId}/savedMeals/${cleanMealId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedMeals', cleanMealId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete saved meal
 */
export async function removeSavedMeal(userId: string, mealId: string): Promise<void> {
  const cleanMealId = sanitizeDocId(mealId);
  const path = `users/${userId}/savedMeals/${cleanMealId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedMeals', cleanMealId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to user saved meals
 */
export function subscribeToSavedMeals(
  userId: string,
  onUpdate: (meals: SavedMealRecord[]) => void,
  onError?: (err: any) => void
) {
  const path = `users/${userId}/savedMeals`;
  const mealsCol = collection(db, 'users', userId, 'savedMeals');

  return onSnapshot(
    mealsCol,
    (snapshot) => {
      const meals: SavedMealRecord[] = [];
      snapshot.forEach((docSnap) => {
        meals.push(docSnap.data() as SavedMealRecord);
      });
      // Sort newest first
      meals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(meals);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}
