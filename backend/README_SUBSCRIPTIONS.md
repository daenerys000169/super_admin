# Subscription System Documentation

## Overview
This system implements monthly recurring donations using Razorpay's subscription API.

## Database Schema
The `subscriptions` table includes:
- `name`, `email`, `contact`: Donater details
- `planType`: ENUM (changemaker, impact_partner, empowerment_ally, growth_contributor, change_guardian)
- `amount`: Subscription amount in rupees
- `frequency`: ENUM (monthly, quarterly, yearly) - default monthly
- `status`: ENUM (created, active, paused, cancelled, completed)
- `razorpaySubscriptionId`, `razorpayCustomerId`: Razorpay identifiers
- `paymentId`: Latest payment ID
- Timestamps: createdAt, updatedAt

## API Endpoints

### POST /api/subscriptions
Create a new subscription
```json
{
  "planType": "changemaker",
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "9999999999",
  "amount": 50000, // in paise (optional, uses plan default)
  "frequency": "monthly"
}
```

### POST /api/subscriptions/verify-payment
Verify subscription payment
```json
{
  "razorpay_subscription_id": "sub_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_here",
  "subscriptionId": 123
}
```

### POST /api/subscriptions/webhook
Handle Razorpay webhooks (subscription events)

### GET /api/subscriptions/:id
Get subscription details

### PUT /api/subscriptions/:id/cancel
Cancel subscription

### GET /api/subscriptions
Get all subscriptions (admin)

## Environment Variables Required

### Razorpay Configuration
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Subscription Plan IDs (Required - from Razorpay dashboard)
```
RAZORPAY_CHANGEMAKER_PLAN_ID=plan_S28rJrYONPQAzA
RAZORPAY_IMPACT_PARTNER_PLAN_ID=plan_S28tpcFw3KRcZO
RAZORPAY_EMPOWERMENT_ALLY_PLAN_ID=plan_S28uewX9htWiCH
RAZORPAY_GROWTH_CONTRIBUTOR_PLAN_ID=plan_S28vG72iX0OCat
RAZORPAY_CHANGE_GUARDIAN_PLAN_ID=plan_S28wPfEyaCXvOS
```

## Setup Instructions

1. **Create Database Table:**
```bash
cd backend
node scripts/createSubscriptionTable.js
```

2. **Create Razorpay Plans** (Optional but recommended):
   - Login to Razorpay Dashboard
   - Go to Plans section
   - Create plans for each subscription tier
   - Add the plan IDs to your environment variables

3. **Setup Webhooks:**
   - In Razorpay Dashboard, create a webhook
   - URL: `https://yourdomain.com/api/subscriptions/webhook`
   - Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, etc.
   - Copy the webhook secret to your environment variables

## Subscription Plans

| Plan Type | Amount (₹) | Description |
|-----------|------------|-------------|
| changemaker | 500 | Make a meaningful impact |
| impact_partner | 1,000 | Partner for lasting change |
| empowerment_ally | 2,500 | Support women empowerment |
| growth_contributor | 5,000 | Drive comprehensive growth |
| change_guardian | 10,000 | Become a guardian of change |

## Testing

### Without Razorpay Plans (Manual Mode):
- The system will create manual subscriptions
- You'll need to handle recurring payments manually
- Useful for testing the basic functionality

### With Razorpay Plans (Recommended):
- Automatic recurring billing
- Webhook notifications for status updates
- Better user experience

## Webhook Events Handled

- `subscription.activated`: Subscription becomes active
- `subscription.charged`: Successful recurring payment
- `subscription.cancelled`: Subscription cancelled
- `subscription.paused`: Subscription paused
- `subscription.completed`: Subscription completed

## Error Handling

The system includes comprehensive error handling for:
- Invalid plan types
- Missing required fields
- Razorpay API errors
- Payment verification failures
- Webhook signature validation

## Security

- Webhook signatures are verified using HMAC-SHA256
- Payment verification uses Razorpay's signature validation
- Input validation for all API endpoints
- SQL injection prevention through Sequelize ORM
