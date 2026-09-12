<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Personal Expense Tracker</ion-title>
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
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent 
} from '@ionic/vue';

import ExpenseForm from '../components/ExpenseForm.vue';
import type { Expense } from '../components/ExpenseForm.vue';
import ExpenseList from '../components/ExpenseList.vue';

const expenses = ref<Expense[]>([]);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const selectedExpense = ref<Expense | null>(null);

const handleSaveExpense = (expenseData: Expense) => {
  if (isEditing.value && editingId.value) {
    const index = expenses.value.findIndex(item => item.id === editingId.value);
    if (index !== -1) {
      expenses.value[index] = { ...expenseData, id: editingId.value };
    }
  } else {
    expenses.value.push({
      ...expenseData,
      id: Date.now().toString()
    });
  }
  resetSelection();
};

const handleEditExpense = (expense: Expense) => {
  isEditing.value = true;
  editingId.value = expense.id || null;
  selectedExpense.value = { ...expense };
};

const handleDeleteExpense = (id?: string) => {
  if (!id) return;
  expenses.value = expenses.value.filter(item => item.id !== id);
  if (editingId.value === id) {
    resetSelection();
  }
};

const resetSelection = () => {
  isEditing.value = false;
  editingId.value = null;
  selectedExpense.value = null;
};
</script>