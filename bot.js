const express = require("express");
const mineflayer = require("mineflayer");

const app = express();

/* ===== SERVEUR WEB ===== */

app.get("/", (req, res) => {
  res.status(200).send("Bot online");
});

app.head("/", (req, res) => {
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur web actif sur ${PORT}`);
});

/* ===== BOT ===== */

function startBot() {
  console.log("Création du bot...");

  const bot = mineflayer.createBot({
    host: "arasaka.aternos.me",
    port: 50044,
    username: "BotAFK",
    version: "1.20.1",
    checkTimeoutInterval: 50 * 1000,
  });

  bot.on("login", () => {
    console.log("Connecté !");
  });

  bot.on("spawn", () => {
    console.log("Spawn OK");

    // Anti AFK
    setInterval(() => {
      bot.setControlState("jump", true);

      setTimeout(() => {
        bot.setControlState("jump", false);
      }, 500);
    }, 30000);

    // Petit mouvement
    setInterval(() => {
      bot.setControlState("forward", true);

      setTimeout(() => {
        bot.setControlState("forward", false);
      }, 2000);
    }, 60000);
  });

  bot.on("end", () => {
    console.log("Déconnecté");

    setTimeout(() => {
      startBot();
    }, 60000);
  });

  bot.on("kicked", (reason) => {
    console.log("Kick:", reason);
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
  });
}

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

startBot();
