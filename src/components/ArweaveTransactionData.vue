<template>
  <div>
    
    <tree-view v-if="isValidJson" :data="txDataString"></tree-view>
    
    <div v-else style="font-size: 0.8em;">
      {{ txDataString }}
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Transaction from 'arweave/web/lib/transaction';

export default Vue.extend({
  
  props: {
    tx: {
      type: Object as () => Transaction,
      required: true, 
    }
  },

  data: () => ({
    txDataString: '',
    txDataJson: null as any, 
    isValidJson: false, 
  }),

  created() {
    if (this.tx.data.length > 1024*1024) {
      this.txDataString = "Encoded data is over 1MB. Not displayed";
      return;
    }
    const str = this.tx.get('data', { decode: true, string: true });
    this.txDataString = str; 
    try {
      const parsed = JSON.parse(str);
      this.txDataString = parsed;
      this.isValidJson = true; 
    } catch (e) {
      // dont care. 
    }
  }
})
</script>