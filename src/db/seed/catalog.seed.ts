import { db } from '@/db';
import {
  category,
  product,
  productSubcategory,
  subcategory,
} from '@/db/schema';

async function main() {
  console.log('🌱 Seeding catalog...');

  await db.transaction(async (tx) => {
    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = await tx
      .insert(category)
      .values([
        {
          name: 'Bedroom',
          icon: 'bed',
        },
        {
          name: 'Living Room',
          icon: 'sofa',
        },
        {
          name: 'Kitchen',
          icon: 'chef-hat',
        },
        {
          name: 'Dining Room',
          icon: 'utensils',
        },
        {
          name: 'Office',
          icon: 'briefcase',
        },
      ])
      .returning({
        id: category.id,
        name: category.name,
      });

    const categoryMap = new Map(categories.map((item) => [item.name, item.id]));

    // =========================================================
    // SUBCATEGORIES
    // =========================================================

    const subcategoryData = [
      // Bedroom
      { category: 'Bedroom', name: 'Beds' },
      { category: 'Bedroom', name: 'Bedside Tables' },
      { category: 'Bedroom', name: 'Wardrobes' },
      { category: 'Bedroom', name: 'Bedroom Chairs' },
      { category: 'Bedroom', name: 'Bedroom Decor' },

      // Living Room
      { category: 'Living Room', name: 'Sofas' },
      { category: 'Living Room', name: 'Coffee Tables' },
      { category: 'Living Room', name: 'TV Units' },
      { category: 'Living Room', name: 'Living Room Chairs' },
      { category: 'Living Room', name: 'Living Room Decor' },

      // Kitchen
      { category: 'Kitchen', name: 'Kitchen Storage' },
      { category: 'Kitchen', name: 'Kitchen Tables' },
      { category: 'Kitchen', name: 'Kitchen Chairs' },
      { category: 'Kitchen', name: 'Kitchen Lights' },
      { category: 'Kitchen', name: 'Kitchen Decor' },

      // Dining Room
      { category: 'Dining Room', name: 'Dining Tables' },
      { category: 'Dining Room', name: 'Dining Chairs' },
      { category: 'Dining Room', name: 'Dining Storage' },
      { category: 'Dining Room', name: 'Dining Lights' },
      { category: 'Dining Room', name: 'Dining Decor' },

      // Office
      { category: 'Office', name: 'Office Desks' },
      { category: 'Office', name: 'Office Chairs' },
      { category: 'Office', name: 'Office Storage' },
      { category: 'Office', name: 'Office Lights' },
      { category: 'Office', name: 'Office Decor' },
    ];

    const subcategories = await tx
      .insert(subcategory)
      .values(
        subcategoryData.map((item) => ({
          categoryId: categoryMap.get(item.category)!,
          name: item.name,
        })),
      )
      .returning({
        id: subcategory.id,
        name: subcategory.name,
        categoryId: subcategory.categoryId,
      });

    const subcategoryMap = new Map(
      subcategories.map((item) => [`${item.categoryId}:${item.name}`, item.id]),
    );

    // =========================================================
    // PRODUCTS
    // =========================================================

    const productData = [
      {
        name: 'Modern King Bed',
        description:
          'A modern wooden king-size bed with a clean minimalist design.',
        price: '45999.99',
        images: ['bed-1.jpg', 'bed-2.jpg'],
        category: 'Bedroom',
        subcategory: 'Beds',
      },
      {
        name: 'Oak Bedside Table',
        description:
          'Compact oak bedside table with a drawer and open storage.',
        price: '6999.99',
        images: ['bedside-table-1.jpg'],
        category: 'Bedroom',
        subcategory: 'Bedside Tables',
      },
      {
        name: 'Three Door Wardrobe',
        description: 'Spacious three-door wooden wardrobe for modern bedrooms.',
        price: '28999.99',
        images: ['wardrobe-1.jpg'],
        category: 'Bedroom',
        subcategory: 'Wardrobes',
      },
      {
        name: 'Modern 3-Seater Sofa',
        description:
          'Comfortable three-seater sofa with soft fabric upholstery.',
        price: '32999.99',
        images: ['sofa-1.jpg', 'sofa-2.jpg'],
        category: 'Living Room',
        subcategory: 'Sofas',
      },
      {
        name: 'Round Wooden Coffee Table',
        description: 'Minimal round coffee table made from natural wood.',
        price: '8999.99',
        images: ['coffee-table-1.jpg'],
        category: 'Living Room',
        subcategory: 'Coffee Tables',
      },
      {
        name: 'Modern TV Unit',
        description:
          'Contemporary TV unit with open shelving and storage cabinets.',
        price: '15999.99',
        images: ['tv-unit-1.jpg'],
        category: 'Living Room',
        subcategory: 'TV Units',
      },
      {
        name: 'Kitchen Storage Cabinet',
        description:
          'Functional kitchen storage cabinet with multiple compartments.',
        price: '12999.99',
        images: ['kitchen-storage-1.jpg'],
        category: 'Kitchen',
        subcategory: 'Kitchen Storage',
      },
      {
        name: 'Minimal Kitchen Chair',
        description: 'Simple wooden chair designed for modern kitchen spaces.',
        price: '3499.99',
        images: ['kitchen-chair-1.jpg'],
        category: 'Kitchen',
        subcategory: 'Kitchen Chairs',
      },
      {
        name: 'Solid Wood Dining Table',
        description:
          'Six-seater solid wood dining table with a natural finish.',
        price: '24999.99',
        images: ['dining-table-1.jpg'],
        category: 'Dining Room',
        subcategory: 'Dining Tables',
      },
      {
        name: 'Upholstered Dining Chair',
        description:
          'Comfortable upholstered dining chair with a wooden frame.',
        price: '4999.99',
        images: ['dining-chair-1.jpg'],
        category: 'Dining Room',
        subcategory: 'Dining Chairs',
      },
      {
        name: 'Modern Office Desk',
        description:
          'Minimal office desk with a spacious work surface and storage.',
        price: '13999.99',
        images: ['office-desk-1.jpg'],
        category: 'Office',
        subcategory: 'Office Desks',
      },
      {
        name: 'Ergonomic Office Chair',
        description:
          'Ergonomic office chair designed for comfortable long working sessions.',
        price: '11999.99',
        images: ['office-chair-1.jpg'],
        category: 'Office',
        subcategory: 'Office Chairs',
      },
      {
        name: 'Office Storage Cabinet',
        description:
          'Compact office cabinet for organizing documents and supplies.',
        price: '8999.99',
        images: ['office-storage-1.jpg'],
        category: 'Office',
        subcategory: 'Office Storage',
      },
    ];

    // =========================================================
    // PRODUCTS + PRODUCT/SUBCATEGORY RELATIONSHIPS
    // =========================================================

    for (const item of productData) {
      const categoryId = categoryMap.get(item.category);

      if (!categoryId) {
        throw new Error(`Category not found: ${item.category}`);
      }

      const subcategoryId = subcategoryMap.get(
        `${categoryId}:${item.subcategory}`,
      );

      if (!subcategoryId) {
        throw new Error(
          `Subcategory not found: ${item.category} -> ${item.subcategory}`,
        );
      }

      const [createdProduct] = await tx
        .insert(product)
        .values({
          name: item.name,
          description: item.description,
          price: item.price,
          images: item.images,
          isActive: true,
        })
        .returning({
          id: product.id,
          name: product.name,
        });

      await tx.insert(productSubcategory).values({
        productId: createdProduct.id,
        subcategoryId,
      });
    }
  });

  console.log('✅ Catalog seeded successfully');
}

main().catch((error) => {
  console.error('❌ Catalog seed failed:', error);
  process.exit(1);
});
