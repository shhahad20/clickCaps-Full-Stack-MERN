import Stripe from 'stripe';
import ApiError from '../errors/ApiError.js';
import User from '../models/userSchema.js';
const stripe = new Stripe('sk_test_51OVvNeKgYALNC8Mn8QDSCKWV6Yudpvb7gihmmmE7jYAhQ9HEAhDTlgEdSjkk7XbKmzDamG7cSPZffirYXnuc3BpH00K2H7BbzI');
export const checkoutOrder = async (req, res, next) => {
    try {
        // Retrieve customer information from MongoDB
        const customerData = await User.findOne({ _id: req.body.userId });
        // Check if customer data exists in MongoDB
        if (!customerData) {
            throw new ApiError(404, `Customer not found in MongoDB.`);
        }
        // Retrieve a list of customers matching the provided email
        const stripeCustomer = await stripe.customers.list({
            email: customerData.email,
        });
        let id = stripeCustomer.data[0].id;
        // Verify the existence of previous order data for the customer
        if (!stripeCustomer) {
            // Create customer in Stripe
            const stripeCustomer = await stripe.customers.create({
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
        const session = await stripe.checkout.sessions.create({
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
};
export const stripeCheckout = async (req, res, next) => {
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
    const session = await stripe.checkout.sessions.create({
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
};
