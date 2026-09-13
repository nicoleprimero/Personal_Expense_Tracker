import {initializeApp} from 'firebase/app';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: 
        import.meta.env.VITE_FIREBASE_API_KEY,

    authDomain:
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

    databaseURL:
        import.meta.env.VITE_FIREBASE_DATABASE_URL,

    projectId:
        import.meta.env.VITE_FIREBASE_PROJECT_ID,

    storageBucket:
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

    messagingSenderId:
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

    appId:
        import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };

export interface FirebaseExpense {
    name: string;
    amount: number;
    category: string;
    date: string;
    notes: string;
}

const expensesRef = ref(database, 'Expense');

const isExpense = (value: unknown): value is FirebaseExpense => {
    if (!value || typeof value !== 'object') return false;

    const expense = value as Partial<FirebaseExpense>;
    return typeof expense.name === 'string'
        && typeof expense.amount === 'number'
        && typeof expense.category === 'string'
        && typeof expense.date === 'string'
        && typeof expense.notes === 'string';
};

export const subscribeToExpenses = (
    callback: (expenses: Array<FirebaseExpense & { id: string }>) => void,
) => onValue(expensesRef, (snapshot) => {
    const data = snapshot.val() as Record<string, FirebaseExpense> | null;
    const expenses = data
        ? Object.entries(data)
            .filter(([, expense]) => isExpense(expense))
            .map(([id, expense]) => ({ id, ...expense }))
        : [];

    callback(expenses);
});

export const saveExpense = async (
    expense: FirebaseExpense & { id?: string },
) => {
    const { id, ...expenseData } = expense;
    const expenseRef = id ? ref(database, `Expense/${id}`) : push(expensesRef);
    await set(expenseRef, expenseData);
};

export const deleteExpense = async (id: string) => {
    await remove(ref(database, `Expense/${id}`));
};

export const checkFirebaseConnection = (callback: (isConnected: boolean) => void) => {
  const connectedRef = ref(database, '.info/connected');
  return onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
    });
};