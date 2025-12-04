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

Go to Project Settings → Environment Variables and add:

```
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://kuacpgsfwlxdvmbhbcet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1YWNwZ3Nmd2x4ZHZtYmhiY2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjIyMjQsImV4cCI6MjA3NTY5ODIyNH0.gQceGudRKBLfiC3BVZTAmRrDa-OJK4Z851UHutBHI1I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1YWNwZ3Nmd2x4ZHZtYmhiY2V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDEyMjIyNCwiZXhwIjoyMDc1Njk4MjI0fQ.sdKqX38C1DJzmrdXABI1XutQDG2ofZB14QZBk3cKxKw

# Inlomax API (REQUIRED)
INLOMAX_API_KEY=vp5sh8evbcxcf81r3wrrbm0p26y5xl9r8yw4eatl
INLOMAX_SANDBOX=true

# Flutterwave (REQUIRED for payments)
# For production, get LIVE keys from Flutterwave dashboard
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-ffdcb5a0eddc39635b932714c21f3985-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-734645e90a07c84695b42e0cf46a8e33-X
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret_here

# NextAuth
NEXTAUTH_URL=https://tadavtu.com
NEXTAUTH_SECRET=generate_a_random_32_char_string_here
```

**Important:** Generate a secure NEXTAUTH_SECRET using:
```bash
openssl rand -base64 32
```

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
