<template>
  <div id="app">
    <div id="nav">
      <router-link to="/transactions">Transactions</router-link> 
      |
      <router-link to="/notifications">Notifications</router-link> 
      |
      <router-link to="/filters">Filters</router-link>
      |
      <router-link to="/transaction/">Transaction</router-link>
      |
      <router-link to="/blocks">Blocks</router-link>
    </div>

    <router-view v-bind:shared="shared" />
    
  </div>
</template>


<script lang="ts">

import Vue from 'vue'
import { getSharedState, SharedState } from '@/ui-lib/shared';

export default Vue.extend({

  data: () => ({
    shared: getSharedState()
  }),

  created() {
    //this.shared = getSharedState(this.$router);
  }
})

</script>
