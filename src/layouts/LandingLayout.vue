<template>
  <q-layout class="full-height full-width flex flex-center bg-primary">
    <q-card style="width: 85vw" class="transparent" flat>
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-7">
          <q-card-section class="bg-white q-pa-sm">
            <q-img src="/bg2.jpg">
              <div
                class="flex justify-end q-pa-md"
                style="width: 100%; border-radius: 10px"
              >
                <q-btn-toggle
                  v-model="mode"
                  spread
                  class="full-width"
                  no-caps
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  :options="[
                    { label: 'Sign in', value: 'signin' },
                    { label: 'Sign up', value: 'signup' },
                  ]"
                />
              </div>
            </q-img>
          </q-card-section>
        </div>
        <div class="col-12 col-md-5">
          <q-card
            class="bg-dark q-pa-sm"
            square
            flat
            style="height: 100%; width: 100%"
          >
            <div class="flex flex-center" style="height: 100%">
              <div style="width: 70%" class="text-center">
                <q-icon name="las la-user-circle" color="primary" size="xl" />

                <SignupForm v-if="mode === 'signup'" />
                <SigninForm v-if="mode === 'signin'" />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>
  </q-layout>
</template>

<script setup>
import SignupForm from "components/SignupForm.vue";
import SigninForm from "components/SigninForm.vue";

import { ref } from "vue";

const mode = ref("signin");
</script>

<style></style>
