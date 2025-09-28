# Stripe Product Sync Guide for HOUMA Website

## Overview
The HOUMA website is now fully synced with your Stripe product catalog. Any product changes made in Stripe will automatically appear on the website.

## How It Works

### Real-time Sync
1. **Products are fetched from Stripe** when users visit the website
2. **Webhooks notify the site** when products are created, updated, or deleted in Stripe
3. **Products are cached for 5 minutes** to improve performance
4. **Stripe is the single source of truth** - no manual product updates needed on the website

### Product Management in Stripe

#### Creating a Product
1. Go to your Stripe Dashboard → Products
2. Click "Add Product"
3. Fill in the required fields:
   - **Name**: Product name (e.g., "MEDINA HOODIE")
   - **Description**: Product description
   - **Price**: Set the default price
   - **Images**: Upload product images (they'll display on the site)

#### Required Metadata Fields
For products to display correctly with all features, add these metadata fields:

| Field | Description | Example |
|-------|-------------|---------|
| `category` | Product category for filtering | `Hoodies`, `Jackets`, `Pants`, etc. |
| `collection` | Product collection for filtering | `Heritage Collection`, `Signature Line`, etc. |
| `sizes` | JSON array of available sizes | `["S", "M", "L", "XL"]` |
| `colors` | JSON array of available colors | `["Black", "White", "Grey"]` |
| `featured` | Whether product is featured | `true` or `false` |
| `inStock` | Stock availability | `true` or `false` |
| `culturalStory` | Optional cultural narrative | Any text describing the cultural inspiration |

#### Example Metadata Setup
```json
{
  "category": "Hoodies",
  "collection": "Heritage Collection",
  "sizes": "[\"S\", \"M\", \"L\", \"XL\"]",
  "colors": "[\"Midnight Black\", \"Desert Sand\"]",
  "featured": "true",
  "inStock": "true",
  "culturalStory": "Inspired by ancient medinas..."
}
```

### Updating Products
1. Make changes in Stripe Dashboard
2. Changes appear on the website immediately (or within 5 minutes if cached)
3. No code changes or deployments needed

### Deleting Products
1. Archive or delete the product in Stripe
2. Product automatically disappears from the website

## Setting Up Sample Products

Run the included script to create sample products in Stripe:

```bash
# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Install Stripe SDK if needed
npm install stripe

# Run the setup script
node scripts/setup-stripe-products.js
```

## Webhook Configuration

### Required Webhook Events
Make sure these events are enabled in your Stripe webhook settings:
- `product.created`
- `product.updated`
- `product.deleted`
- `price.created`
- `price.updated`
- `price.deleted`

### Webhook Endpoint
Your webhook endpoint is: `https://your-domain.com/api/webhook`

## Filter System

The website filters work automatically based on metadata:

### Categories Filter
- Automatically populated from all unique `category` values
- Products without a category appear as "Uncategorized"

### Collections Filter
- Automatically populated from all unique `collection` values
- Products without a collection appear as "General"

### Featured Products
- Products with `featured: "true"` metadata appear in featured sections
- Used on homepage and highlighted in shop

### Stock Status
- Products with `inStock: "false"` show as "Out of Stock"
- Add to cart is disabled for out-of-stock items

## Best Practices

### Image Management
- Upload high-quality images directly to Stripe Dashboard
- Images are automatically served from Stripe's CDN
- First image is used as the primary product image
- Multiple images create a gallery on product pages
- Supported formats: JPG, PNG, WebP
- Recommended size: 1200x1200px or larger

### Pricing
- Set prices in Stripe using the default currency
- Prices are automatically formatted on the website
- Use cents (e.g., 28000 for $280.00)

### Metadata Consistency
- Keep category and collection names consistent
- Use the same spelling and capitalization
- This ensures filters group products correctly

## Troubleshooting

### Products Not Showing
1. Check that products are active in Stripe
2. Verify products have a default price set
3. Check browser console for API errors
4. Ensure environment variables are set correctly

### Filters Not Working
1. Verify metadata fields are spelled correctly
2. Check that JSON arrays are properly formatted
3. Ensure metadata keys match exactly (case-sensitive)

### Webhook Issues
1. Verify webhook secret is correct
2. Check webhook logs in Stripe Dashboard
3. Ensure webhook endpoint is accessible
4. Look for errors in server logs

### Image Display Issues
1. Check that images are uploaded to Stripe (not just referenced)
2. Verify Next.js config includes `files.stripe.com` domain
3. Check browser console for image loading errors
4. Ensure images are in supported formats (JPG, PNG, WebP)
5. Try refreshing the page or clearing browser cache

## Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Support

For issues or questions:
1. Check Stripe Dashboard logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Ensure webhook events are configured correctly
