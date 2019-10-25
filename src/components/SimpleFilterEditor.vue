<template>
  <div class="simple-filter">
    <h4>Add a new filter</h4>

    <div class="simple-filter-conditions" v-for="(condition, index) in conditions" :key="index">
      <input type=text v-model="condition.tagName" placeholder="Tag">
      <input type=text v-model="condition.tagValue" placeholder="Value">
  
      <select ref="matchTypeSelect" v-model="condition.matchType">
        <option value="partial">Partial</option>
        <option value="exact">Exact</option>
        <option value="regex">RegEx</option>
      </select>

      <button @click="removeCondition(index)">-</button>
    </div>
    <div class="simple-filter-conditions-buttons">
      <button @click="addCondition">Add Condition</button>
    </div>
    
    <div v-if="outputCode" class="simple-filter-output">
      Output code
      <pre v-html=outputCode>
      </pre>
    </div>

    <div v-if="outputCode" class="simple-filter-header">
      <input type=text placeholder="Filter Name" v-model="filterName">
      <button 
          :disabled="filterName.length == 0" 
          v-tooltip="filterName.length ? '' : 'Set a name'"
          @click=saveFilter
        >
        Save this Filter
        </button>
    </div>
    
    <div v-if="!outputCode" class="simple-filter-no-output">
      <p> 
        Set conditions to match tags of a transaction
      </p>
    </div>

  </div>
</template>

<script lang="ts">

import Vue from 'vue'

import { SimpleFilter, FilterCondition, conditionsToJavascript } from '@/ui-lib/filters';
import { encodeTextForHtml } from '@/ui-lib/escape-html';
import { SharedState } from '@/ui-lib/shared';

export default Vue.extend({

  props: {
    shared: {
      type: Object as () => SharedState,
      required: true
    } 
  },
  
  data: () => ({
    filterName: '',
    conditions: [] as FilterCondition[],
  }),

  created() {
    this.conditions.push({
      tagName: '',
      tagValue: '',
      matchType: 'partial',
    })
  },

  methods: {
    addCondition() {
      this.conditions.push({ tagName: '', tagValue: '', matchType: 'partial' })
    },
    removeCondition(idx: number) {
      this.conditions.splice(idx, 1);
    },
    saveFilter() {
      this.shared.userFilters.addFilter({ 
        filterName: this.filterName, 
        conditions:this.conditions, 
        code: conditionsToJavascript(this.conditions),
        notify: false,
        display: false,
      })
      this.$router.push('/');
    }
  },

  computed: {
    outputCode: function(): string {      
      const code = conditionsToJavascript(this.conditions);
      return code;
    }
  }
  
})
</script>