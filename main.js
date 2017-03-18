const fs = require('fs');
const _ = require('lodash');

const file = require('./schema.json');

const writeEnum = (property) => {
  return property.enum ? property.enum.join(', ') : '';
}

const repeat = (val, n) => val.repeat(n);

const optionalWrite = attr => attr ? attr : '-';

const isRequired = (req, prop) => Array.isArray(req) ? (req.includes(prop) ? 'Y' : 'N') : '?';

const writeProperties = (o, prefix) => {
  const keys = Object.keys(o.properties);

  const output = keys.map(key => {
    let mapped = (
      `
      <tr>
        <td title="${o.properties[key].description}">${prefix}${key}</td>
        <td>${o.properties[key].type}</td>
        <td>${optionalWrite(o.properties[key].minLength)}</td>
        <td>${optionalWrite(o.properties[key].maxLength)}</td>
        <td>${optionalWrite(o.properties[key].pattern)}</td>
        <td>${writeEnum(o.properties[key])}</td>
        <td>${isRequired(o.required, key)}</td>
      </tr>
      `
    );

    if (o.properties[key].properties) {
      mapped += writeProperties(o.properties[key], repeat('&nbsp', 5)).join('\n');
    }

    return mapped;
  });

  return output;
}

const headers = `
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Min Length</th>
    <th>Max Length</th>
    <th>Pattern</th>
    <th>Values</th>
    <th>Required</th>
  </tr>
`;
const rows = writeProperties(file, '').join('\n');

const style = `
<style>
table { border: 1px solid lightgray; border-collapse: collapse; width: 100% }
td, th { border: 1px solid lightgray; padding: 6px; }
tr:nth-child(even) {
    background-color: #eee;
}
</style>
`;

fs.writeFileSync('output.html', style + '<table>' + headers + rows + '</table>');