<template>
<div class="arweave-block">
  <div class="arweave-block-header" @click="open = !open">
    <div> {{ block.info.height }} </div>
    <div> {{ block.info.indep_hash }} </div>
    <div> {{ block.info.txs.length }} TXs </div>
    <div> {{ (block.info.block_size /  1024 / 1024).toFixed(1) }} MB  </div>
    <vue-moments-ago prefix="" :date="datetime" ></vue-moments-ago> 
  </div>
  <div v-if="open" class="arweave-block-content">
    
    <div v-if="block.transactions.length > 0">
      <div v-for="(transaction, idx) in block.transactions" :key="transaction.id" class="arweave-block-transaction">
        <a :href="`https://arweave.net/${transaction.id}`" target="_blank"> Tx: {{ transaction.id }} </a>
        
         <!-- <v-popover trigger="hover" delay="700"> -->
          <div class="arweave-block-transaction-tags" v-tooltip="{ delay: 350, content: tagsTooltip[idx] }">
            {{ transaction.tags.map(tag => tag.name).slice(0, 8).join(',  ') || 'No Tags' }}
          </div>
        <!-- 
          <template slot="popover">
            <div class="arweave-block-transaction-tags-popover">
              <div v-for="tag in transaction.tags" :key="tag.name"> 
                <div> {{ tag.name }} </div>
                <div> {{ tag.value }} </div>
              </div>
            </div>
          </template>
        </v-popover> -->
      
      </div>
    </div>
    <div v-else>
      No transactions
    </div>

  </div>
</div>  
</template>

<style scoped>
</style>

<script lang="ts">

import Vue from 'vue'

import { SyncedBlock } from 'ar-block-sync';
import VueMomentsAgo from 'vue-moments-ago';


export default Vue.extend({
  
  components: { VueMomentsAgo },

  props: {
    block: {
      type: Object as () => SyncedBlock,
      required: true,
    }
  },
  data: () => ({
    open: true
  }),

  computed: {
    datetime: function(): string {
      return new Date(this.block.info.timestamp * 1000).toISOString();
    },
    tagsTooltip: function(): string[] {

      // html escapee text. NO XSS HERE!
      const encodeText = (str: string) => { let elt = document.createElement('span'); elt.textContent = str; return elt.innerHTML;}

      return this.block.transactions.map(tx => {
        return !tx.tags ? 
          'No tags retrieved' 
          : 
          tx.tags.map(tag => 
            `${encodeText(tag.name)} : ${encodeText(tag.value)}`).join('<br>')
      })
    }
  }, 

  created() {
    
  }


})
</script>