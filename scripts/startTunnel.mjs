import { startTunnel } from 'untun';
import fs from 'fs';

async function main() {
  console.log('🚀 Starting Cloudflare Quick Tunnel on port 5173...');
  try {
    const tunnel = await startTunnel({
      port: 5173,
      acceptCloudflareNotice: true,
    });
    const url = await tunnel.getURL();
    console.log('==================================================');
    console.log('🎉 LIVE PUBLIC TUNNEL URL:', url);
    console.log('==================================================');
    fs.writeFileSync('public_tunnel_url.txt', url);
  } catch (err) {
    console.error('Error starting tunnel:', err);
  }
}

main();
