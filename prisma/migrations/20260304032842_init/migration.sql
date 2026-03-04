-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "slug" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "highlights" TEXT[],
    "tech_stack" TEXT[],
    "category" VARCHAR,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "github_url" VARCHAR,
    "live_url" VARCHAR,
    "npm_url" VARCHAR,
    "order_index" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
