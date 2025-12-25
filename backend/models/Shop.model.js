import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }]
    },
    {
        timestamps: true
    }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
