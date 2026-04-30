-- CreateTable
CREATE TABLE "research_papers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "authors" TEXT[],
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "keywords" TEXT[],
    "citationsCount" INTEGER NOT NULL DEFAULT 0,
    "language" VARCHAR(5) NOT NULL DEFAULT 'en',
    "journal" TEXT NOT NULL,
    "doi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_papers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "research_papers_doi_key" ON "research_papers"("doi");

-- CreateIndex
CREATE INDEX "research_papers_category_idx" ON "research_papers"("category");

-- CreateIndex
CREATE INDEX "research_papers_language_idx" ON "research_papers"("language");

-- CreateIndex
CREATE INDEX "research_papers_citationsCount_idx" ON "research_papers"("citationsCount");
