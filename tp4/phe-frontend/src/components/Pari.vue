<template>
  <el-card body-class="pari">
    <section class="pari-information">
      <el-icon v-if="pari.gagne" color="green" :size="40">
        <GoldMedal />
      </el-icon>

      <article>
        <p class="no-margin-top">
          <el-tag :type="pari.auteur === username ? 'success' : 'info'">{{ pari.auteur }}</el-tag>
          a parié sur le cheval <b>{{ pari.cheval }}</b>
        </p>

        <span class="small">{{ getFormattedDate(pari.date) }}</span>
      </article>
    </section>

    <el-button v-if="pari.auteur === username" type="danger" circle :icon="Delete" @click="$emit('deletePari', pari.id)" />
  </el-card>
</template>

<script setup>
import dayjs from 'dayjs';
import { onMounted } from 'vue';
import { Delete, GoldMedal } from '@element-plus/icons-vue';

const props = defineProps(['pari', 'username']);
const getFormattedDate = date => dayjs(date).format('Le DD/MM/YYYY à HH:mm');

onMounted(() => {});

</script>

<style>
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

.no-margin-top {
  margin-top: 0;
}
</style>