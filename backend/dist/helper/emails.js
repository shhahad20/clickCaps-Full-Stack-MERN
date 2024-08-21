"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUpdatedEmail = exports.OrderCreatedEmail = exports.forgetPasswordEmail = exports.registeringEmail = void 0;
const registeringEmail = (email, first_name, last_name, token) => {
    const emailData = {
        email: email,
        subject: 'Activate your account',
        html: `<h1>Hello ${first_name} ${last_name}</h1> <p>You can acticate your account by clicking on the Activate link below.
  Note: the Link vaild for one hour</p>
  <a href="http://localhost:3000/api/users/activate/${token}">Clink here to activate</a>      `,
    };
    return emailData;
};
exports.registeringEmail = registeringEmail;
const forgetPasswordEmail = (email, first_name, last_name, token) => {
    const emailData = {
        email: email,
        subject: 'Forgot Password',
        html: `<h1>Hello ${first_name} ${last_name}</h1> 
    <p>We received a request to reset your password. Please click the link below to create a new password:</p>
    <a href="http://localhost:3000/api/users/reset-password/${token}">Reset Password</a> 
    <p>If you didn't request a password reset, you can ignore this email.</p>
    <p>Best regards,<br>Developer Shahad</p>     `,
    };
    return emailData;
};
exports.forgetPasswordEmail = forgetPasswordEmail;
const OrderCreatedEmail = (email, first_name, last_name, totalAmount) => {
    const emailData = {
        email: email,
        html: `<h1>Hello ${first_name} ${last_name}</h1>
       <h4>We are sending you this email to inform you that your order has been created with a total amount of ${totalAmount}</h4>
       <p>Thank you for shopping with us</p>`,
        subject: 'Order Created'
    };
    return emailData;
};
exports.OrderCreatedEmail = OrderCreatedEmail;
const OrderUpdatedEmail = (email, first_name, last_name, status) => {
    const emailData = {
        email: email,
        html: `<h1>Hello ${first_name} ${last_name}</h1>
       <h4>We are sending you this email to inform you that your order status has changed to ${status}</h4>
       <p>Thank you for shopping with us</p>`,
        subject: 'Order Status Changed',
    };
    return emailData;
};
exports.OrderUpdatedEmail = OrderUpdatedEmail;
