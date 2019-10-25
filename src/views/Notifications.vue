<template>
   
   <div class="arweave-transactions-filters">
      <div> Notify on: {{ enabledFilters }} </div>
        <div>
        <div class="arweave-transactions-display-filter" v-for="(filter, idx) in shared.userFilters.filters" :key=idx>
          <label> {{ filter.filterName }} </label>
          <input type="checkbox" :checked="shared.userFilters.filters[idx].notify" @click="toggleFilter(idx)"> 
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
  }),

  created() {
    this.tryEnableNotifications();
  },

  methods: {
    toggleFilter(idx: number | string) {
      idx = parseInt(idx.toString());
      this.shared.userFilters.setNotifications(idx, !!!this.shared.userFilters.filters[idx].notify)
      this.tryEnableNotifications();
    },

    tryEnableNotifications() {
      if (this.shared.userFilters.filters.filter(x => x.notify).length && Notification.permission !== 'granted') {
        Notification.requestPermission()
        .then(() => console.log('Permission granted'))
        .catch((e) => console.log(`Permission not granted :(`))
      }
      console.log(`Notifications are: ${Notification.permission}`)
    }
  },
  

  computed: {
    enabledFilters: function(): string {
      const filterNames = this.shared.userFilters.filters.filter(x => x.notify).map(x => x.filterName);
      return filterNames.length ? filterNames.join(', ') : 'None';
    },
  }
  
})

</script>