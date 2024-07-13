import { Category } from '../../models/sql/Category';

export class CategoryRepository {
  static build(data: Partial<Category>): Category {
    return Category.build(data);
  }

  static async save(category: Category): Promise<Category> {
    await category.save();
    return category;
  }

  static async update(
    categoryId: number,
    data: Partial<Category>,
  ): Promise<Category | null> {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return null;
    }
    return await category.update(data);
  }

  static async delete(categoryId: number): Promise<Category | null> {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return null;
    }
    await category.destroy();
    return category;
  }

  static async findCategoryById(categoryId: number): Promise<Category | null> {
    return await Category.findByPk(categoryId);
  }

  static async updateOrCreate(
    categoryId: number,
    data: Partial<Category>,
  ): Promise<{ created: boolean; category: Category }> {
    let category = await Category.findByPk(categoryId);

    if (!category) {
      category = await Category.create(data);
      return { created: true, category };
    }

    category = await category.update(data);
    return { created: false, category };
  }
}
