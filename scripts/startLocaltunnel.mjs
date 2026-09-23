import localtunnel from 'localtunnel';
import fs from 'fs';

async function main() {
  console.log('🚀 Starting Localtunnel on port 5173...');
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log('==================================================');
    console.log('🎉 LOCALTUNNEL LIVE URL:', tunnel.url);
    console.log('==================================================');
    fs.writeFileSync('localtunnel_url.txt', tunnel.url);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Localtunnel Error:', err);
  }
}

main();
