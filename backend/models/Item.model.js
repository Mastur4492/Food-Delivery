import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
       name:{
        type: String,
        required: true
       },
       image:{
        type: String,
        required: true
       },
       shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
       },
     category:{
        type: String,
        required: true,
        enum: ['Food', 'Beverage', 'Dessert', 'Snack']
     },
     price:{
        type: Number,
        min:0,
        required: true
     },
     description:{
        type: String,
        required: true
     },
     stock:{
        type: Number,
        required: true
     },

     foodType:{
        type: String,
        required: true,
        enum: ['Veg', 'Non-Veg']
     }
    },
    {
        timestamps: true
    }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
