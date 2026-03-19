import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";


export const orderData = async (req, res) => {
    const order = req.body;

    try {
        const orderInfo = await Order.create({
            ...order,
            userId: req.userId   // ✅ FIX
        });

        console.log(orderInfo);

        const userId = req.userId;   // ✅ FIX
        const courseId = order.courseId;

        if (orderInfo) {
            await Purchase.create({ userId, courseId });  // ✅ अब सही save होगा
        }

        res.status(201).json({ message: "Order Details: ", orderInfo });

    } catch (error) {
        console.log("Error in Order:", error);
        res.status(401).json({ errors: "error in order creation" });
    }
};