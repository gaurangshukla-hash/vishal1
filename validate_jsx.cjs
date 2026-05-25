const fs = require('fs');
const content = fs.readFileSync('src/components/EnterpriseForms.tsx', 'utf8');

const startStr = "const renderTrunkForm = (trunkType: 'Customer' | 'Vendor') => {";
const endStr = "const renderSendRateForm = () => (";
const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

const segment = content.substring(startIdx, endIdx);
const lines = segment.split('\n');
let depth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div(?![^>]*\/>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    if (opens > 0 || closes > 0) {
        depth += opens - closes;
        console.log(`L${i + 1243}: D${depth} | ${line.trim().substring(0, 40)}`);
    }
}
