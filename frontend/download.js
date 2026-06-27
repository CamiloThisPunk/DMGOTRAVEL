const https = require('https');
const fs = require('fs');

const url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI2MmE1NmQwNTQxMzQ3MmRhMjFjNzAyYWE5ZGU1YjBmEgsSBxDuv5H2yBwYAZIBIwoKcHJvamVjdF9pZBIVQhMzNjU4NTE2MjYyNjU1MDUyNTQ5&filename=&opi=89354086";

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('landing.html', data);
        console.log('Downloaded landing.html');
    });
}).on('error', err => {
    console.error(err);
});
