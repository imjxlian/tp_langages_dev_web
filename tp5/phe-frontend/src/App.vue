<template>
    <el-header>
        <el-menu mode="horizontal" :ellipsis="false" router>
            <el-menu-item index="0" :route="{ name: 'Home' }">Pari Hippique Étudiant</el-menu-item>

            <article class="flex-grow"/>

            <el-menu-item v-if="loggedIn" index="1" :route="{ name: 'Race' }">Course</el-menu-item>
            <el-menu-item v-if="loggedIn" @click="logout">Se déconnecter</el-menu-item>
            <el-menu-item v-else index="1" :route="{ name: 'Login' }">Se connecter</el-menu-item>
        </el-menu>
    </el-header>

    <el-main>
        <router-view></router-view>
    </el-main>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const loggedIn = computed(() => store.getters.loggedIn);

const logout = () => {
    store.dispatch('logout');
    router.push({ name: 'Login' });
};
</script>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>
