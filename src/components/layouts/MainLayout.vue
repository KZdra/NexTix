<template>
   <div class="min-h-screen bg-gray-100">
    <Navbar/>
    <div class="container mx-auto mt-8">
        <div class="min-h-screen p-6 bg-gray-100">
            <slot></slot>
        </div>
    </div>
    </div>
</template>
<script setup lang="ts">
import Navbar from '../Navbar.vue';
import { RouterView } from 'vue-router';
</script>