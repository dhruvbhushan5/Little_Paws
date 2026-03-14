const BaseModel = require("./_base");

class Pet extends BaseModel {
  static get tableName() {
    return "pets";
  }

  static get columns() {
    return [
      "pictures",
      "name",
      "type",
      "breed",
      "description",
      "age",
      "region",
      "distanceFromChandigarhKm",
      "pickupEligible",
      "pickupMessage",
      "foster",
      "shelter",
      "reportStatus",
      "reportSeenAt",
    ];
  }

  static get jsonFields() {
    return ["pictures"];
  }

  static get numericFields() {
    return ["age", "distanceFromChandigarhKm", "pickupEligible", "foster", "shelter"];
  }
}

module.exports = Pet;
