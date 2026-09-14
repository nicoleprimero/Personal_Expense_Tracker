<template>
  <ion-card class="expense-form-card">
    <ion-card-header>
      <p class="form-kicker">{{ isEditing ? 'UPDATE ENTRY' : 'NEW ENTRY' }}</p>
      <ion-card-title>{{ isEditing ? 'Edit Expense' : 'Record New Expense' }}</ion-card-title>
      <p class="form-hint">Add the details you will want to remember later.</p>
    </ion-card-header>
    <ion-card-content>
      <!-- Expense Name -->
      <ion-item lines="none" class="form-field">
        <ion-label position="stacked">Expense Name</ion-label>
        <ion-input 
          :value="form.name" 
          @ionInput="onNameInput" 
          type="text" 
          placeholder="e.g. Groceries">
        </ion-input>
      </ion-item>

      <!-- Amount -->
      <ion-item lines="none" class="form-field">
        <ion-label position="stacked">Amount</ion-label>
        <ion-input 
          :value="form.amount" 
          @ionInput="onAmountInput" 
          type="number" 
          placeholder="0.00">
        </ion-input>
      </ion-item>

      <!-- Category -->
      <ion-item lines="none" class="form-field">
        <ion-label position="stacked">Category</ion-label>
        <ion-select 
          :value="form.category" 
          @ionChange="onCategoryChange" 
          placeholder="Select Category">
          <ion-select-option value="Food">Food</ion-select-option>
          <ion-select-option value="Transportation">Transportation</ion-select-option>
          <ion-select-option value="Utilities">Utilities</ion-select-option>
          <ion-select-option value="Entertainment">Entertainment</ion-select-option>
          <ion-select-option value="Other">Other</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Date -->
      <ion-item lines="none" class="form-field">
        <ion-label position="stacked">Date</ion-label>
        <ion-input 
          :value="form.date" 
          @ionInput="onDateInput" 
          type="date">
        </ion-input>
      </ion-item>

      <!-- Notes -->
      <ion-item lines="none" class="form-field">
        <ion-label position="stacked">Notes</ion-label>
        <ion-textarea 
          :value="form.notes" 
          @ionInput="onNotesInput" 
          placeholder="Optional notes...">
        </ion-textarea>
      </ion-item>

      <!-- Action Buttons -->
      <ion-button expand="block" class="save-button ion-margin-top" @click="handleSubmit">
        {{ isEditing ? 'Update Expense' : 'Save Expense' }}
      </ion-button>
      <ion-button v-if="isEditing" expand="block" fill="clear" class="cancel-button" @click="$emit('cancel')">
        Cancel
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
  IonTextarea, IonButton 
} from '@ionic/vue';

export interface Expense {
  id?: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

const props = defineProps<{
  initialData?: Expense | null;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', expense: Expense): void;
  (e: 'cancel'): void;
}>();

const form = ref<Expense>({
  name: '',
  amount: 0,
  category: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
});

// Defined BEFORE watch so it exists when immediate watch fires
const resetForm = () => {
  form.value = {
    name: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };
};

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = { ...newData };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const onNameInput = (ev: CustomEvent) => {
  form.value.name = ev.detail.value ?? '';
};

const onAmountInput = (ev: CustomEvent) => {
  form.value.amount = Number(ev.detail.value) || 0;
};

const onCategoryChange = (ev: CustomEvent) => {
  form.value.category = ev.detail.value ?? '';
};

const onDateInput = (ev: CustomEvent) => {
  form.value.date = ev.detail.value ?? '';
};

const onNotesInput = (ev: CustomEvent) => {
  form.value.notes = ev.detail.value ?? '';
};

const handleSubmit = () => {
  if (!form.value.name || !form.value.amount || !form.value.category) {
    alert('Please complete Expense Name, Amount, and Category.');
    return;
  }
  emit('submit', { ...form.value });
};
</script>

<style scoped>
.expense-form-card ion-card-header {
  padding: 26px 26px 12px;
}

.form-kicker {
  margin: 0 0 8px;
  color: var(--ion-color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.expense-form-card ion-card-title {
  color: var(--tracker-ink);
  font-size: 1.4rem;
  font-weight: 750;
}

.form-hint {
  margin: 8px 0 0;
  color: var(--tracker-muted);
  font-size: 0.82rem;
}

.expense-form-card ion-card-content {
  padding: 12px 26px 26px;
}

.form-field {
  --background: #f6f8f5;
  --padding-start: 14px;
  --inner-padding-end: 12px;
  --min-height: 62px;
  margin: 10px 0;
  border: 1px solid transparent;
  border-radius: 10px;
}

.form-field:focus-within {
  --background: #ffffff;
  border-color: var(--ion-color-primary);
}

.form-field ion-label {
  margin-bottom: 4px;
  color: var(--tracker-muted) !important;
  font-size: 0.72rem !important;
  font-weight: 700;
}

.form-field ion-input,
.form-field ion-select,
.form-field ion-textarea {
  --color: var(--tracker-ink);
  font-size: 0.94rem;
}

.save-button {
  --background: var(--ion-color-primary);
  --border-radius: 10px;
  height: 49px;
  margin-top: 18px;
  font-weight: 750;
  text-transform: none;
}

.cancel-button {
  --color: var(--tracker-muted);
  font-size: 0.84rem;
  text-transform: none;
}
</style>