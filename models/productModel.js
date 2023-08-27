const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  sizeStock: {
    type: Number,
    required: [true, 'Un producto debe indicar el stock'],
    default: 0,
  },
  width: { type: String },
  height: { type: String },
  waist: { type: String },
  thigh: { type: String },
  long: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un producto debe tener un nombre'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'El nombre del producto debe tener 40 caracteres o menos',
      ],
      minlength: [4, 'El nombre del producto debe tener 4 caracteres o más'],
    },
    slug: String,
    boughtAt: {
      type: String,
      required: [true, 'Un producto debe tener una fecha de compra'],
    },
    dolarAtBuy: {
      type: Number,
      required: [
        true,
        'Un producto debe tener un precio de dolar al momento de la compra',
      ],
    },
    priceOriginal: {
      type: Number,
      required: [true, 'Un producto debe tener un precio original'],
    },
    price: {
      type: Number,
      required: [true, 'Un producto debe tener un precio'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'El descuento debe ser menor que el precio regular',
      },
      default: 0,
    },
    sizes: [sizeSchema],
    stock: {
      type: Number,
      required: [true, 'Un producto debe indicar el stock'],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      required: [true, 'Un producto debe tener una categoría'],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, 'Un producto debe tener una marca'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Un producto debe tener una descripción'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Un producto debe tener una imagen de portada'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('discountedPrice').get(function () {
  return this.price - this.priceDiscount;
});

productSchema.virtual('available').get(function () {
  return this.stock > 0;
});

// productSchema.virtual('imageCoverUrl').get(function() {
//   return `https://ejemplo.com/images/${this.imageCover}`;
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// productSchema.pre(/^find/, function (next) {
//   this.find({ stock: { $gt: 0 } }); // Filtrar productos con stock mayor a 0

//   next();
// });

productSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// productSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { stock: { $gt: 0 } } }); // Filtrar productos con stock mayor a 0

//   console.log(this.pipeline());
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
