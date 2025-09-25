# Payment System Fix & Testing Guide

## 🔍 **Debugging Steps**

### 1. **Test Stripe Configuration**
Go to: `http://localhost:3000/api/test-stripe`

You should see:
```json
{
  "publishableKeyExists": true,
  "secretKeyExists": true,
  "publishableKeyPrefix": "pk_test_51",
  "secretKeyPrefix": "sk_test_51",
  "message": "Stripe configuration check"
}
```

### 2. **Test Order Confirmation Page**
Go to: `http://localhost:3000/test-confirmation`
Click "Test Order Confirmation Page"

This will verify the order confirmation page works independently.

### 3. **Full Payment Flow Test**

1. **Add items to cart**: `http://localhost:3000/shop`
2. **Go to checkout**: Click cart icon → "Checkout"
3. **Fill shipping info**:
   - Email: test@example.com
   - Name: Test User
   - Address: 123 Test St
   - City: Test City
   - Postal: 12345
   - Country: United States
   - Phone: 555-1234
4. **Click "Continue"** to go to payment
5. **Enter test card**:
   - Number: `4242 4242 4242 4242`
   - Expiry: 12/25
   - CVC: 123
6. **Click "Pay"**

## 📊 **Console Logs to Check**

Open browser console (F12) and look for:

### ✅ **Expected Success Flow:**
```
Payment form submitted!
Starting payment process with amount: 80300
Creating payment intent with amount: 80300
API Response status: 200
API Response data: {clientSecret: "pi_..."}
Payment succeeded: {id: "pi_...", status: "succeeded"}
Payment success handler called with: {id: "pi_..."}
Redirecting to: /order-confirmation?payment_intent=pi_...
```

### ❌ **Common Errors & Solutions:**

#### **Error: "Invalid API Key"**
```
API Response status: 401
API Error: Invalid API key provided
```
**Solution**: Check your `.env.local` file has correct Stripe keys

#### **Error: "Network error"**
```
API Response status: 500
```
**Solution**: Check server console for detailed error

#### **Error: "Card declined"**
```
Payment failed: Your card was declined
```
**Solution**: Use test card `4242 4242 4242 4242`

## 🛠️ **Quick Fixes**

### **If checkout page is empty:**

1. **Check cart has items**
   - Go to `/shop` and add items
   - Verify cart badge shows count

2. **Check console for errors**
   - Look for React errors
   - Check network tab for failed requests

3. **Hard refresh**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

### **If payment doesn't redirect:**

1. **Check console logs**
   - Look for "Payment succeeded" message
   - Check for "Redirecting to:" log

2. **Manually test order confirmation**
   - Go to: `/order-confirmation?payment_intent=test123`
   - Should show the confirmation page

## 🎯 **Test URLs**

- **Shop**: http://localhost:3000/shop
- **Cart**: http://localhost:3000/cart (if exists)
- **Checkout**: http://localhost:3000/checkout
- **Test Confirmation**: http://localhost:3000/test-confirmation
- **Order Confirmation**: http://localhost:3000/order-confirmation?payment_intent=test
- **API Test**: http://localhost:3000/api/test-stripe

## 💡 **Pro Tips**

1. **Always use test mode** during development
2. **Check both browser and server console** for errors
3. **Use the Network tab** to inspect API calls
4. **Clear localStorage** if cart issues persist: 
   ```javascript
   localStorage.clear()
   ```

## 🚨 **Emergency Fixes**

If nothing works:

1. **Restart the server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check environment variables**:
   ```bash
   cat .env.local
   ```
   Make sure all keys are present and valid

## ✅ **Success Indicators**

You know it's working when:
1. Checkout page shows shipping form
2. Payment form shows Stripe card element
3. Console shows payment success logs
4. Redirects to order confirmation
5. Order confirmation shows payment ID
6. Toast notification shows "Payment successful!"

---

**Remember**: The payment system uses Stripe's test mode, so no real charges will occur. Always use test card numbers during development!
