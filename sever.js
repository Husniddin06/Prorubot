require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// start
app.get("/", (req, res) => {
  res.send("VKMUSICX BOT WORKING 🚀");
});

// webhook
app.post("/webhook", async (req, res) => {
  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    // /start
    if (text === "/start") {
      await sendStart(chatId);
    }
  }

  if (update.message && update.message.web_app_data) {
    const data = JSON.parse(update.message.web_app_data.data);

    if (data.action === "search") {
      await handleSearch(update.message.chat.id, data.query);
    }
  }

  res.sendStatus(200);
});

// start message
async function sendStart(chatId) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: "🎧 VKMUSICX 8D ULTRA\n\nMini Appni oching",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Open Music App",
            web_app: {
              url: WEBAPP_URL
            }
          }
        ]
      ]
    }
  });
}

// search handler
async function handleSearch(chatId, query) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: `🔍 Qidiruv: ${query}\n\nNatijalar tayyorlanmoqda...`
  });

  // example music result
  await axios.post(`${TELEGRAM_API}/sendAudio`, {
    chat_id: chatId,
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: query,
    performer: "VKMUSICX"
  });
}

// set webhook
app.get("/setwebhook", async (req, res) => {
  const url = `${process.env.SERVER_URL}/webhook`;

  const response = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${url}`
  );

  res.send(response.data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
