DO $$ BEGIN
 CREATE TYPE "public"."task_status" AS ENUM('running', 'success', 'failure');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "car-tracker_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_car" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer,
	"model" varchar(255),
	"odometer" integer,
	"price" integer,
	"link_to_ad" varchar(2048) NOT NULL,
	"description" text,
	"website_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"content" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_scaper_engine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "car-tracker_scaper_engine_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_status" "task_status" NOT NULL,
	"website_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "car-tracker_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car-tracker_website" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"scrapping_start_url" varchar(2048) NOT NULL,
	"address" text NOT NULL,
	"scrape_engine_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "car-tracker_website_url_unique" UNIQUE("url"),
	CONSTRAINT "car-tracker_website_scrapping_start_url_unique" UNIQUE("scrapping_start_url")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_account" ADD CONSTRAINT "car-tracker_account_user_id_car-tracker_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."car-tracker_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_car" ADD CONSTRAINT "car-tracker_car_website_id_car-tracker_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."car-tracker_website"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_log" ADD CONSTRAINT "car-tracker_log_task_id_car-tracker_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."car-tracker_task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_session" ADD CONSTRAINT "car-tracker_session_user_id_car-tracker_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."car-tracker_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_task" ADD CONSTRAINT "car-tracker_task_website_id_car-tracker_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."car-tracker_website"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car-tracker_website" ADD CONSTRAINT "website_scrape_engine_fk" FOREIGN KEY ("scrape_engine_id") REFERENCES "public"."car-tracker_scaper_engine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "car-tracker_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "car_website_idx" ON "car-tracker_car" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_idx" ON "car-tracker_log" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "car-tracker_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_website_idx" ON "car-tracker_task" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "scrape_engine_idx" ON "car-tracker_website" USING btree ("scrape_engine_id");