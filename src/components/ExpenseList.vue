<template>
  <div>
    <ion-list-header>
      <ion-label><strong>Recorded Expenses</strong></ion-label>
    </ion-list-header>

    <ion-list>
      <ion-item-sliding v-for="expense in expenses" :key="expense.id">
        <ion-item>
          <ion-label>
            <h2><strong>{{ expense.name }}</strong> — ₱{{ expense.amount }}</h2>
            <p>Category: {{ expense.category }} | Date: {{ expense.date }}</p>
            <p v-if="expense.notes"><em>Notes: {{ expense.notes }}</em></p>
          </ion-label>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="warning" @click="$emit('edit', expense)">
            Edit
          </ion-item-option>
          <ion-item-option color="danger" @click="$emit('delete', expense.id)">
            Delete
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { 
  IonList, IonListHeader, IonItemSliding, IonItem, 
  IonLabel, IonItemOptions, IonItemOption 
} from '@ionic/vue';
import type { Expense } from './ExpenseForm.vue';

defineProps<{
  expenses: Expense[];
}>();

defineEmits<{
  (e: 'edit', expense: Expense): void;
  (e: 'delete', id?: string): void;
}>();
</script>