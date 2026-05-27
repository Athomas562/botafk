const http = require("http");
const mineflayer = require("mineflayer");

/* ========= SERVEUR WEB POUR RENDER ========= */

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot actif");
  })
  .listen(process.env.PORT || 3000, () => {
    console.log("Serveur web actif");
  });

/* ========= BOT MINECRAFT ========= */

function createBot() {
  const bot = mineflayer.createBot({
    host: "heilsynth666-43Se.aternos.me",
    port: 63545,
    username: "BotAFK",
    version: "1.19.2",
    checkTimeoutInterval: 50 * 1000,
  });

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

  bot.on("kicked", (reason) => {
    console.log("Kick:", reason);
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
  });

  bot.on("end", () => {
    console.log("Reconnecte dans 60 sec...");
    setTimeout(createBot, 60000);
  });
}

createBot();
