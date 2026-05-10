-- AddBotCommands
-- Migration manuelle — à appliquer sur le VPS via `npx prisma migrate deploy`
-- après avoir vérifié que le fichier est bien copié sur le serveur.

CREATE TABLE "bot_commands" (
    "id" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "priceKr" INTEGER NOT NULL DEFAULT 0,
    "botId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_commands_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "bot_commands_botId_commandId_key" ON "bot_commands"("botId", "commandId");

ALTER TABLE "bot_commands" ADD CONSTRAINT "bot_commands_botId_fkey"
    FOREIGN KEY ("botId") REFERENCES "bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
