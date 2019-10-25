<template>
  <div style="margin: 1em;">
    <simple-filter-editor style="max-width: 50em;" :shared=shared></simple-filter-editor>
  
    <div class="arweave-transactions-filters">
      <div> Configured Filters </div>
      <div>
        <div class="arweave-transactions-display-filter" v-for="(filter, idx) in shared.userFilters.filters" :key=idx>
          <label> {{ filter.filterName }} </label>
          <button @click="removeFilter(idx)">Delete</button>
        </div>
        <div v-if="shared.userFilters.filters.length === 0"> 
          <div> No filters configured. </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SharedState } from '@/ui-lib/shared';

export default Vue.extend({

  props: {
    shared: {
      type: Object as () => SharedState,
      required: true
    } 
  },
  
  data: () => ({
    filters: [] as any[]
  }),

  methods: {
    removeFilter(idx: string | number) {
      idx = parseInt(idx.toString());
      if (confirm(`Delete Filter: ${this.shared.userFilters.filters[idx].filterName}?`)) {
        this.shared.userFilters.removeFilter(idx);
      }
    }
  }

})
</script>
