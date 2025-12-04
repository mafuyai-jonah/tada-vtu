# TADA VTU Deployment Guide

## Domain: tadavtu.com

---

## Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
cd tada-vtu
git init
git add .
git commit -m "Initial commit - TADA VTU"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tada-vtu.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your GitHub repository (tada-vtu)
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: **tada-vtu** (if your repo has the parent folder)
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

## Step 3: Add Environment Variables in Vercel

Go to Project Settings → Environment Variables and add all variables from your `.env.local` file:

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Inlomax API (REQUIRED)
INLOMAX_API_KEY=your_inlomax_api_key
INLOMAX_SANDBOX=true

# Flutterwave (REQUIRED for payments)
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret

# NextAuth
NEXTAUTH_URL=https://tadavtu.com
NEXTAUTH_SECRET=generate_a_random_32_char_string
```

**Important:** 
- Copy the actual values from your `.env.local` file
- Generate a secure NEXTAUTH_SECRET using: `openssl rand -base64 32`
- NEVER commit real API keys to GitHub!

---

## Step 4: Connect Domain (tadavtu.com)

### In Vercel:
1. Go to Project Settings → Domains
2. Add `tadavtu.com`
3. Add `www.tadavtu.com`
4. Vercel will show you DNS records to add

### In Hostinger DNS Settings:
Add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Wait 5-30 minutes for DNS propagation.

---

## Step 5: Configure Supabase for Production

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add these URLs:
   - Site URL: `https://tadavtu.com`
   - Redirect URLs:
     - `https://tadavtu.com/**`
     - `https://www.tadavtu.com/**`

---

## Step 6: Configure Flutterwave Webhook

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Add webhook URL: `https://tadavtu.com/api/flutterwave/webhook`
3. Copy the webhook secret and update `FLUTTERWAVE_WEBHOOK_SECRET` in Vercel

---

## Step 7: Go Live Checklist

Before going live with real transactions:

- [ ] Switch Flutterwave to LIVE keys (not TEST)
- [ ] Set `INLOMAX_SANDBOX=false` in Vercel env vars
- [ ] Test a small real transaction
- [ ] Verify webhook is receiving payment confirmations
- [ ] Create your admin account in Supabase `admins` table

---

## Create Admin Account

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
  'your-email@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  'Your Name',
  'super_admin',
  true
);
```

Then login at: `https://tadavtu.com/admin/login`

---

## Troubleshooting

### Build Errors
- Check Vercel build logs
- Ensure all env vars are set

### Auth Issues
- Verify Supabase URL configuration
- Check redirect URLs in Supabase

### Payment Issues
- Verify Flutterwave keys are correct
- Check webhook URL is accessible

---

## Support

For issues, check:
- Vercel deployment logs
- Browser console for errors
- Supabase logs
