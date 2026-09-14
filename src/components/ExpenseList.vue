<template>
  <section class="expense-list-section">
    <div class="list-heading">
      <div>
        <p class="list-kicker">ACTIVITY</p>
        <h2>Recent expenses</h2>
      </div>
      <span>{{ expenses.length }} total</span>
    </div>

    <ion-list v-if="expenses.length" class="expense-list">
      <ion-item-sliding v-for="expense in expenses" :key="expense.id">
        <ion-item lines="none" class="expense-row">
          <div slot="start" class="category-mark" :class="`category-${expense.category.toLowerCase()}`">
            {{ expense.category.charAt(0) || '?' }}
          </div>
          <ion-label>
            <h2>{{ expense.name }}</h2>
            <p>{{ expense.category }} <span class="date-divider">•</span> {{ expense.date }}</p>
          </ion-label>
          <strong class="expense-amount">₱{{ Number(expense.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</strong>
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
    <div v-else class="empty-state">
      <p>No expenses recorded yet.</p>
      <span>Your latest entries will appear here.</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  IonList, IonItemSliding, IonItem,
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

<style scoped>
.expense-list-section {
  min-width: 0;
}

.list-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 3px 2px 14px;
}

.list-kicker {
  margin: 0 0 8px;
  color: var(--ion-color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.list-heading h2 {
  margin: 0;
  color: var(--tracker-ink);
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.list-heading > span {
  color: var(--tracker-muted);
  font-size: 0.78rem;
}

.expense-list {
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--tracker-line);
  border-radius: 18px;
  background: var(--tracker-surface);
}

.expense-row {
  --background: var(--tracker-surface);
  --padding-start: 18px;
  --inner-padding-end: 18px;
  --min-height: 84px;
  border-bottom: 1px solid var(--tracker-line);
}

.expense-row:last-child {
  border-bottom: 0;
}

.category-mark {
  display: grid;
  width: 40px;
  height: 40px;
  margin-right: 14px;
  place-items: center;
  border-radius: 12px;
  background: var(--tracker-soft);
  color: var(--ion-color-primary);
  font-size: 0.84rem;
  font-weight: 800;
}

.category-transportation { background: #f8eadf; color: #b66d31; }
.category-utilities { background: #e8e9f6; color: #5e619c; }
.category-entertainment { background: #f5e5ed; color: #a65379; }
.category-other { background: #ebeeeb; color: #65716b; }

.expense-row h2 {
  margin: 0 0 5px;
  color: var(--tracker-ink);
  font-size: 0.96rem;
  font-weight: 700;
}

.expense-row p {
  margin: 0;
  color: var(--tracker-muted);
  font-size: 0.76rem;
}

.date-divider {
  padding: 0 4px;
  color: var(--tracker-warm);
}

.expense-amount {
  margin-left: 12px;
  color: var(--tracker-ink);
  font-size: 0.92rem;
  white-space: nowrap;
}

.empty-state {
  padding: 44px 24px;
  border: 1px dashed #cbd7d0;
  border-radius: 18px;
  text-align: center;
}

.empty-state p {
  margin: 0 0 6px;
  color: var(--tracker-ink);
  font-weight: 700;
}

.empty-state span {
  color: var(--tracker-muted);
  font-size: 0.82rem;
}
</style>