<template>
  <div class="view-transaction">
    
    <div class="view-transaction-txid-jump">
      <label for="txIdInput"> View Tx </label>
      <input ref="txIdInput" type="text" v-model="editingId" v-tooltip="'Enter a Tx id to view'" @focus="$event.target.select()">
      <a :href="`https://arweave.net/${editingId}`" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z" fill="#666"/></svg>
      </a>
    </div>

    <div v-if="!loadingTags && !error">
      <div class="view-transaction-tag" v-for="tag in tags" :key="tag.name"> 
        <div>{{tag.name}}</div> 
        <div v-if="!isTxIdLike(tag.value)">{{tag.value}}</div>
        <div v-else>
          <router-link :to="`/tx/${tag.value}`">{{tag.value}}</router-link>
        </div>
      </div>
    </div>
    
    <div v-if="loadingTags" style="text-align: center; padding: 4em;">
      <loading></loading>
    </div>

    <div v-if="error" style="margin: 3em; padding: 2em; border: 1px dashed rgba(200,0,0,0.3);"> {{ error }} </div> 

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
    editingId: '',
    loadedId: '',
    tags: [] as { name: string, value: string }[],
    loadingTags: false,
    error: '',
    fullTx: null as any, 
  }),

  created() {
    this.editingId = this.id;
    this.loadedId = this.id;
    if (this.isTxIdLike(this.loadedId)) {
      this.loadTx(this.loadedId);
    } else {
      this.error = "Enter a valid transaction Id to view it."
    }
  },

  watch: {
    '$route': function(val: any) {
      // id is a route prop. 
      if (this.loadedId !== this.id) {
        this.editingId = this.id; 
        this.loadedId = this.id;
        this.loadTx(this.loadedId);
      }
    },
    'editingId': function (val: any) {
      if (this.isTxIdLike(this.editingId)) {
        if (this.id !== this.editingId) {
          this.$router.push({ name: 'tx', params: { id: this.editingId }});
        }
      }
    }
  },

  methods: {
    isTxIdLike: function(val: any) {
      return typeof val === 'string' && /^[a-zA-Z0-9_-]{43}/.test(val);
    },
    async loadTx(id: string) {
      this.loadingTags = true;
      this.error = '';
      this.tags = [];
      try {
        console.log(`Getting data for ${id}`);
        

        const tags = await readTxMetadata(id);
        
        tags.sort((a, b) => {
          return a.name.startsWith('block_') ? -1 : 1;
        })
        console.log(tags);
        console.log(`Got ${tags.length} tags for ${this.id}`);
        await this.readTxData(id);
        this.tags = tags; 
        this.loadingTags = false;
      } catch (e) {
        this.loadingTags = false;
        this.error = 'Unable to load TX'; 
        this.fullTx = null;
      }
      
    },

    async readTxData(id: string) {
      console.log(`reading data`);
      const tx = await arweave.transactions.get(id);
      this.fullTx = tx;
    }

  }


})
</script>
