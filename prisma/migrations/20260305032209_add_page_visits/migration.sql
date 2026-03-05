-- CreateTable
CREATE TABLE "page_visits" (
    "id" UUID NOT NULL,
    "page" VARCHAR NOT NULL,
    "referrer" VARCHAR,
    "user_agent" TEXT,
    "ip" VARCHAR,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_visits_page_idx" ON "page_visits"("page");

-- CreateIndex
CREATE INDEX "page_visits_visited_at_idx" ON "page_visits"("visited_at");
