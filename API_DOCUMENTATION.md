# Complete Backend Implementation Summary

## Overview
Full-stack multi-step onboarding and role-based RFQ workflow system with Procurement (Buyer), Supplier (Seller), and Admin roles.

---

## 🔐 **AUTHENTICATION FLOW**

### 1. Login with Email (Check if exists)
```
POST /api/auth/login/email
{
  "email": "user@example.com"
}
Response:
- User found → proceed to password
- User not found → redirect to signup
```

### 2. Login with Password
```
POST /api/auth/login/password
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
- Invalid credentials → increment attempts (max 5)
- After 5 attempts → suspend account
- Valid credentials → generate JWT token
- Check onboarding status → redirect accordingly
- Check account status (active/pending/rejected/suspended)
```

### 3. Social Login - Google
```
POST /api/auth/login/google
{
  "id_token": "google_token",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "profile_picture_url"
}
Response:
- New user → create account, redirect to role selection
- Existing user → login, redirect to dashboard (if approved)
```

### 4. Social Login - Apple
```
POST /api/auth/login/apple
{
  "identity_token": "apple_jwt_token", (optional if email/name provided for simulation)
  "email": "user@example.com",
  "name": "User Name"
}
Response:
- Decodes identity_token if provided to extract email
- New user → create account, status='registered', onboarding_step=0
- Existing user → login, returns JWT token
```

### 5. Role Selection (Buyer/Seller) - GATE 1
```
POST /api/auth/select-role
{
  "user_id": 1,
  "role": "buyer" | "seller"
}
Response:
- Role locked (cannot change later)
- Redirect to onboarding step 1
```

### 6. Register (Create Account)
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
Validation:
- Password min 8 chars
- Passwords must match
- Unique email
```

### 7. Forgot Password Flow
```
1. Request OTP: POST /api/auth/forgot-password
   { "email": "user@example.com" }
   Response: { "message": "Reset OTP sent to email" }

2. Verify OTP: POST /api/auth/verify-reset-otp
   { "email": "user@example.com", "otp": "123456" }
   Response: { "message": "OTP verified successfully" }

3. Reset Password: POST /api/auth/reset-password
   { 
     "email": "user@example.com", 
     "otp": "123456", 
     "new_password": "newpassword123", 
     "confirm_password": "newpassword123" 
   }
   Response: { "message": "Password reset successful" }
```

---

## 🏢 **MULTI-STEP ONBOARDING (7 STEPS + APPROVAL)**

### Step 1: Organization Data
```
POST /api/onboarding/organization
{
  "user_id": 1,
  "organization_type": "Private Company",
  "department": "Engineering",
  "country": "USA",
  "state": "California",
  "city": "San Francisco",
  "post_code": "94105"
}
Validation: country, organization_type required
Response: onboarding_step = 2
```

### Step 2A: Send OTP
```
POST /api/onboarding/send-otp
{
  "user_id": 1
}
Response:
- Generate 6-digit OTP
- Expiry: 10 minutes
- Send via email
```

### Step 2B: Verify OTP
```
POST /api/onboarding/verify-otp
{
  "user_id": 1,
  "otp": "123456"
}
Validation:
- OTP not expired
- OTP matches
- Max 3 attempts per OTP
Response: email_verified = true, onboarding_step = 3
```

### Step 3: Create User ID & Password
```
POST /api/onboarding/create-user
{
  "user_id": 1,
  "username": "john.doe",
  "password": "SecurePassword123",
  "confirm_password": "SecurePassword123"
}
Validation:
- Password min 8 chars
- Username unique
- Passwords match
Response: onboarding_step = 4
```

### Step 4: Organization Info
```
POST /api/onboarding/organization-info
{
  "user_id": 1,
  "full_address": "123 Main St, San Francisco, CA 94105",
  "website": "https://company.com",
  "authorized_contact": "John Doe",
  "contact_phone": "(555) 123-4567",
  "tax_registered": true,
  "tax_number": "12-3456789"
}
Validation:
- full_address required
- authorized_contact required
- If tax_registered=true, tax_number required
Response: onboarding_step = 5
```

### Step 5: Personal Info
```
POST /api/onboarding/personal-info
{
  "user_id": 1,
  "full_name": "John",
  "last_name": "Doe",
  "designation": "CEO",
  "national_id": "123-45-6789",
  "tax_id": "98-7654321"
}
Response: onboarding_step = 6
```

### Step 6A: Get Industry Codes
```
GET /api/onboarding/industry-codes
Response: List of all industry codes with descriptions
```

### Step 6B: Select Industry
```
POST /api/onboarding/select-industry
{
  "user_id": 1,
  "industry_codes": ["IND001", "IND002"]
}
Response: onboarding_step = 7
```

### Step 7: Payment Method
```
POST /api/onboarding/payment-method
{
  "user_id": 1,
  "method_type": "internet_banking" | "paypal" | "google_pay" | "other",
  "payment_identifier": "bank_account_number"
}
Response:
- onboarding_step = 8 (completed)
- status = pending_approval
- Admin notification sent
```

---

## 👤 **USER PROFILE ENDPOINTS (Protected)**

### Get Profile
```
GET /api/user/profile
Headers: Authorization: Bearer {token}
Response: User details + Organization + Personal info + Payment methods
```

### Logout
```
POST /api/user/logout
Headers: Authorization: Bearer {token}
Response: redirect_to_login
```

---

## 👨‍💼 **BUYER DASHBOARD (Protected + Approved)**
```
GET /api/buyer/dashboard
Headers: Authorization: Bearer {token}
Requires: role = buyer, status = active
Response:
- Dashboard metrics
- Pending RFQs
- Active suppliers count
- Available actions
```

---

## 👷 **SELLER DASHBOARD (Protected + Approved)**
```
GET /api/seller/dashboard
Headers: Authorization: Bearer {token}
Requires: role = seller, status = active
Response:
- Dashboard metrics
- Assigned RFQs
- Pending quotations
- Earnings
```

---

## 🛡️ **ADMIN APPROVAL ENDPOINTS (Admin Only)**

### Get Pending Users
```
GET /api/admin/pending-users
Headers: Authorization: Bearer {admin_token}
Requires: role = admin
Response: List of users in pending_approval state
```

### Get All Users
```
GET /api/admin/users
Requires: role = admin
Response: List of all users (excluding passwords)
```

### Get User for Review
```
GET /api/admin/user/:user_id
Requires: role = admin
Response: User + Organization + Personal info (full details)
```

### Approve User
```
PUT /api/admin/user/:user_id/approve
Requires: role = admin
Response:
- account_status = active
- Email sent: "Account Approved! Welcome"
```

### Reject User
```
PUT /api/admin/user/:user_id/reject
Requires: role = admin
Body: { "rejection_reason": "Missing tax documents" }
Response:
- account_status = rejected
- Email sent with rejection reason
- User can resubmit
```

### Suspend User
```
PUT /api/admin/user/:user_id/suspend
Requires: role = admin
Response: account_status = suspended
```

---

## 📋 **RFQ WORKFLOW (Procurement/Buyer)**

### Create RFQ
```
POST /api/procurement/rfq
Headers: Authorization: Bearer {buyer_token}
Requires: role = buyer
```

### Import BOM
```
POST /api/procurement/rfq/import-bom
Upload BOM file → Generate RFQ lines
```

### Assign Suppliers
```
POST /api/procurement/rfq/assign-suppliers
Assign multiple suppliers to RFQ
```

### Get RFQ Comparison
```
GET /api/procurement/rfq/:id/comparison
Compare supplier quotations side-by-side
```

### Select Supplier
```
PUT /api/procurement/rfq/:id/select-supplier
Select winning supplier for RFQ
```

### List RFQs by Status
```
GET /api/procurement/rfq/status?status=pending
Filter RFQs by status
```

---

## 🏭 **SUPPLIER RFQ WORKFLOW (Seller)**

### List Assigned RFQs
```
GET /api/supplier/rfq
Headers: Authorization: Bearer {supplier_token}
Requires: role = seller
Response: RFQs assigned to this supplier
```

### Get RFQ Details
```
GET /api/supplier/rfq/:id
View specific RFQ details
```

### Submit Quotation
```
POST /api/supplier/rfq/:id/quote
{
  "line_items": [
    { "line_number": 1, "unit_price": 100, "quantity": 10 }
  ],
  "delivery_date": "2026-03-31",
  "remarks": "As per your specifications"
}
```

### Update Quotation
```
PUT /api/supplier/rfq/:id/update-quote
Update submitted quotation (before deadline)
```

---

## 🏢 **SUPPLIER MASTER MANAGEMENT**

### Add Supplier
```
POST /api/supplier
Headers: Authorization: Bearer {buyer_token}
Requires: role = buyer
Body: Supplier details
```

### Edit Supplier
```
PUT /api/supplier/:id
Requires: role = buyer
```

### List Suppliers
```
GET /api/supplier
Available to: buyer, seller
Response: All approved suppliers
```

---

## 📊 **USER LIFECYCLE / STATE MACHINE**

```
registered
    ↓
role_selected (Buyer/Seller chosen)
    ↓
onboarding_in_progress (Steps 1-7)
    ↓
pending_approval (Awaiting admin review)
    ├→ APPROVED → active (Access dashboard)
    └→ REJECTED → Can resubmit
    └→ SUSPENDED (Multiple failed logins)
```

---

## 🔐 **SECURITY FEATURES**

✅ Password hashing (bcrypt)
✅ JWT token authentication
✅ Role-based access control (buyer/seller/admin)
✅ Login attempt tracking (max 5, then suspend)
✅ OTP expiration (10 minutes)
✅ OTP attempt limiting (max 3)
✅ Account status checks (pending/rejected/suspended)
✅ Onboarding step enforcement (no skipping)
✅ Email verification required
✅ Session status middleware

---

## 📧 **EMAIL NOTIFICATIONS**

- OTP sent on step 2
- Approval confirmation on admin approval
- Rejection reason on admin rejection
- Welcome email on account activation

---

## 🗄️ **DATABASE MODELS**

- **User** - Core user with role, status, onboarding tracking
- **Organization** - Basic org details (country, state, city, etc)
- **OrganizationInfo** - Full address, website, tax info
- **PersonalInfo** - Name, designation, ID info
- **IndustryCode** - Master industry codes
- **UserIndustry** - Many-to-many relationship
- **PaymentMethod** - Payment details for user
- **OTP** - Temporary OTP storage with expiry

---

## 🚀 **NEXT STEPS**

1. **Configure Environment Variables**
   - `JWT_SECRET`
   - `SENDGRID_API_KEY` or `NODEMAILER_CONFIG`
   - `DATABASE_URL`

2. **Set Up Email Service**
   - Integrate Sendgrid or Nodemailer
   - Configure email templates

3. **Social Login Integration**
   - Google OAuth
   - Apple Sign-In

4. **Database Associations**
   - Define foreign keys in models
   - Set up Sequelize associations

5. **Testing**
   - Test all endpoints with Postman
   - Test role-based access
   - Test onboarding flow end-to-end

---

## 📝 **NOTES**

- All protected endpoints require `Authorization: Bearer {token}` header
- Status checks prevent access to unapproved accounts
- Onboarding is sequential - cannot skip steps
- Role is locked after selection - cannot be changed
- Admin role is manually set in database
