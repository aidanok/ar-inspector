<template>
  <div>
    
    <div class="arweave-transactions-filters">
      <div> Display: {{ enabledFilters }} </div>
        <div>
        <div class="arweave-transactions-display-filter" v-for="(filter, idx) in shared.userFilters.filters" :key=idx>
          <label> {{ filter.filterName }} </label>
          <input type="checkbox" :checked="shared.userFilters.filters[idx].display" @click="toggleFilter(idx)"> 
        </div>
      </div> 
    </div>
    
    <div v-if="allTransactions.length > 0" class="arweave-transactions-list">
      <transition-group name="list-complete" tag="div"> 
     
        <arweave-transaction class="list-complete-item" v-for="(tx) in transactions" :key=tx.id :transaction=tx>
        </arweave-transaction>
      
      </transition-group>
    </div>
    
    <div v-if="allTransactions.length == 0" style="text-align: center; padding: 4em;">
      <loading></loading>
    </div>

  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SharedState } from '@/ui-lib/shared';
import { BlockTransaction } from 'ar-block-sync/dist-types/types';

export default Vue.extend({

  props: {
    shared: {
      type: Object as () => SharedState,
      required: true
    } 
  },

  created() {
    this.sub = this.shared.transactions.subscribe(x => this.allTransactions = x);
  },

  beforeDestroy() {
    this.sub.unsubscribe();
  },

  data: () => ({
    allTransactions: [] as BlockTransaction[],
    sub: null as any
  }),

  methods: {
    toggleFilter(idx: number | string) {
      idx = parseInt(idx.toString());
      this.shared.userFilters.setDisplay(idx, !this.shared.userFilters.filters[idx].display)
    }
  },
  

  computed: {

    hasFilters: function(): boolean {
      return this.shared.userFilters.filters.filter(x => x.display).length > 0
    },

    enabledFilters: function(): string {
      const filterNames = this.shared.userFilters.filters.filter(x => x.display).map(x => x.filterName);
      return filterNames.length ? 
      `${filterNames.join(', ')} (Matches ${this.matchedCount} of ${this.allTransactions.length} TXs)` 
      : 
      `All (${this.transactions.length} TXs)`;
    },
    transactions: function(): BlockTransaction[] {
      const rev = this.allTransactions.slice().reverse();
      if (!this.hasFilters) {
        return rev;
      }
      else {
        return rev.filter(t => this.shared.userFilters.checkTxDisplay(t) !== undefined);
      }
    },
    matchedCount: function(): number {
      return this.transactionMatched.filter(x => x == true).length;
    },
    transactionMatched: function(): boolean[] {
      if (this.shared.userFilters.filters.filter(x => !!x.display).length === 0) {
        return this.transactions.map(x => true);
      }
      return this.transactions.map((tx,idx) => {
        if (!tx.tags) {
          return false;
        }
        for (let i = 0; i < this.shared.userFilters.filters.length; i++) {
          if (!this.shared.userFilters.filters[i].display) {
            continue;
          }
          if (this.shared.userFilters.filters[i].matches(tx.tags!)) {
            return true; 
          }
        }
        return false;
      })
    }
  }

})
</script>