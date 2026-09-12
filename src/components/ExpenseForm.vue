<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ isEditing ? 'Edit Expense' : 'Record New Expense' }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <!-- Expense Name -->
      <ion-item>
        <ion-label position="stacked">Expense Name</ion-label>
        <ion-input 
          :value="form.name" 
          @ionInput="onNameInput" 
          type="text" 
          placeholder="e.g. Groceries">
        </ion-input>
      </ion-item>

      <!-- Amount -->
      <ion-item>
        <ion-label position="stacked">Amount</ion-label>
        <ion-input 
          :value="form.amount" 
          @ionInput="onAmountInput" 
          type="number" 
          placeholder="0.00">
        </ion-input>
      </ion-item>

      <!-- Category -->
      <ion-item>
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
      <ion-item>
        <ion-label position="stacked">Date</ion-label>
        <ion-input 
          :value="form.date" 
          @ionInput="onDateInput" 
          type="date">
        </ion-input>
      </ion-item>

      <!-- Notes -->
      <ion-item>
        <ion-label position="stacked">Notes</ion-label>
        <ion-textarea 
          :value="form.notes" 
          @ionInput="onNotesInput" 
          placeholder="Optional notes...">
        </ion-textarea>
      </ion-item>

      <!-- Action Buttons -->
      <ion-button expand="full" class="ion-margin-top" @click="handleSubmit">
        {{ isEditing ? 'Update Expense' : 'Save Expense' }}
      </ion-button>
      <ion-button v-if="isEditing" expand="full" color="light" @click="$emit('cancel')">
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