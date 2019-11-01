

const DEFAULT_FILTERS = [{"filterName":"PDF Files","conditions":[{"tagName":"content-type","tagValue":"application/pdf","matchType":"partial"}],"code":"const cond0 = (tags) => (\n  tags.find(t => t.name.toLowerCase() === 'content-type' && t.value.toLowerCase().indexOf('application/pdf') !== -1)\n);\n\nreturn cond0(tags);","notify":false,"display":false},{"filterName":"Arweave Deploy","conditions":[{"tagName":"user-agent","tagValue":"ArweaveDeploy","matchType":"partial"}],"code":"const cond0 = (tags) => (\n  tags.find(t => t.name.toLowerCase() === 'user-agent' && t.value.toLowerCase().indexOf('arweavedeploy') !== -1)\n);\n\nreturn cond0(tags);","notify":true,"display":false},{"filterName":"Chrome Extension","conditions":[{"tagName":"user-agent","tagValue":"arweavechrome","matchType":"partial"}],"code":"const cond0 = (tags) => (\n  tags.find(t => t.name.toLowerCase() === 'user-agent' && t.value.toLowerCase().indexOf('arweavechrome') !== -1)\n);\n\nreturn cond0(tags);","notify":false,"display":false},{"filterName":"Firefox Extension","conditions":[{"tagName":"user-agent","tagValue":"arweavefirefox","matchType":"partial"}],"code":"const cond0 = (tags) => (\n  tags.find(t => t.name.toLowerCase() === 'user-agent' && t.value.toLowerCase().indexOf('arweavefirefox') !== -1)\n);\n\nreturn cond0(tags);","notify":false,"display":false},{"filterName":"Arweave Path Manifest","conditions":[{"tagName":"content-type","tagValue":"application/x.arweave-manifest+json","matchType":"exact"}],"code":"const cond0 = (tags) => (\n  tags.find(t => t.name.toLowerCase() === 'content-type' && t.value.toLowerCase() === 'application/x.arweave-manifest+json')\n);\n\nreturn cond0(tags);","notify":false,"display":false}]

/**
 * Matches a single tag. 
 */
export interface FilterCondition {
  tagName: string
  tagValue: string
  matchType: 'exact' | 'partial' | 'regex'
}

/**
 * SimpleFilter
 */
export interface SimpleFilter {
  notify: boolean 
  display: boolean 
  filterName: string 
  conditions: FilterCondition[],
  code: string 
  matches: (tags: any[]) => boolean;
}

/**
 * Converts a list of conditions to a text for a javascript function. 
 * Only ANDs conditions. 
 * 
 * @param conditions 
 */
export function conditionsToJavascript(conditions: FilterCondition[]): string {

  const matchFns = [] as { name: string, code: string }[];

  conditions.forEach((condition, idx) => {

    const name = `cond${idx}`;
    const tn = condition.tagName.toLowerCase();
    const tv = condition.tagValue.toLowerCase();
    
    if (!tn.length || !tv.length) {
      return;
    }

    if (condition.matchType === 'partial') {
      matchFns.push({ 
        name, 
        code: `const ${name} = (tags) => (\n  tags.find(t => t.name.toLowerCase() === '${tn}' && t.value.toLowerCase().indexOf('${tv}') !== -1)\n);`
      });
    }

    if (condition.matchType === 'exact') {
      matchFns.push({
        name,
        code: `const ${name} = (tags) => (\n  tags.find(t => t.name.toLowerCase() === '${tn}' && t.value.toLowerCase() === '${tv}')\n);`
      });
    }

    if (condition.matchType === 'regex') {
      const regexName  = `${name}_regex`;
      matchFns.push({
        name, 
        code: `const ${regexName} = ${tv};\nconst ${name} = (tags) => (\n  tags.find(t => t.name.toLowerCase() === '${tn}' && ${regexName}.test(t.value))\n);`
      });
    }
  })
  
  
  const fns = matchFns.map(x => x.code).join('\n\n');
  if (!matchFns.length) {
    return '';
  }
  const andExpr = matchFns.map(x => `${x.name}(tags)`).join(' && ');
  const code = `${fns}\n\nreturn ${andExpr};`;
  return code;
}


export class UserFilters {

  filters: SimpleFilter[];
  
  constructor() {
    this.filters = this.loadFilters();
    console.log(`UserFilters loaded with ${this.filters.length}\n${this.filters.map(f => f.filterName).join(',')}`);
  }

  public addFilter(filter: Omit<SimpleFilter, 'matches'>) {
    const matches = new Function('tags', filter.code);
    this.filters.push(Object.assign({}, filter, { notify: false, display: false, matches: matches as any })); 
    this.saveFilters();
  }

  public removeFilter(filter: SimpleFilter | number) {
    const idx = typeof filter === 'number' ? filter : this.filters.indexOf(filter);
    if (idx !== -1) {
      this.filters.splice(idx, 1);
    }
    this.saveFilters();
  }

  /**
   * Checks a tx and returns the index of first filter it matches. 
   * Only checks filters that are enabled for notifications.
   * @param tags 
   */
  public checkTxNotification(tx: { tags: any[] | null | undefined }) {
    if (!tx.tags) {
      return; 
    }
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].notify) {
        if (this.filters[i].matches(tx.tags)) {
          return i;
        }
      }
    }
    return; 
  }

  /**
   * Checks a tx and returns the index of first filter it matches. 
   * Only checks filters that are enabled for display.
   * @param tags 
   */
  public checkTxDisplay(tx: { tags: any[] | null | undefined }) {
    if (!tx.tags) {
      return; 
    }
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].display) {
        if (this.filters[i].matches(tx.tags)) {
          return i;
        }
      }
    }
    return; 
  }

  public setNotifications(idx: number, val: boolean) {
    this.filters[idx].notify = val;
    this.saveFilters();
  }

  public setDisplay(idx: number, val: boolean) {
    this.filters[idx].display = val;
    this.saveFilters();
  }

  private saveFilters(): void {
    localStorage.setItem('savedFilters', JSON.stringify(this.filters));
  }

  private loadFilters(): SimpleFilter[] {
    try {
      const serialized = localStorage.getItem('savedFilters');
      let loaded = (serialized ? JSON.parse(serialized) : []) as SimpleFilter[];
      if (loaded.length == 0) {
        loaded = DEFAULT_FILTERS as SimpleFilter[];
      }
      loaded.forEach(l => {
        l.matches = new Function('tags', l.code) as any;
      })
      return loaded;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}