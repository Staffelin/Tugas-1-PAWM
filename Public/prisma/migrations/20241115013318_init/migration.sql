-- CreateTable
CREATE TABLE "UserState" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "progress" TEXT,
    "results" TEXT,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserState_userId_key" ON "UserState"("userId");
