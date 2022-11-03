using FlowerBI;
// ReSharper disable MemberCanBePrivate.Global

namespace Database;

[DbSchema("Production")]
public static class AdventureWorks2019Schema
{
    [DbTable("ProductSubcategory")]
    public static class ProductSubcategory
    {
        public static readonly PrimaryKey<int> ProductSubcategoryID = new("ProductSubcategoryID");
        public static readonly Column<string> Name = new("Name");
    }
    
    [DbTable("Product")]
    public static class Product
    {
        public static readonly PrimaryKey<int> ProductId = new("ProductId");
        public static readonly Column<string> Name = new("Name");
        public static readonly ForeignKey<int> ProductSubcategoryID = new("ProductSubcategoryID", ProductSubcategory.ProductSubcategoryID);
    }
}