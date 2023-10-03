<template>
  <el-header>
    <el-menu mode="horizontal">
      <el-menu-item index="0"><b>Paris Hippiques Étudiants</b></el-menu-item>
    </el-menu>
  </el-header>

  <el-main>
    <el-row>
      <el-col :span="8">
        <el-form @submit="ajouterPari" @reset="onReset" :model="form">
          <el-form-item label="Votre nom :">
            <el-input id="auteur" v-model="form.auteur" />
          </el-form-item>

          <el-form-item label="Vous pariez sur :">
            <el-select id="cheval" placeholder="Sélectionnez votre cheval" v-model="form.cheval">
              <el-option v-for="cheval in chevaux" :value="cheval.value" :label="cheval.text" />
            </el-select>
          </el-form-item>

          <el-button-group>
            <el-button native-type="submit" type="primary">Parier</el-button>
            <el-button native-type="reset" type="danger">Reset</el-button>
          </el-button-group>
        </el-form>

        <el-button type="info" style="margin-top: 10px" @click="genererPari">
          Générer des paris
        </el-button>
      </el-col>

      <el-col :span="12" :offset="2">
        <p>Liste des paris :</p>

        <section class="paris">
          <el-card body-class="pari" v-for="pari in paris" :key="pari.rowid">
            <section class="pari-information">
              <p class="no-margin">
                <el-tag type="success" v-if="pari.auteur == form.auteur">{{ pari.auteur }}</el-tag>
                <el-tag type="info" v-else>{{ pari.auteur }}</el-tag>
                a parié sur le cheval <b>{{ pari.cheval }}</b>
              </p>


              <span class="small">{{ formatDate(pari.date) }}</span>
            </section>

            <el-icon v-if="pari.auteur == form.auteur" color="#FF0000" @click="supprimerPari(pari.id)">
              <Delete />
            </el-icon>
          </el-card>
        </section>
      </el-col>
    </el-row>

    <el-divider />

    <b>Course - {{ etatCourse }}</b>

    <el-divider />

    <ChevalRace :chevaux="chevaux" @update:raceState="majEtatCourse($event)" />

  </el-main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';

import ChevalRace from './components/HorseRace.vue';

const form = reactive({
  auteur: '',
  cheval: null,
});

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

const API_URL = 'http://localhost:3000';

const chargerParis = async () => {
  const url = API_URL + '/paris';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      paris.value = data;
    });
};

const ajouterPari = async e => {
  // Prevent default behavior of the form
  e.preventDefault();

  const url = API_URL + '/paris';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (response.ok) {
    console.log('Pari ajouté');
  } else {
    console.log('Erreur lors de l\'ajout du pari');
  }

  chargerParis();
};

const onReset = () => {
  console.log('Reset du formulaire');
};

const genererPari = async () => {
  const url = API_URL + '/paris/generate';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.log('Pari généré');
  } else {
    console.log('Erreur lors de la génération du pari');
  }

  chargerParis();
};

const supprimerPari = async id => {
  console.log('Suppression du pari', id);
  const url = API_URL + '/paris/' + id;

  await fetch(url, {
    method: 'DELETE',
  });

  paris.value = paris.value.filter(pari => pari.id !== id);
};

const majEtatCourse = event => {
  etatCourse.value = event;
  if (etatCourse.value === 'Terminée') {
    console.log('Gestion des paris');
  }
};

const formatDate = date => {
  return dayjs(date).format('Le DD/MM/YYYY à HH:mm');
};

onMounted(() => {
  chargerParis();
});
</script>

<style>
.paris {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pari {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.pari-information {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-margin {
  margin: 0;
}
</style>
