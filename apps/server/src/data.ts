const productsData = require('./data/products.json');

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
}

export class User {
  public firstName: string;
  public lastName: string;
  public id: string;

  constructor(id: string) {
    this.id = id;
    this.firstName = 'John';
    this.lastName = 'Doe';
  }
}

const normalize = (value: string) => value.trim().toLowerCase();

const getAllProducts = (): Product[] => {
  return productsData as Product[];
};

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const q = normalize(query);

  if (!q) {
    return [];
  }

  return getAllProducts().filter(p => {
    const name = normalize(p.name);
    const description = normalize(p.description);
    const category = normalize(p.category);

    return name.includes(q) || description.includes(q) || category.includes(q);
  });
};
