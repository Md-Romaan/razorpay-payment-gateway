import "dotenv/config";
import express from 'express';
import cors from "cors";
import razorpayInstance from './razorpay.js';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({
    origin: '*', // Allow all origins,
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//order creation of razorpay
app.post("/create-order", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const order = await razorpayInstance.orders.create({
            amount: amount * 100,
            currency: currency || "INR",
        })

        return res.status(200).json({
            success: true,
            order
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error in order creation",
            error: error.message
        });
    }
})

//verify payment after after order is created and payment is made
app.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const resultSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

        if (resultSign === razorpay_signature) {
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error in verifying payment!" });
    }
})


app.listen(PORT, () => {
    console.info(`Server is running on PORT: ${PORT}`);
})
