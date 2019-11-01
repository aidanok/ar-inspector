<template>
  <div class="view-transaction">
    
    <div class="view-transaction-txid-jump">
      <label for="txIdInput"> View Tx </label>
      <input ref="txIdInput" type="text" v-model="txId" v-tooltip="'Enter a Tx id to view'">
      <a :href="`https://arweave.net/${txId}`" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z" fill="#666"/></svg>
      </a>
    </div>

    <div v-if="!loadingTags">
      <div class="view-transaction-tag" v-for="tag in tags" :key="tag.name"> 
        <div>{{tag.name}}</div><div>{{tag.value}}</div>
      </div>
    </div>
    
    <div v-if="loadingTags" style="text-align: center; padding: 4em;">
      <loading></loading>
    </div>

    <div class="view-transaction-raw-data" v-if="fullTx && !loadingTags">
      <h6> Raw Transaction data </h6>
      <arweave-transaction-data :tx=fullTx></arweave-transaction-data>
    </div>

  </div>
</template>


<script lang="ts">

import Vue from 'vue'

import { readTxMetadata, arweave } from '@/ui-lib/read-tx';

export default Vue.extend({
  
  props: {
    id: {
      type: String, 
      default: '',
    }
  },

  data: () =>({
    txId: '',
    tags: [] as { name: string, value: string }[],
    loadingTags: false,
    fullTx: null as any, 
  }),

  created() {
    this.txId = this.id;
  },

  watch: {
    '$route': function(val: any) {
      this.txId = this.id;
    },
    'txId': function (val: any) {
      if (this.txId.length === 43) {
        this.loadTx(this.txId);
      }
    }
  },

  methods: {
    async loadTx(id: string) {
      this.loadingTags = true;
      console.log(`Getting data for ${id}`);
      
      this.readTxData(id);

      const tags = await readTxMetadata(id);
      
      tags.sort((a, b) => {
        return a.name.startsWith('block_') ? -1 : 1;
      })
      console.log(tags);
      console.log(`Got ${tags.length} tags for ${this.id}`);
      this.tags = tags; 
      this.loadingTags = false;
      this.readTxData(id);
    },

    async readTxData(id: string) {
      console.log(`reading data`);
      const tx = await arweave.transactions.get(id);
      this.fullTx = tx;
    }

  }


})
</script>
