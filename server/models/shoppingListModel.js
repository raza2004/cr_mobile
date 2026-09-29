import mongoose, { Schema } from 'mongoose';

// Define the schema for individual items in the shopping list
const shoppingItemSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    options: [{ type: String }], // Array of links
}, { timestamps: true });

// Define the schema for the shopping list
const shoppingListSchema = new Schema({
    stylistEmail: { type: String, required: true },
    clientEmail: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, // Background image for the shopping list
    items: [shoppingItemSchema], // Array of items in the shopping list
}, { timestamps: true });

export default mongoose.models.ShoppingList || mongoose.model('ShoppingList', shoppingListSchema);
