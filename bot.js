const http = require("http");
const mineflayer = require("mineflayer");

/* ===== SERVEUR WEB ===== */

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot actif");
  })
  .listen(process.env.PORT || 3000, () => {
    console.log("Serveur web actif");
  });

/* ===== BOT ===== */

function startBot() {
  console.log("Création du bot...");

  const bot = mineflayer.createBot({
    host: "arasaka.aternos.me",
    port: 50044,
    username: "BotAFK",
    version: "1.19.2",
    checkTimeoutInterval: 50 * 1000,
  });

  /* ===== CONNEXION ===== */

  bot.on("login", () => {
    console.log("Connecté !");
  });

  bot.on("spawn", () => {
    console.log("Spawn OK");

    /* ===== ANTI AFK ===== */

    setInterval(() => {
      bot.setControlState("jump", true);

      setTimeout(() => {
        bot.setControlState("jump", false);
      }, 500);
    }, 30000);

    /* ===== PETIT MOUVEMENT ===== */

    setInterval(() => {
      bot.setControlState("forward", true);

      setTimeout(() => {
        bot.setControlState("forward", false);
      }, 2000);
    }, 60000);
  });

  /* ===== RECONNEXION ===== */

  bot.on("end", () => {
    console.log("Déconnecté");
    reconnect();
  });

  bot.on("kicked", (reason) => {
    console.log("Kick:", reason);
    reconnect();
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
  });

  function reconnect() {
    console.log("Reconnecte dans 60 secondes...");

    setTimeout(() => {
      startBot();
    }, 60000);
  }
}

startBot();
