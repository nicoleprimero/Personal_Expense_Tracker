<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Personal Expense Tracker</ion-title>
        <ion-buttons slot="end">
          <ion-chip :color="isConnected ? 'success' : 'danger'">
            <ion-label>{{ isConnected ? 'Connected' : 'Offline' }}</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Form Component -->
      <ExpenseForm 
        :initial-data="selectedExpense" 
        :is-editing="isEditing" 
        @submit="handleSaveExpense" 
        @cancel="resetSelection" 
      />

      <!-- List Component -->
      <ExpenseList 
        :expenses="expenses" 
        @edit="handleEditExpense" 
        @delete="handleDeleteExpense" 
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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