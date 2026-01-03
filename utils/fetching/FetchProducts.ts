import { API_CONFIG } from "@/lib/config";

export const fetchProducts = async (): Promise<Products[]> => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.products.base, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products:", error);
    }
    return [] as unknown as Products[];
  }
};

export const fetchProductsById = async (
  productsId: string
): Promise<ProductsDetails> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.byProductsId(productsId),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product by id: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching product by id:", error);
    }
    return {} as unknown as ProductsDetails;
  }
};

export const fetchProductsBySearch = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<ProductsSearchResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.search(query, page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error searching products:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      query: query,
    };
  }
};

export const fetchProductCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.products.categories, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching categories:", error);
    }
    return [];
  }
};

export const fetchProductType = async (): Promise<Type[]> => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.products.type, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching types:", error);
    }
    return [];
  }
};

export const fetchProductsDiscount = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductsDiscountResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.discount(page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products discount: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products discount:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};
