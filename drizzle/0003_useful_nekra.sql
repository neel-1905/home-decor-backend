CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"images" text[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_subcategory" (
	"product_id" text NOT NULL,
	"subcategory_id" text NOT NULL,
	CONSTRAINT "product_subcategory_product_id_subcategory_id_pk" PRIMARY KEY("product_id","subcategory_id")
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"message" text NOT NULL,
	"images" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_product_review" UNIQUE("user_id","product_id"),
	CONSTRAINT "rating_check" CHECK ("review"."rating" >= 1 AND "review"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "color" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "color_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_color" (
	"product_id" text NOT NULL,
	"color_id" text NOT NULL,
	CONSTRAINT "product_color_product_id_color_id_pk" PRIMARY KEY("product_id","color_id")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_product" (
	"wishlist_id" text NOT NULL,
	"product_id" text NOT NULL,
	CONSTRAINT "wishlist_product_wishlist_id_product_id_pk" PRIMARY KEY("wishlist_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategory" ADD CONSTRAINT "product_subcategory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategory" ADD CONSTRAINT "product_subcategory_subcategory_id_subcategory_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_color" ADD CONSTRAINT "product_color_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_color" ADD CONSTRAINT "product_color_color_id_color_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_product" ADD CONSTRAINT "wishlist_product_wishlist_id_wishlist_id_fk" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_product" ADD CONSTRAINT "wishlist_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;