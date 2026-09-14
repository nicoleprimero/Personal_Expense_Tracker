<template>
  <ion-page>
    <ion-header class="app-header">
      <ion-toolbar>
        <ion-title>my<span>ledger</span></ion-title>
        <ion-buttons slot="end">
          <ion-chip class="connection-chip" :class="{ offline: !isConnected }">
            <span class="status-dot"></span>
            <ion-label>{{ isConnected ? 'Connected' : 'Offline' }}</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell">
        <section class="intro-row">
          <div>
            <p class="eyebrow">PERSONAL FINANCE</p>
            <h1>Spend with <em>intention.</em></h1>
            <p class="intro-copy">A simple, honest view of where your money goes.</p>
          </div>
          <span class="today-label">{{ currentMonthLabel }}</span>
        </section>

        <section class="summary-grid" aria-label="Monthly expense summary">
          <div class="monthly-total">
            <p class="monthly-total-label">TOTAL THIS MONTH</p>
            <h2>₱{{ monthlyTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</h2>
            <p class="monthly-total-period">{{ currentMonthLabel }}</p>
          </div>
          <div class="summary-note">
            <span class="summary-mark">✦</span>
            <div>
              <strong>{{ expenses.length }} {{ expenses.length === 1 ? 'expense' : 'expenses' }}</strong>
              <p>Recorded in your ledger</p>
            </div>
          </div>
        </section>

        <section class="workspace-grid">
          <ExpenseForm
            :initial-data="selectedExpense"
            :is-editing="isEditing"
            @submit="handleSaveExpense"
            @cancel="resetSelection"
          />
          <ExpenseList
            :expenses="expenses"
            @edit="handleEditExpense"
            @delete="handleDeleteExpense"
          />
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonChip, IonLabel, IonButtons 
} from '@ionic/vue';

import ExpenseForm from '../components/ExpenseForm.vue';
import type { Expense } from '../components/ExpenseForm.vue';
import ExpenseList from '../components/ExpenseList.vue';
import {
  checkFirebaseConnection,
  deleteExpense,
  saveExpense,
  subscribeToExpenses,
} from '../firebase';

const expenses = ref<Expense[]>([]);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const selectedExpense = ref<Expense | null>(null);
const isConnected = ref(false);

const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
}).format(new Date());
const monthlyTotal = computed(() => expenses.value
  .filter((expense) => expense.date.startsWith(currentMonthKey))
  .reduce((total, expense) => total + Number(expense.amount || 0), 0));

let unsubscribeConnection: (() => void) | null = null;
let unsubscribeExpenses: (() => void) | null = null;

onMounted(() => {
  unsubscribeConnection = checkFirebaseConnection((status) => {
    isConnected.value = status;
  });
  unsubscribeExpenses = subscribeToExpenses((storedExpenses) => {
    expenses.value = storedExpenses;
  });
});

onUnmounted(() => {
  if (unsubscribeConnection) {
    unsubscribeConnection();
  }
  if (unsubscribeExpenses) {
    unsubscribeExpenses();
  }
});

const handleSaveExpense = async (expenseData: Expense) => {
  try {
    await saveExpense({
      ...expenseData,
      id: isEditing.value ? editingId.value || undefined : undefined,
    });
    resetSelection();
  } catch (error) {
    console.error('Failed to save expense:', error);
    alert('Unable to save the expense. Check your Firebase Realtime Database rules.');
  }
};

const handleEditExpense = (expense: Expense) => {
  isEditing.value = true;
  editingId.value = expense.id || null;
  selectedExpense.value = { ...expense };
};

const handleDeleteExpense = async (id?: string) => {
  if (!id) return;

  try {
    await deleteExpense(id);
    if (editingId.value === id) {
      resetSelection();
    }
  } catch (error) {
    console.error('Failed to delete expense:', error);
    alert('Unable to delete the expense. Check your Firebase Realtime Database rules.');
  }
};

const resetSelection = () => {
  isEditing.value = false;
  editingId.value = null;
  selectedExpense.value = null;
};
</script>

<style scoped>
.monthly-total {
  padding: 25px 28px;
  border-radius: 18px;
  background: #246b57;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(36, 107, 87, 0.18);
}

.monthly-total-label {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  opacity: 0.78;
}

.monthly-total h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.monthly-total-period {
  margin: 5px 0 0;
  font-size: 0.85rem;
  opacity: 0.82;
}

.app-header {
  --background: rgba(244, 246, 242, 0.92);
}

.app-header ion-toolbar {
  --background: transparent;
  --border-width: 0;
  max-width: 1120px;
  margin: 0 auto;
}

.app-header ion-title {
  color: var(--tracker-ink);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.app-header ion-title span {
  color: var(--ion-color-primary);
}

.connection-chip {
  --background: var(--tracker-soft);
  --color: var(--ion-color-primary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.connection-chip.offline {
  --background: #f8e9df;
  --color: #aa5e31;
}

.status-dot {
  width: 7px;
  height: 7px;
  margin-right: 7px;
  border-radius: 50%;
  background: currentColor;
}

.page-shell {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.intro-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
}

.eyebrow,
.monthly-total-label {
  margin: 0 0 9px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.eyebrow {
  color: var(--ion-color-primary);
}

h1 {
  margin: 0;
  color: var(--tracker-ink);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 750;
  letter-spacing: -0.06em;
  line-height: 0.96;
}

h1 em {
  color: var(--tracker-warm);
  font-family: Georgia, serif;
  font-weight: 400;
}

.intro-copy {
  margin: 14px 0 0;
  color: var(--tracker-muted);
  font-size: 0.95rem;
}

.today-label {
  padding-bottom: 5px;
  color: var(--tracker-muted);
  font-size: 0.78rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, 0.75fr);
  gap: 16px;
  margin-bottom: 30px;
}

.summary-note {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px 28px;
  border: 1px solid var(--tracker-line);
  border-radius: 18px;
  background: var(--tracker-surface);
}

.summary-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  background: #f8eadf;
  color: var(--tracker-warm);
  font-size: 1.2rem;
}

.summary-note strong {
  color: var(--tracker-ink);
  font-size: 1rem;
}

.summary-note p {
  margin: 5px 0 0;
  color: var(--tracker-muted);
  font-size: 0.8rem;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.22fr);
  gap: 28px;
  align-items: start;
}

@media (max-width: 760px) {
  .page-shell {
    width: min(100% - 28px, 560px);
    padding-top: 30px;
  }

  .intro-row {
    display: block;
  }

  .today-label {
    display: block;
    margin-top: 18px;
  }

  .summary-grid,
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>