<script setup>
import Header from "./components/Header.vue";
import MenuLeft from "./components/NavigationDrawer.vue";
import MainPage from "./components/Main.vue";
</script>
<template>
  <div class="flex h-screen p-4">
    <MenuLeft />
    <div class="w-9 ml-4">
      <Header />
      <MainPage />
    </div>
  </div>
</template>
