<template>
  <div>  
    <div class="block-watcher-sync-info">
      <div> {{ synced }} blocks synced in last poll </div>       
      <p> 
        Last poll: Did we miss blocks? {{ missed ? 'Yes' : 'No' }}, See a Re-org: {{ reorg ? 'Yes' : 'No' }} 
      </p>
    </div>
     
     <transition-group name="bounce" tag="div"> 
        <arweave-block
          v-for="b in blockList"  v-bind:key="b.info.indep_hash"  
          class="bounce-item" 
          :block="b"
          >
        </arweave-block>
     </transition-group>

  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SharedState } from '@/ui-lib/shared';
import { SyncedBlock, SyncResult } from 'ar-block-sync';

export default Vue.extend({

  props: {
    shared: {
      type: Object as () => SharedState,
      required: true
    }
  },
  
  data: () => ({
    list: [] as SyncedBlock[],
    missed: false,
    reorg: false,
    synced: 0,
    discarded: [] as SyncedBlock[],
    dispose: null as any, 
  }),
  
  created() {
    this.dispose = this.shared.blocks.subscribe(this.handleSync);
  },

  beforeDestroy() {
    this.dispose.unsubscribe();
  },

  methods: {
    handleSync(sync: SyncResult) {
      console.log(sync);
      Object.assign(
        this, 
        sync, 
        { list: sync.list.slice().reverse() }
      );
    },
  },

  computed: {
    blockList: function(): SyncedBlock[] {
      return this.list;
    }
  }

})
</script>