import stripe from 'stripe';

// init stripe
const paymentService = stripe(process.env.PAYMENT_SERVICE_SECRET_KEY);

export default paymentService;
