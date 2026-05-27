const mineflayer = require("mineflayer");

function startBot() {
  const bot = mineflayer.createBot({
    host: "heilsynth666-43Se.aternos.me",
    port: 63545,
    username: "BotAFK",
    version: false,
    version: '1.19.2'
  });

  bot.on("login", () => {
    console.log("Connecté !");
  });

  bot.on("spawn", () => {
    console.log("Spawn OK");

    setInterval(() => {
      bot.swingArm();
    }, 30000);
  });

  bot.on("kicked", (reason) => {
    console.log("Kick:", reason);
  });

  bot.on("error", (err) => {
    console.log("Erreur:", err.message);
  });

  bot.on("end", () => {
    console.log("Reconnecte dans 10 sec...");
    setTimeout(startBot, 10000);
  });
}

startBot();
