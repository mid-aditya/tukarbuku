CREATE TYPE "public"."book_status" AS ENUM('tersedia', 'proses', 'selesai', 'dibatalkan');--> statement-breakpoint
CREATE TYPE "public"."book_condition" AS ENUM('baru', 'baik', 'cukup', 'rusak-ringan');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('JUAL', 'BARTER', 'DONASI');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'disepakati', 'selesai', 'batal');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('JUAL', 'BARTER');--> statement-breakpoint
CREATE TABLE "books" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"owner_id" varchar(36) NOT NULL,
	"title" varchar(200) NOT NULL,
	"author" varchar(160) NOT NULL,
	"condition" "book_condition" NOT NULL,
	"description" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"additional_image_urls" text[] DEFAULT '{}' NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"price" integer,
	"wanted_in_exchange" text,
	"status" "book_status" DEFAULT 'tersedia' NOT NULL,
	"city" varchar(100) NOT NULL,
	"area" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"book_id" varchar(36),
	"participant_one_id" varchar(36) NOT NULL,
	"participant_two_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(36) NOT NULL,
	"sender_id" varchar(36) NOT NULL,
	"content" varchar(2000) NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"book_id" varchar(36) NOT NULL,
	"buyer_id" varchar(36) NOT NULL,
	"seller_id" varchar(36) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"meetup_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"google_id" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(120) NOT NULL,
	"avatar_url" text,
	"phone" varchar(32),
	"address" varchar(160),
	"city" varchar(100),
	"profile_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant_one_id_users_id_fk" FOREIGN KEY ("participant_one_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant_two_id_users_id_fk" FOREIGN KEY ("participant_two_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "books_listing_type_idx" ON "books" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "books_status_idx" ON "books" USING btree ("status");--> statement-breakpoint
CREATE INDEX "books_owner_id_idx" ON "books" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "conversations_participant_one_idx" ON "conversations" USING btree ("participant_one_id");--> statement-breakpoint
CREATE INDEX "conversations_participant_two_idx" ON "conversations" USING btree ("participant_two_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_sent_at_idx" ON "messages" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "transactions_buyer_id_idx" ON "transactions" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "transactions_seller_id_idx" ON "transactions" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "transactions_book_id_idx" ON "transactions" USING btree ("book_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_google_id_idx" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");