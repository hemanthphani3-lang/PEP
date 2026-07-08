const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\heman\\.gemini\\antigravity\\brain\\5dc99e5e-b391-494f-a8fa-205654bcfb50\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const userMessages = [];

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        userMessages.push(obj.content);
      }
    } catch (e) {}
  }

  console.log(userMessages.slice(-15).join('\n---\n'));
}

processLineByLine();
