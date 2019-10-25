

export const encodeTextForHtml = (str: string) => { let elt = document.createElement('span'); elt.textContent = str; return elt.innerHTML;}
