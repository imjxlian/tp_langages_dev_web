<template>
    <el-container direction="vertical">
        <el-row>
            <el-col :span="8">
                <el-form @submit.prevent="ajouterPari(username, form)" @reset.prevent="onReset" :model="form">
                    <el-form-item label="Vous pariez sur :">
                        <el-select v-model="form.cheval" id="cheval" placeholder="Sélectionnez votre cheval">
                            <el-option v-for="cheval in chevaux" :value="cheval.value" :label="cheval.text"/>
                        </el-select>
                    </el-form-item>

                    <el-button-group>
                        <el-button native-type="submit" type="primary">Parier</el-button>
                        <el-button native-type="reset" type="danger">Reset</el-button>
                    </el-button-group>
                </el-form>

                <el-button type="info" @click="genererPari" style="margin-top: 10px">
                    Générer des paris
                </el-button>
            </el-col>

            <el-col :span="12" :offset="2">
                <p>Liste des paris :</p>

                <p v-if="paris.length === 0">Aucun pari</p>

                <section class="paris">
                    <Pari
                        v-for="pari in paris"
                        :key="pari.id"
                        :pari="pari"
                        :username="username"
                        @deletePari="supprimerPari($event)"
                    />
                </section>
            </el-col>
        </el-row>

        <el-divider/>

        <b>Course - {{ etatCourse }}</b>

        <el-divider/>

        <HorseRace
            :chevaux="chevaux"
            @update:raceState="majEtatCourse($event)"
            @supprimerParis="supprimerParis"
        />
    </el-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import io from 'socket.io-client';
import { chargerParis, ajouterPari, supprimerPari, supprimerParis, genererPari } from '../api/paris';

const socket = io('localhost:3000');

import HorseRace from '../components/HorseRace.vue';
import Pari from '../components/Pari.vue';

const store = useStore();

const form = reactive({ cheval: null });

const username = computed(() => store.getters.username);

const paris = ref([]);
const chevaux = ref([
    { value: 1, text: 'Derdas', position: 0, color: 'CadetBlue' },
    { value: 2, text: 'Man Or', position: 0, color: 'CornflowerBlue' },
    { value: 3, text: 'Mirage Hero', position: 0, color: 'Coral' },
    { value: 4, text: 'Light The Fuse', position: 0, color: 'DarkRed' },
    { value: 5, text: 'Bentley Mood', position: 0, color: 'GoldenRod' },
    { value: 6, text: 'Crew Dragon', position: 0, color: 'Khaki' },
    { value: 7, text: 'Calypso Rose', position: 0, color: 'MediumBlue' },
    { value: 8, text: 'Gavotte', position: 0, color: 'Purple' },
    { value: 9, text: 'Missy Perfect', position: 0, color: 'SeaGreen' },
    { value: 10, text: 'Redhead Lady', position: 0, color: 'SteelBlue' },
]);
const etatCourse = computed(() => store.getters.etat);

const onReset = () => {
    form.cheval = null;
};

const majEtatCourse = event => {
    const { etat, chevalGagnant } = store.getters;

    etatCourse.value = etat;

    if (etat === 'Terminée') {
        paris.value = paris.value.map(pari => ({
            ...pari,
            gagne: pari.cheval === chevalGagnant,
        }));
    }
};

onMounted(async () => {
  paris.value = await chargerParis();
  socket.on('PARI_ADDED', data => {
    paris.value.push(data);
  });
  
  socket.on('PARIS_ADDED', async () => {
    paris.value = await chargerParis();
  });

  socket.on('PARI_DELETED', data => {
    paris.value = paris.value.filter(p => p.id != data);
  });

  socket.on('PARIS_DELETED', async () => {
    paris.value = [];
  });
});
</script>

<style scoped>
.paris {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
