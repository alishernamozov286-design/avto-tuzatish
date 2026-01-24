const https = require('https');

const CAR_BOT_TOKEN = '8175946564:AAHhqrQyIf6A76CYfB6QZtX3UlCt1DdV_L8';
const DEBT_BOT_TOKEN = '8555536634:AAGCnx2bU40IdPQIrFDBakLq78o9adpENN4';

function clearBot(token, name) {
  // Delete webhook
  https.get(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`${name} webhook cleared:`, data);
      
      // Get updates to clear pending
      https.get(`https://api.telegram.org/bot${token}/getUpdates?offset=-1`, (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => { data2 += chunk; });
        res2.on('end', () => {
          console.log(`${name} updates cleared:`, data2);
        });
      });
    });
  });
}

console.log('Clearing Telegram bot sessions...');
clearBot(CAR_BOT_TOKEN, 'Car Bot');
clearBot(DEBT_BOT_TOKEN, 'Debt Bot');

setTimeout(() => {
  console.log('\n✅ Done! Wait 10 seconds and restart your backend.');
}, 3000);
