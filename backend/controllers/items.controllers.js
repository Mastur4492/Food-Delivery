import Item from "../models/Item.model.js";
import Shop from "../models/Shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const addItem = async (req, res) => {
    try {
        const { name, category, price, description, stock, foodType } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }
        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        const item = await Item.create({ name, image, shop: shop._id, category, price, description, stock, foodType });
        shop.items.push(item._id);
        await shop.save();
        return res.status(201).json({ item })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, category, price, description, stock, foodType } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }
        const item = await Item.findByIdAndUpdate(itemId, { name, category, price, image, description, stock, foodType }, { new: true });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        return res.status(200).json({ item })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Remove item from shop
        const shop = await Shop.findById(item.shop);
        if (shop) {
            shop.items = shop.items.filter(id => id.toString() !== itemId);
            await shop.save();
        }

        await Item.findByIdAndDelete(itemId);
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export {
    addItem,
    editItem,
    deleteItem
}