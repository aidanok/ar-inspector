<template>
  <div>
    
    <div v-if="isValidJson" style="padding: 1em;">
      <json-tree :raw="txDataString"></json-tree>
    </div>

    <div v-else style="padding: 1em; font-size: 0.8em;">
      {{ txDataString }}
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Transaction from 'arweave/web/lib/transaction';
import JsonTree from 'vue-json-tree';
 
export default Vue.extend({
  
  components: { JsonTree },

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
    if (this.tx.data.length > 1024*512) {
      this.txDataString = "Encoded data is over 512kb. Not displayed";
      return;
    }
    const str = this.tx.get('data', { decode: true, string: true });
    this.txDataString = str; 
    try {
      const parsed = JSON.parse(str);
      //this.txDataString = parsed;
      this.isValidJson = true;
    } catch (e) {
      // dont care. 
    }
  }
})
</script>