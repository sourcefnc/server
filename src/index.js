import app from './server'; // Import server từ server.js
import { bot1 } from './bot/';    // Import bot từ bot.js

import botService from './service/botService';
// Khởi động server
app.listen(3008, () => {
    console.log('Server is running on http://localhost:3008');
});

// Khởi động bot
bot1.launch().then(() => {
    console.log('Bot is running');
});
