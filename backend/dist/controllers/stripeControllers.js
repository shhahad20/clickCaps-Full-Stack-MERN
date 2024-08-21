"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeCheckout = exports.checkoutOrder = void 0;
const stripe_1 = __importDefault(require("stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const stripe = new stripe_1.default('sk_test_51OVvNeKgYALNC8Mn8QDSCKWV6Yudpvb7gihmmmE7jYAhQ9HEAhDTlgEdSjkk7XbKmzDamG7cSPZffirYXnuc3BpH00K2H7BbzI');
const checkoutOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve customer information from MongoDB
        const customerData = yield userSchema_1.default.findOne({ _id: req.body.userId });
        // Check if customer data exists in MongoDB
        if (!customerData) {
            throw new ApiError_1.default(404, `Customer not found in MongoDB.`);
        }
        // Retrieve a list of customers matching the provided email
        const stripeCustomer = yield stripe.customers.list({
            email: customerData.email,
        });
        let id = stripeCustomer.data[0].id;
        // Verify the existence of previous order data for the customer
        if (!stripeCustomer) {
            // Create customer in Stripe
            const stripeCustomer = yield stripe.customers.create({
                email: customerData.email,
                name: customerData.first_name + ' ' + customerData.last_name,
                phone: customerData.phone,
            });
            id = stripeCustomer.id;
        }
        // Store order data in a line items
        const line_items = req.body.orders.orderItems.map((item) => {
            const { name, image, price } = item.product;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: name,
                        images: [`http://localhost:5050/${image.split('\\').slice(1).join('/')}`],
                        metadata: {
                            id: item._id,
                        },
                    },
                    unit_amount: price * 100,
                },
                quantity: item.quantity,
            };
        });
        //Create a Checkout Session
        const session = yield stripe.checkout.sessions.create({
            customer: id,
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['SA', 'FI', 'US'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1500,
                            currency: 'usd',
                        },
                        display_name: 'Next day air',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1,
                            },
                        },
                    },
                },
            ],
            phone_number_collection: {
                enabled: true,
            },
            line_items,
            mode: 'payment',
            // success_url: `http://localhost:5173/success`,
            // cancel_url: `http://localhost:5173/cancel`,
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`,
        });
        res.status(200).send({ url: session.url });
    }
    catch (e) {
        next(e);
    }
});
exports.checkoutOrder = checkoutOrder;
const stripeCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const line_items = req.body.cartItem.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: {
                        id: item._id
                    }
                },
                unit_amount: item.price * 100,
            },
            // Slove the quantity issue 
            quantity: 1,
        };
    });
    const session = yield stripe.checkout.sessions.create({
        line_items,
        // line_items: [
        //   {
        //     price_data:{
        //       currency:'usd',
        //       product_data:{
        //         name: 'T-shirt',
        //       },
        //       unit_amount: 2000,
        //     },
        //     quantity:1,
        //   },
        // ],
        mode: 'payment',
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
    });
    // res.redirect(303, session.url);
    res.send({ url: session.url });
});
exports.stripeCheckout = stripeCheckout;
