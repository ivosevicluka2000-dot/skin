CREATE TABLE IF NOT EXISTS `community_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `community_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_community_comments_post_status_created` ON `community_comments` (`post_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `community_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`space_id` text NOT NULL,
	`author_name` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`like_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_community_posts_space_status_created` ON `community_posts` (`space_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `course_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`course_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_course_enrollments_owner_course` ON `course_enrollments` (`owner_id`,`course_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_course_enrollments_course_status` ON `course_enrollments` (`course_id`,`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `event_log` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`subject_type` text,
	`subject_id` text,
	`payload_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_event_log_event_type_created_at` ON `event_log` (`event_type`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `lesson_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`course_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`progress_seconds` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "lesson_progress_seconds_nonnegative" CHECK("lesson_progress"."progress_seconds" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_lesson_progress_owner_lesson` ON `lesson_progress` (`owner_id`,`lesson_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_lesson_progress_owner_course` ON `lesson_progress` (`owner_id`,`course_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `newsletter_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`source` text DEFAULT 'website' NOT NULL,
	`consent` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_newsletter_signups_email` ON `newsletter_signups` (`email`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`variant_name` text,
	`routine_slot` text,
	`quantity` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`line_total_cents` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "order_items_quantity_positive" CHECK("order_items"."quantity" > 0),
	CONSTRAINT "order_items_unit_price_nonnegative" CHECK("order_items"."unit_price_cents" >= 0),
	CONSTRAINT "order_items_line_total_nonnegative" CHECK("order_items"."line_total_cents" >= 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`address_line_1` text NOT NULL,
	`address_line_2` text,
	`city` text NOT NULL,
	`postal_code` text NOT NULL,
	`country` text DEFAULT 'RS' NOT NULL,
	`payment_method` text DEFAULT 'cash_on_delivery' NOT NULL,
	`subtotal_cents` integer NOT NULL,
	`shipping_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer NOT NULL,
	`currency` text DEFAULT 'RSD' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "orders_subtotal_nonnegative" CHECK("orders"."subtotal_cents" >= 0),
	CONSTRAINT "orders_shipping_nonnegative" CHECK("orders"."shipping_cents" >= 0),
	CONSTRAINT "orders_total_nonnegative" CHECK("orders"."total_cents" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_orders_order_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_orders_email_created_at` ON `orders` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_orders_status_created_at` ON `orders` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `quiz_results` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`quiz_version` text DEFAULT '2026-09' NOT NULL,
	`routine_id` text NOT NULL,
	`routine_name` text NOT NULL,
	`primary_signal` text NOT NULL,
	`answers_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_quiz_results_owner_created_at` ON `quiz_results` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`author_name` text NOT NULL,
	`email` text,
	`rating` integer NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`verified_purchase` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "reviews_rating_range" CHECK("reviews"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_reviews_product_status_created_at` ON `reviews` (`product_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `saved_routines` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`session_id` text,
	`name` text DEFAULT 'Moja rutina' NOT NULL,
	`skin_profile_json` text DEFAULT '{}' NOT NULL,
	`items_json` text DEFAULT '[]' NOT NULL,
	`total_cents` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'RSD' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "saved_routines_owner_present" CHECK("saved_routines"."email" IS NOT NULL OR "saved_routines"."session_id" IS NOT NULL),
	CONSTRAINT "saved_routines_total_nonnegative" CHECK("saved_routines"."total_cents" >= 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_saved_routines_email_updated_at` ON `saved_routines` (`email`,`updated_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_saved_routines_session_updated_at` ON `saved_routines` (`session_id`,`updated_at`);