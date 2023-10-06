<template>
  <el-container direction="vertical">
    <el-row>
      <el-col :span="8">
        <el-form @submit.prevent="ajouterPari" @reset.prevent="onReset">

          <el-form-item label="Vous pariez sur :">
            <el-select v-model="form.cheval" id="cheval" placeholder="Sélectionnez votre cheval">
              <el-option v-for="cheval in chevaux" :value="cheval.value" :label="cheval.text" />
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

        <section class="paris">

          <Pari v-for="pari in paris" :key="pari.id" :pari="pari" :username="form.auteur" @deletePari="(id) => supprimerPari(id)" />

        </section>
      </el-col>
    </el-row>

    <el-divider />

    <b>Course - {{ etatCourse }}</b>

    <el-divider />

    <!-- TOCHANGE -->
    <HorseRace :chevaux="chevaux" @update:raceState="majEtatCourse($event)" @delete:paris="supprimerParis()" />
  </el-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

import HorseRace from '../components/HorseRace.vue';
import Pari from '../components/Pari.vue';

const store = useStore();

const username = computed(() => store.getters.username);

const form = reactive({ auteur: username, cheval: null });

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
const etatCourse = ref('En attente Paris');

const chargerParis = async () => {
  try {
    const response = await axios.get('http://localhost:3000/paris');

    paris.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const ajouterPari = async () => {
  if (!form.auteur || !form.cheval) return;

  try {
    await axios.post('http://localhost:3000/paris', {
      auteur: form.auteur,
      cheval: form.cheval,
    });

    chargerParis();
    form.cheval = null;
  } catch (e) {
    console.error(e);
  }
};

const onReset = () => {
  form.cheval = null;
};

const genererPari = async () => {
  try {
    await axios.post(`http://localhost:3000/paris/generate`);

    chargerParis();
  } catch (e) {
    console.error(e);
  }
};

const supprimerPari = async id => {
  try {
    await axios.delete(`http://localhost:3000/paris/${id}`);

    paris.value = paris.value.filter(p => p.id !== id);
  } catch (e) {
    console.error(e);
  }
};

const supprimerParis = async () => {
  try {
    await axios.delete(`http://localhost:3000/paris`);

    paris.value = [];
  } catch (e) {
    console.error(e);
  }
};

const majEtatCourse = event => {
  const { etat, winner } = event;
  etatCourse.value = etat;

  if (etat === 'Terminée') {
    console.log('Gestion des paris');
    paris.value.forEach(pari => {
      pari.gagne = pari.cheval === winner;
    });
  }
};

onMounted(chargerParis);
</script>

<style>
.paris {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
