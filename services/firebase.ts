// Fixed: Removed leading empty lines and unused imports to ensure correct Firebase v9 initialization.
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, increment } from "firebase/database";
import { FIREBASE_CONFIG } from "../constants";

const app = initializeApp(FIREBASE_CONFIG);
export const db = getDatabase(app);

export const logVisitor = async () => {
  const today = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
  const storageKey = `jawir_visit_${today}`;
  
  if (!localStorage.getItem(storageKey)) {
    await update(ref(db, `stats/daily/${today}`), { visitors: increment(1) });
    await update(ref(db, `stats/total`), { count: increment(1) });
    localStorage.setItem(storageKey, 'true');
  }
};

export const logFeature = async (featureName: string) => {
  await update(ref(db, `stats/features/${featureName}`), { count: increment(1) });
};