-- CreateTable
CREATE TABLE "analyzed_comments" (
    "id_comment" BIGINT NOT NULL,
    "metadata" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyzed_comments_pkey" PRIMARY KEY ("id_comment")
);

-- CreateTable
CREATE TABLE "extracted_comments" (
    "id_comment" BIGSERIAL NOT NULL,
    "user_comment" VARCHAR(255),
    "comment" TEXT,
    "date" TIMESTAMPTZ(6),
    "metadata" JSON,
    "search_post_source_id" TEXT NOT NULL,

    CONSTRAINT "extracted_comments_pkey" PRIMARY KEY ("id_comment")
);

-- CreateTable
CREATE TABLE "extraction_jobs" (
    "id" TEXT NOT NULL,
    "search_post_source_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "export_guid" TEXT,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "extraction_metadata" JSONB,

    CONSTRAINT "extraction_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_detail" (
    "id_detail" VARCHAR(255) NOT NULL,
    "id_job" VARCHAR(255) NOT NULL,
    "kw_main" VARCHAR(255) NOT NULL,
    "meta_data" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kw_type" VARCHAR(255),
    "search_type" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kw_secondary" TEXT[],

    CONSTRAINT "search_detail_pkey" PRIMARY KEY ("id_detail")
);

-- CreateTable
CREATE TABLE "search_master" (
    "id_job" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "name_job" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "job_status" VARCHAR(50) DEFAULT 'created',

    CONSTRAINT "search_master_pkey" PRIMARY KEY ("id_job")
);

-- CreateTable
CREATE TABLE "search_post_source" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "post_metadata" JSONB,
    "search_detail_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "search_post_source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "extraction_jobs_search_post_source_id_idx" ON "extraction_jobs"("search_post_source_id");

-- CreateIndex
CREATE INDEX "extraction_jobs_status_idx" ON "extraction_jobs"("status");

-- CreateIndex
CREATE INDEX "search_post_source_search_detail_id_idx" ON "search_post_source"("search_detail_id");

-- AddForeignKey
ALTER TABLE "analyzed_comments" ADD CONSTRAINT "id_comment" FOREIGN KEY ("id_comment") REFERENCES "extracted_comments"("id_comment") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "extracted_comments" ADD CONSTRAINT "extracted_comments_search_post_source_id_fkey" FOREIGN KEY ("search_post_source_id") REFERENCES "search_post_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraction_jobs" ADD CONSTRAINT "extraction_jobs_search_post_source_id_fkey" FOREIGN KEY ("search_post_source_id") REFERENCES "search_post_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_detail" ADD CONSTRAINT "id_job" FOREIGN KEY ("id_job") REFERENCES "search_master"("id_job") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "search_post_source" ADD CONSTRAINT "search_post_source_search_detail_id_fkey" FOREIGN KEY ("search_detail_id") REFERENCES "search_detail"("id_detail") ON DELETE CASCADE ON UPDATE CASCADE;
