<template>
  <div class="home">
    <img alt="Madx logo" src="../assets/logo.png">
    <h5>Words</h5>
    <InputText v-model="words" type="text" />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue } from 'vue-property-decorator'

export default class Home extends Vue {
  words: string = "Hello"
}
</script>
