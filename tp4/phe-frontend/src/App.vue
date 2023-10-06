<template>
    <el-header>
        <el-menu mode="horizontal" :ellipsis="false" router>
            <el-menu-item index="0" route="/">Pari Hippique Étudiant</el-menu-item>

            <article class="flex-grow"/>

            <el-menu-item index="1" route="/race" v-if="loggedIn">Course</el-menu-item>
            <el-menu-item @click="logout" v-if="loggedIn">Se déconnecter</el-menu-item>
            <el-menu-item index="2" route="/login" v-if="!loggedIn">Se connecter</el-menu-item>
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

// TOCHANGE
const loggedIn = computed(() => store.getters.loggedin);

const logout = () => {
  store.commit('logout');
};
</script>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>
