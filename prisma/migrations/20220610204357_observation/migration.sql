-- CreateTable
CREATE TABLE "Observation" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "tempAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tempMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tempMax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TEXT NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);
