require('dotenv').config();
const https = require('https');

const carToken = process.env.TELEGRAM_BOT_TOKEN_CAR;
const debtToken = process.env.TELEGRAM_BOT_TOKEN_DEBT;

async function clearWebhook(token, botName) {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const result = JSON.parse(data);
        if (result.ok) {
          console.log(`✅ ${botName} webhook cleared successfully`);
          resolve(result);
        } else {
          console.error(`❌ ${botName} webhook clear failed:`, result);
          reject(result);
        }
      });
    }).on('error', (err) => {
      console.error(`❌ ${botName} error:`, err);
      reject(err);
    });
  });
}

async function main() {
  console.log('🧹 Clearing all Telegram webhooks...\n');

  if (carToken) {
    await clearWebhook(carToken, 'Car Bot');
  }

  if (debtToken) {
    await clearWebhook(debtToken, 'Debt Bot');
  }

  console.log('\n✅ All webhooks cleared! Now you can restart your server.');
}

main().catch(console.error);
