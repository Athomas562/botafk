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

function startBot() {
  console.log("Création du bot...");

  bot = mineflayer.createBot({
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

    // Nettoyage des anciens intervals (IMPORTANT)
    if (jumpInterval) clearInterval(jumpInterval);
    if (moveInterval) clearInterval(moveInterval);

    // Anti-AFK jump
    jumpInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState("jump", true);
      setTimeout(() => {
        if (bot) bot.setControlState("jump", false);
      }, 500);
    }, 30000);

    // Petit mouvement
    moveInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.setControlState("forward", true);
      setTimeout(() => {
        if (bot) bot.setControlState("forward", false);
      }, 2000);
    }, 60000);
  });

  bot.on("end", () => {
    console.log("Déconnecté");

    // Nettoyage propre (évite memory leak)
    try {
      if (jumpInterval) clearInterval(jumpInterval);
      if (moveInterval) clearInterval(moveInterval);

      if (bot) {
        bot.removeAllListeners();
        bot = null;
      }
    } catch (e) {
      console.log("Cleanup error:", e.message);
    }

    setTimeout(startBot, 60000);
  });

  bot.on("kicked", (reason) => {
    console.log("Kick:", reason);
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
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
