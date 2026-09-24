import { db } from '@/db';
import { color, product, productColor } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Seeding colors...');

  await db.transaction(async (tx) => {
    // =========================================================
    // COLORS
    // =========================================================

    const colors = await tx
      .insert(color)
      .values([
        {
          name: 'Black',
          value: '#000000',
        },
        {
          name: 'White',
          value: '#FFFFFF',
        },
        {
          name: 'Brown',
          value: '#8B4513',
        },
        {
          name: 'Beige',
          value: '#F5F5DC',
        },
        {
          name: 'Grey',
          value: '#808080',
        },
        {
          name: 'Walnut',
          value: '#5C4033',
        },
        {
          name: 'Oak',
          value: '#C19A6B',
        },
        {
          name: 'Blue',
          value: '#4169E1',
        },
        {
          name: 'Green',
          value: '#556B2F',
        },
        {
          name: 'Cream',
          value: '#FFFDD0',
        },
      ])
      .returning({
        id: color.id,
        name: color.name,
      });

    const colorMap = new Map(colors.map((item) => [item.name, item.id]));

    // =========================================================
    // PRODUCT → COLORS
    // =========================================================

    const productColorData = [
      {
        product: 'Modern King Bed',
        colors: ['Walnut', 'Oak', 'Brown'],
      },
      {
        product: 'Oak Bedside Table',
        colors: ['Oak', 'Walnut', 'Brown'],
      },
      {
        product: 'Three Door Wardrobe',
        colors: ['Walnut', 'White', 'Grey'],
      },
      {
        product: 'Modern 3-Seater Sofa',
        colors: ['Beige', 'Grey', 'Blue', 'Cream'],
      },
      {
        product: 'Round Wooden Coffee Table',
        colors: ['Oak', 'Walnut', 'Brown'],
      },
      {
        product: 'Modern TV Unit',
        colors: ['Black', 'Walnut', 'White'],
      },
      {
        product: 'Kitchen Storage Cabinet',
        colors: ['White', 'Grey', 'Oak'],
      },
      {
        product: 'Minimal Kitchen Chair',
        colors: ['Oak', 'Black', 'White'],
      },
      {
        product: 'Solid Wood Dining Table',
        colors: ['Oak', 'Walnut', 'Brown'],
      },
      {
        product: 'Upholstered Dining Chair',
        colors: ['Beige', 'Grey', 'Cream', 'Blue'],
      },
      {
        product: 'Modern Office Desk',
        colors: ['Walnut', 'Black', 'Oak'],
      },
      {
        product: 'Ergonomic Office Chair',
        colors: ['Black', 'Grey', 'Blue'],
      },
      {
        product: 'Office Storage Cabinet',
        colors: ['White', 'Black', 'Grey'],
      },
    ];

    // =========================================================
    // FIND PRODUCTS + CREATE RELATIONSHIPS
    // =========================================================

    for (const item of productColorData) {
      const [productRecord] = await tx
        .select({
          id: product.id,
        })
        .from(product)
        .where(eq(product.name, item.product))
        .limit(1);

      if (!productRecord) {
        throw new Error(`Product not found: ${item.product}`);
      }

      const relationships = item.colors.map((colorName) => {
        const colorId = colorMap.get(colorName);

        if (!colorId) {
          throw new Error(`Color not found: ${colorName}`);
        }

        return {
          productId: productRecord.id,
          colorId,
        };
      });

      await tx.insert(productColor).values(relationships);
    }
  });

  console.log('✅ Colors seeded successfully');
}

main().catch((error) => {
  console.error('❌ Color seed failed:', error);
  process.exit(1);
});
