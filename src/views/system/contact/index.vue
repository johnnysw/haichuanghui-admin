<script setup lang="ts">
import type { FormInstance } from "element-plus";
import ContactForm from "./components/ContactForm.vue";
import { useContact } from "./composables/useContact";

defineOptions({
  name: "SystemContact"
});

const {
  formModel,
  rules,
  loading,
  submitLoading,
  uploading,
  qrPreview,
  handleSubmit,
  handleReset,
  handleUploadQr,
  handleRemoveQr,
  registerForm
} = useContact();

const handleRegister = (instance: FormInstance) => {
  registerForm(instance);
};
</script>

<template>
  <div class="contact-page">
    <ContactForm
      :form-model="formModel"
      :rules="rules"
      :loading="loading"
      :submit-loading="submitLoading"
      :uploading="uploading"
      :qr-preview="qrPreview"
      @submit="handleSubmit"
      @reset="handleReset"
      @upload="handleUploadQr"
      @remove="handleRemoveQr"
      @register="handleRegister"
    />
  </div>
</template>

<style scoped>
.contact-page {
  padding: 24px;
}

@media (max-width: 768px) {
  .contact-page {
    padding: 16px;
  }
}
</style>
