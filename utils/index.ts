/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  }
  
  /**
   * Generates a unique slug by appending a number if the slug already exists
   * @param baseSlug The base slug to check
   * @param existingSlugs Array of existing slugs
   * @returns A unique slug
   */
  export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug;
    let counter = 1;
  
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  
    return slug;
  }
  
  /**
   * Generates a random string of specified length
   * @param length Length of the random string
   * @returns Random string
   */
  export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  /**
   * Generates dummy meta data for categories
   * @param name Category name
   * @returns Object containing meta title, description and keywords
   */
  export function generateMetaData(name: string) {
    return {
      metaTitle: `${name} - Latest News and Updates`,
      metaDescription: `Stay updated with the latest ${name} news, articles, and insights. Comprehensive coverage of ${name} related topics.`,
      keywords: `${name}, news, updates, latest, articles, insights, coverage`
    };
  }
  
  /**
   * Generates a dummy category name with proper formatting
   * @param index Index number
   * @param level Hierarchy level (0 for parent, 1 for sub, 2 for sub-sub)
   * @returns Formatted category name
   */
  export function generateCategoryName(index: number, level: number = 0): string {
    const levelPrefix = level > 0 ? ` Level ${level}` : '';
    return `Category ${index}${levelPrefix}`;
  }
  
  /**
   * Validates if a string is a valid slug
   * @param slug The slug to validate
   * @returns boolean indicating if the slug is valid
   */
  export function isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }
  
  /**
   * Truncates text to a specified length
   * @param text Text to truncate
   * @param maxLength Maximum length
   * @returns Truncated text
   */
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }