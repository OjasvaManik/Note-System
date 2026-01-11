CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`emoji` text,
	`banner_url` text,
	`created_at` integer,
	`updated_at` integer
);
