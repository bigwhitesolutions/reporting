import { QueryColumn } from "flowerbi";

// Important: this file is auto-generated by flowerbi.

export const ProductSubcategory = {
    ProductSubcategoryID: new QueryColumn<number>("ProductSubcategory.ProductSubcategoryID"),
    Name: new QueryColumn<string>("ProductSubcategory.Name"),
};

export const Product = {
    ProductId: new QueryColumn<number>("Product.ProductId"),
    Name: new QueryColumn<string>("Product.Name"),
    ProductSubcategoryID: new QueryColumn<number>("Product.ProductSubcategoryID"),
};
