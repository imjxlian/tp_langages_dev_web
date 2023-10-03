<template>
    <el-row>
        <el-col :span="8">
            <el-button-group>
                <el-button native-type="submit" type="success" :disabled="desactiveLancerCouse" @click="lancerCourse">
                    Lancer la course
                </el-button>
                <el-button native-type="submit" type="warning" @click="resetChevaux">
                    Chevaux dans les box
                </el-button>
            </el-button-group>
        </el-col>
        <el-col :span="16">
            <ul>
                <li class="horse-track" v-for="horse in chevaux" :key="horse.value">
                    <article class="box">
                        {{ horse.value }}
                    </article>

                    <article class="track">
                        <img
                            class="horse"
                            src="/horse.png"
                            alt="horse"
                            v-bind:style="{ backgroundColor: horse.color, 'margin-left': horse.position + 'px' }"
                        />
                    </article>

                    <article class="arrivee">A</article>
                </li>
            </ul>
        </el-col>
    </el-row>
</template>

<script setup>
import { onBeforeUnmount, computed, ref } from 'vue';

const emit = defineEmits(['update:raceState']);
const props = defineProps(['chevaux']);

const interval = ref(null);

const desactiveLancerCouse = computed(() => props.chevaux.some(horse => horse.position > 0));

const lancerCourse = () => {
    let endOfRace = false;
    emit('update:raceState', 'En cours');
    interval.value = setInterval(() => {
        props.chevaux.forEach(horse => {
            horse.position = horse.position + Math.floor(Math.random() * 10);
            if (horse.position > 560) {
                endOfRace = true;
            }
        });
        if (endOfRace) {
            clearInterval(interval.value);
            emit('update:raceState', 'Terminée');
        }
    }, 100);
};

const resetChevaux = () => {
    clearInterval(interval.value);
    emit('update:raceState', 'En attente Paris');
    props.chevaux.forEach(c => c.position = 0);
};

onBeforeUnmount(() => clearInterval(interval.value));
</script>


<style scoped>
li {
    border: 1px solid black;
    margin-bottom: 10px;
    list-style: none;
}

.horse-track {
    display: flex;
    align-items: center;
    width: 640px;
}

.box {
    width: 20px;
    border-right: solid 1px grey;
    text-align: center;
}

.track {
    width: 600px;
    display: flex;
    align-items: center;
}

.horse {
    height: 22px;
}

.arrivee {
    width: 20px;
    border-left: solid 1px grey;
    text-align: center;
}
</style>

