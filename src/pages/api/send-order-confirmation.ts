import { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  name: string
  quantity: number
  price: number
  size: string
  color: string
  image?: string
}

interface OrderDetails {
  orderNumber: string
  paymentIntentId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    address: string
    apartment?: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'HOUMA-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate a placeholder SVG as base64 for email compatibility
function generatePlaceholderSVG(letter: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a1a"/>
        <stop offset="100%" style="stop-color:#2d2d2d"/>
      </linearGradient>
    </defs>
    <rect width="70" height="70" rx="8" fill="url(#bg)"/>
    <text x="35" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#C9A227" text-anchor="middle">${letter}</text>
  </svg>`
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function generateEmailHTML(order: OrderDetails): string {
  const itemsHTML = order.items.map(item => {
    // Use actual product image if available (must be absolute URL), otherwise show placeholder
    const hasValidImage = item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))
    const imageSrc = hasValidImage ? item.image : generatePlaceholderSVG(item.name.charAt(0))
    
    return `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="80" style="vertical-align: top;">
              <img src="${imageSrc}" alt="${item.name}" width="70" height="70" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover; display: block;" />
            </td>
            <td style="vertical-align: top; padding-left: 16px;">
              <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #FAFAF8; letter-spacing: 0.5px;">${item.name}</p>
              <p style="margin: 0; font-size: 13px; color: #888888;">${item.color} / ${item.size} / Qty: ${item.quantity}</p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #C9A227;">${formatPrice(item.price * item.quantity)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `}).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - HOUMA</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #C9A227;">
              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 12px 24px; border: 2px solid #C9A227; border-radius: 4px;">
                      <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #C9A227; text-transform: uppercase;">HOUMA</span>
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 11px; letter-spacing: 4px; color: #888888; text-transform: uppercase;">Luxury Streetwear • Heritage Culture</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 50px 40px 30px 40px; text-align: center;">
              <!-- Checkmark Icon -->
              <div style="width: 80px; height: 80px; margin: 0 auto 24px auto; background: linear-gradient(135deg, #C9A227 0%, #e8c547 100%); border-radius: 50%; display: inline-block;">
                <table cellpadding="0" cellspacing="0" border="0" width="80" height="80">
                  <tr>
                    <td align="center" valign="middle">
                      <span style="font-size: 40px; color: #0a0a0a;">✓</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 300; letter-spacing: 6px; color: #FAFAF8; text-transform: uppercase;">Order Confirmed</h1>
              <p style="margin: 0; font-size: 15px; color: #888888; line-height: 1.6;">
                Welcome to the HOUMA family. Your order is being prepared with care.
              </p>
            </td>
          </tr>

          <!-- Order Info Cards -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 12px; padding: 24px; border: 1px solid #2a2a2a;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 12px;">
                          <p style="margin: 0 0 4px 0; font-size: 10px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Order Number</p>
                          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #FAFAF8; word-break: break-all;">${order.orderNumber}</p>
                        </td>
                        <td width="50%" style="padding-left: 12px; border-left: 1px solid #2a2a2a;">
                          <p style="margin: 0 0 4px 0; font-size: 10px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Status</p>
                          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #4ade80;">● Confirmed</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Time -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 12px; padding: 24px; border: 1px solid #2a2a2a;">
                    <p style="margin: 0 0 12px 0; font-size: 10px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Estimated Delivery</p>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="50%">
                          <p style="margin: 0; font-size: 14px; color: #FAFAF8;">🇨🇦 Canada</p>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #888888;">2-6 business days</p>
                        </td>
                        <td width="50%">
                          <p style="margin: 0; font-size: 14px; color: #FAFAF8;">🌍 International</p>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #888888;">5-10 business days</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 10px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Order Items</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 12px; padding: 8px 16px; border: 1px solid #2a2a2a;">
                ${itemsHTML}
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 12px; padding: 24px; border: 1px solid #2a2a2a;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 14px; color: #888888;">Subtotal</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="font-size: 14px; color: #FAFAF8;">${formatPrice(order.subtotal)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 14px; color: #888888;">Shipping</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="font-size: 14px; color: #FAFAF8;">${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 14px; color: #888888;">Tax (14.975%)</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="font-size: 14px; color: #FAFAF8;">${formatPrice(order.tax)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 16px; border-top: 1px solid #2a2a2a;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td>
                                <span style="font-size: 18px; font-weight: 600; color: #FAFAF8;">Total</span>
                              </td>
                              <td style="text-align: right;">
                                <span style="font-size: 22px; font-weight: 700; color: #C9A227;">${formatPrice(order.total)}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 10px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Shipping To</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 12px; padding: 24px; border: 1px solid #2a2a2a;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #FAFAF8;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                    <p style="margin: 0; font-size: 14px; color: #888888; line-height: 1.6;">
                      ${order.shippingAddress.address}<br>
                      ${order.shippingAddress.apartment ? order.shippingAddress.apartment + '<br>' : ''}
                      ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                      ${order.shippingAddress.country}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cultural Quote -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, #C9A227 0%, #a8861e 100%); border-radius: 12px; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 24px; color: #0a0a0a;">القوة في التراث</p>
                    <p style="margin: 0; font-size: 12px; letter-spacing: 3px; color: #0a0a0a; text-transform: uppercase;">Strength in Heritage</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://houma.com/shop" style="display: inline-block; background: transparent; border: 2px solid #C9A227; color: #C9A227; text-decoration: none; padding: 16px 40px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; border-radius: 4px;">
                Continue Shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); padding: 30px 40px; border-top: 1px solid #2a2a2a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 16px 0; font-size: 11px; letter-spacing: 2px; color: #C9A227; text-transform: uppercase;">Follow Us</p>
                    <p style="margin: 0 0 20px 0;">
                      <a href="#" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Instagram</a>
                      <a href="#" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Twitter</a>
                      <a href="#" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Facebook</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #555555; line-height: 1.6;">
                      © ${new Date().getFullYear()} HOUMA. All rights reserved.<br>
                      Luxury streetwear rooted in North African culture.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, orderDetails } = req.body as {
      email: string
      orderDetails: Omit<OrderDetails, 'orderNumber'> & { orderNumber?: string }
    }

    if (!email || !orderDetails) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Generate order number if not provided
    const orderNumber = orderDetails.orderNumber || generateOrderNumber()

    const fullOrderDetails: OrderDetails = {
      ...orderDetails,
      orderNumber,
    }

    const emailHTML = generateEmailHTML(fullOrderDetails)

    const { data, error } = await resend.emails.send({
      from: 'HOUMA <onboarding@resend.dev>',
      to: email,
      subject: `Order Confirmed - ${orderNumber} | HOUMA`,
      html: emailHTML,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email', details: error })
    }

    console.log('Email sent successfully:', data)
    return res.status(200).json({ 
      success: true, 
      orderNumber,
      emailId: data?.id 
    })
  } catch (error: any) {
    console.error('Email sending error:', error)
    return res.status(500).json({ error: 'Failed to send email', details: error.message })
  }
}

