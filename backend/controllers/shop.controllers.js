import Shop from "../models/Shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createANDEditShop = async (req, res) => {
    try {
        const { name, address, city, state } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }
        let shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            if (!image) {
                return res.status(400).json({ message: "Image is required to create a shop" });
            }
            shop = await Shop.create({ name, image, owner: req.userId, address, city, state });
        } else {
            const updateData = { name, address, city, state };
            if (image) {
                updateData.image = image;
            }
            shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
        }
        await shop.populate('owner items');
        return res.status(201).json({ shop });
    } catch (error) {
        console.error("Error in createANDEditShop:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}
const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        await shop.populate('owner items');
        return res.status(200).json({ shop })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        return res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export {
    createANDEditShop,
    getMyShop,
    deleteShop
}