// we could import the ENTIRE mongoose library, but we only need the Schema and Model function, so we just import them
const { Schema, model } = require('mongoose');
const Comment = require('./Comment');
// allows us to use the get option to pretty up the date on website
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // with this get option in place, when we retrieve a pizza, the createdAt value will be formatted by dateFormat and used
      // this makes the timestamp much prettier
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        // "ref" property is important because it tells the Pizza model which docs to search to find the right comments
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      // virtuals allow us to add more info to a db response so that we don't have to add info manually before responding to API request
      virtuals: true,
      // this tells mongoose to allow any getter function we have specified like the timestamp one above
      getters: true
    },
    // id is false because this is a virtual that Mongoose returns and we don't need it
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza and Comment model
module.exports = Pizza;