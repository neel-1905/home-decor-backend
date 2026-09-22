ALTER TABLE "account" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "category_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "product_subcategory" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product_subcategory" ALTER COLUMN "subcategory_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "review" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "review" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "review" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "color" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "color" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "product_color" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product_color" ALTER COLUMN "color_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist_product" ALTER COLUMN "wishlist_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist_product" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "cart_item" ALTER COLUMN "cart_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "cart_item" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "order_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order_status_history" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order_status_history" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "order_status_history" ALTER COLUMN "order_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "role_permission" ALTER COLUMN "role_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "role_permission" ALTER COLUMN "permission_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "permission" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "permission" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();