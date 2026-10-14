import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

test('serves the complete public project and denies private paths and writes', async () => {
  const child = spawn(process.execPath, ['server.mjs'], { cwd: import.meta.dirname, env: { ...process.env, PORT: '0' }, windowsHide: true });
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server startup timed out')), 5000);
      child.once('exit', code => { clearTimeout(timer); reject(new Error('Unexpected server exit ' + code)); });
      child.stdout.on('data', chunk => { const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timer); resolve(match[0]); } });
    });
    const files = JSON.parse(await readFile(new URL('./public-files.json', import.meta.url)));
    for (const file of files) {
      const response = await fetch(url + '/' + file);
      assert.equal(response.status, 200, file);
      assert.ok((await response.arrayBuffer()).byteLength > 0, file);
    }
    for (const file of ['/server.mjs', '/package.json', '/public-files.json', '/.git/config', '/.env', '/.lyre/development.json', '/assets/%2e%2e%2f..%2fserver.mjs', '/%00']) assert.equal((await fetch(url + file)).status, 404, file);
    assert.equal((await fetch(url, { method: 'POST' })).status, 404);
    assert.equal(await (await fetch(url, { method: 'HEAD' })).text(), '');
  } finally { child.kill(); }
});
