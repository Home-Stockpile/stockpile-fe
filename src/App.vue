<script setup>
import Header from "./components/Header.vue";
import MenuLeft from "./components/MenuLeft.vue";
import MainPage from "./components/MainPage.vue";
</script>

<template>
  <div class="flex h-screen">
    <MenuLeft />
    <div class="w-9">
      <Header />
      <MainPage />
    </div>
  </div>
</template>
