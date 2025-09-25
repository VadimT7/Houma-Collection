# Stripe Payment Debug Guide

## 🚨 **Current Issue**

The payment form is not redirecting to order confirmation, and you're seeing these errors:
```
Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

## 🔍 **Debugging Steps**

### **Step 1: Check Browser Console**

Open Developer Tools (F12) and look for these logs when you click "Pay":

#### ✅ **Expected Success Flow:**
```
Payment form submitted!
Stripe object: [Stripe object]
Elements object: [Elements object]
Starting payment process with amount: 803
Card element: [CardElement object]
Creating payment intent with amount: 80300
API Response status: 200
API Response data: {clientSecret: "pi_..."}
Confirming payment with Stripe...
Stripe confirmation result: {error: null, paymentIntent: {...}}
Payment succeeded: {id: "pi_...", status: "succeeded"}
Payment success handler called with: {id: "pi_..."}
Redirecting to: /order-confirmation?payment_intent=pi_...
```

#### ❌ **Common Error Patterns:**

**1. Stripe Not Loading:**
```
Stripe object: null
Elements object: null
Stripe not loaded or elements not available
```

**2. API Error:**
```
API Response status: 500
API Error: Invalid API key provided
```

**3. Card Element Missing:**
```
Card element: null
Card element not found
```

**4. Payment Confirmation Error:**
```
Stripe confirmation result: {error: {...}, paymentIntent: null}
Payment failed: Your card was declined
```

### **Step 2: Test Stripe Configuration**

Go to: `http://localhost:3000/api/test-stripe`

Should return:
```json
{
  "publishableKeyExists": true,
  "secretKeyExists": true,
  "publishableKeyPrefix": "pk_test_51",
  "secretKeyPrefix": "sk_test_51"
}
```

### **Step 3: Test Order Confirmation**

Go to: `http://localhost:3000/test-confirmation`
Click "Test Order Confirmation Page"

This verifies the order confirmation page works independently.

## 🛠️ **Quick Fixes**

### **Fix 1: Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear localStorage: Open console and run `localStorage.clear()`

### **Fix 2: Check Environment Variables**
```bash
cat .env.local
```
Verify all Stripe keys are present and valid.

### **Fix 3: Restart Development Server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Fix 4: Test with Different Card**
Try these test cards:
- `4242 4242 4242 4242` (successful)
- `4000 0000 0000 0002` (declined)
- `4000 0025 0000 3155` (requires authentication)

## 🔧 **Advanced Debugging**

### **Check Network Tab**
1. Open Developer Tools → Network tab
2. Click "Pay" button
3. Look for:
   - `/api/create-payment-intent` request
   - Any failed requests (red status)
   - Response data

### **Check Stripe Dashboard**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Check "Payments" section
3. Look for any failed payment attempts

### **Test API Endpoint Directly**
```bash
curl -X POST http://localhost:3000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "usd"}'
```

## 🎯 **Most Likely Issues**

1. **Stripe Keys Invalid**: Check `.env.local` file
2. **Network Issues**: Check browser network tab
3. **Card Element Not Loading**: Check console for Stripe errors
4. **API Endpoint Error**: Check server console for errors

## 📞 **Next Steps**

1. **Run the debugging steps above**
2. **Check browser console** for specific error messages
3. **Test the API endpoint** directly
4. **Verify Stripe keys** are correct

Let me know what you find in the console logs, and I'll help fix the specific issue!



