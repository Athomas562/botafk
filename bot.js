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

let bot = null;
let jumpInterval = null;
let moveInterval = null;
let antiAfkInterval = null;

function startBot() {
  console.log("Création du bot...");

  bot = mineflayer.createBot({
    host: "arasaka.aternos.me",
    port: 50044,
    username: "BotAFK",
    version: false, // plus stable que 1.20.1 fixe
  });

  bot.on("login", () => {
    console.log("Connecté !");
  });

  bot.on("spawn", () => {
    console.log("Spawn OK");

    // Nettoyage anti fuite mémoire
    if (jumpInterval) clearInterval(jumpInterval);
    if (moveInterval) clearInterval(moveInterval);
    if (antiAfkInterval) clearInterval(antiAfkInterval);

    // Jump anti-AFK
    jumpInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState("jump", true);
      setTimeout(() => {
        if (bot) bot.setControlState("jump", false);
      }, 500);
    }, 30000);

    // Mouvement
    moveInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState("forward", true);
      setTimeout(() => {
        if (bot) bot.setControlState("forward", false);
      }, 2000);
    }, 60000);

    // Anti timeout serveur (petit signal régulier)
    antiAfkInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      try {
        bot.chat(".");
      } catch (e) {}
    }, 120000);
  });

  bot.on("kicked", (reason) => {
    console.log("KICK:", reason);
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
  });

  bot.on("end", () => {
    console.log("Déconnecté, reconnexion...");

    // Nettoyage propre
    try {
      if (jumpInterval) clearInterval(jumpInterval);
      if (moveInterval) clearInterval(moveInterval);
      if (antiAfkInterval) clearInterval(antiAfkInterval);

      bot.removeAllListeners();
      bot = null;
    } catch (e) {}

    // reconnexion plus rapide et stable
    setTimeout(startBot, 10000);
  });
}

/* ===== PROTECTION CRASH ===== */

process.setMaxListeners(0);

process.on("uncaughtException", (err) => {
  console.log("Crash:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Promise crash:", err);
});

/* ===== START ===== */

startBot();
