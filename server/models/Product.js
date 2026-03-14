const BaseModel = require("./_base");

class Product extends BaseModel {
  constructor(data = {}) {
    super({
      averageReview: null,
      ...data,
    });
  }

  static get tableName() {
    return "products";
  }

  static get columns() {
    return [
      "image",
      "title",
      "description",
      "category",
      "brand",
      "price",
      "salePrice",
      "totalStock",
      "averageReview",
    ];
  }

  static get numericFields() {
    return ["price", "salePrice", "totalStock", "averageReview"];
  }
}

module.exports = Product;
