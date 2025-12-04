# TADA VTU Production Checklist

## 📊 Pricing & Profit Summary

### Your Profit Margins:

| Service | Your Cost | Selling Price | Profit |
|---------|-----------|---------------|--------|
| **Airtime ₦1000** | ₦980 (2% discount) | ₦1000 | ₦20 (2%) |
| **Data 1GB SME** | ~₦265 | ₦280 | ₦15 |
| **Data 5GB SME** | ~₦1325 | ₦1370 | ₦45 |
| **Data 10GB** | ~₦2650 | ₦2720 | ₦70 |
| **DSTV Compact** | ₦12,500 | ₦12,600 | ₦100 |
| **GOTV Max** | ₦5,700 | ₦5,800 | ₦100 |
| **Electricity ₦5000** | ₦5,000 | ₦5,050 | ₦50 |
| **Betting ₦10000** | ₦10,000 | ₦10,030 | ₦30 |

### Estimated Monthly Revenue:
- 50 transactions/day × ₦35 avg profit = ₦1,750/day
- Monthly: **₦52,500**
- 100 transactions/day = **₦105,000/month**
- 200 transactions/day = **₦210,000/month**

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables (Vercel)
Copy all values from your `.env.local` file to Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
INLOMAX_API_KEY=your_inlomax_api_key
INLOMAX_SANDBOX=true  # Change to false when ready for real transactions
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret
NEXTAUTH_URL=https://tadavtu.com
NEXTAUTH_SECRET=generate_random_32_chars
```
**NEVER commit real API keys to GitHub!**

### 2. Supabase Configuration
- [ ] Add `https://tadavtu.com` to Site URL
- [ ] Add redirect URLs:
  - `https://tadavtu.com/**`
  - `https://www.tadavtu.com/**`

### 3. Flutterwave Setup
- [ ] Get LIVE API keys (not TEST)
- [ ] Add webhook URL: `https://tadavtu.com/api/flutterwave/webhook`
- [ ] Copy webhook secret to Vercel env vars

### 4. Domain Setup (Hostinger)
Add DNS records:
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 5. Create Admin Account
Run in Supabase SQL Editor:
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

---

## 🚀 Go-Live Steps

### Phase 1: Test Mode (First Week)
1. Deploy with `INLOMAX_SANDBOX=true`
2. Use Flutterwave TEST keys
3. Test all flows with fake data
4. Verify transactions are recorded

### Phase 2: Soft Launch
1. Switch to Flutterwave LIVE keys
2. Keep `INLOMAX_SANDBOX=true`
3. Test real payments (small amounts)
4. Verify wallet credits work

### Phase 3: Full Launch
1. Set `INLOMAX_SANDBOX=false`
2. Test one real airtime purchase (₦50)
3. Test one real data purchase
4. Monitor for errors

---

## 🔒 Security Checklist

- [ ] All API keys are in Vercel env vars (not in code)
- [ ] Admin password is strong
- [ ] Webhook secret is configured
- [ ] HTTPS is enabled (automatic with Vercel)

---

## 📱 Post-Launch

### Monitor Daily:
- Vercel deployment logs
- Supabase database (transactions table)
- Flutterwave dashboard (payments)
- Inlomax dashboard (API balance)

### Keep Funded:
- Inlomax wallet (for VTU services)
- Monitor balance daily

---

## 💰 Cost Breakdown

### Fixed Costs:
- Domain (Hostinger): ~₦5,000/year
- Vercel: Free (hobby plan)
- Supabase: Free (up to 500MB)

### Variable Costs:
- Flutterwave fees: 1.4% per transaction (capped at ₦2,000)
- Inlomax: Pay as you go (fund wallet)

### Break-even:
With ₦35 average profit per transaction:
- 150 transactions = ₦5,250 (covers domain cost)
- After that, pure profit!
