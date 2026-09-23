# 🌾 KrushiSetu (કૃષિસેતુ / कृषिसेतु)
### *“Know the price. Choose the market. Sell with confidence.”*
### *“ભાવ જાણો. માર્કેટ પસંદ કરો. વિશ્વાસ સાથે વેચો.”*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-brightgreen.svg)](https://www.sih.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Agriculture%2C%20FoodTech%20%26%20Rural%20Development-orange.svg)]()
[![Organization](https://img.shields.io/badge/Organization-Government%20of%20Gujarat-blue.svg)]()
[![PS ID](https://img.shields.io/badge/Problem%20Statement%20ID-26132-teal.svg)]()

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** 26132  
> **Title:** Strengthening market linkages and price discovery for farmers  
> **State Context:** Government of Gujarat (Saurashtra, North & Central Gujarat Clusters)  
> **Theme:** Agriculture, FoodTech & Rural Development  

---

## 🌟 Executive Summary

**KrushiSetu** is an intelligent, trilingual 3D Web agricultural transaction and price-discovery ecosystem designed for smallholders, Farmer Producer Organizations (FPOs), and verified buyers across **Gujarat** (Gondal, Rajkot, Surat, Ahmedabad, Unjha, Mahuva, Bhavnagar, Mehsana, Anand).

By bridging information asymmetry, providing deterministic arrival/price forecasting, and coordinating pooled transport and WDRA cold storage, KrushiSetu empowers farmers to unlock the highest net realization for their produce.

---

## 🎯 Problem It Solves

Farmers across Gujarat often face:
1. **Opaque APMC Mandi & Buyer Prices:** Limited visibility into spot APMC rates (Gondal, Mahuva, Unjha, Rajkot) vs. direct corporate buyer offers (Balaji, Jivraj Agro, Amul, Adani Wilmar).
2. **Distress Selling:** Lack of predictive insights on 7-day arrival pressure and optimal sale windows.
3. **High Logistics & Intermediary Costs:** Fragmented smallholder lots leading to prohibitive individual freight costs.
4. **Counterparty & Payment Risk:** Lack of verifiable buyer creditworthiness and transparent escrow milestones.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Interactive 3D Agro Ecosystem** | WebGL canvas procedurally built with Three.js & React Three Fiber demonstrating Gujarat farm-to-hub dynamics, logistics vehicle spline routing, and live price indicators. |
| **Role-Based Workflows** | Seamless switching between **Farmer/FPO** and **Corporate Buyer** perspectives without requiring login barriers. |
| **Transparent Price Discovery** | Real-time comparison across 6 commodities (**Onion, Cotton, Groundnut, Cumin, Wheat, Tomato**) and 6 key Gujarat markets (**Gondal, Rajkot, Surat, Ahmedabad, Unjha, Mahuva**) with net realization calculators. |
| **Deterministic Price & Demand Forecast** | Predictive engine factoring arrivals, APMC arrivals pressure, historical seasonality, and institutional procurement signals. |
| **Produce Lot Creation Wizard** | Step-by-step lot listing with automatic Lot ID generation, quality grading, and `localStorage` demo persistence. |
| **Verified Buyer Marketplace** | Direct matching with corporate buyers (**Balaji, Jivraj Agro, Amul, GUJCOMASOL, Adani Wilmar**) with trust scores and payment ratings. |
| **Net Realization Comparison** | Granular breakdown of gross offer, APMC commission, transport deduction, storage fees, and net farmer payout. |
| **Pooled Logistics Optimizer** | Multi-point farm pickup route planning across Saurashtra clusters with animated vehicle dispatch and shared freight savings calculations (₹1.60/kg). |
| **WDRA Cold Storage Advisor** | "Sell Today" vs. "Store & Sell in 3 Days" financial comparison in GWC / Mahuva facilities to prevent distress selling. |
| **6-Milestone Escrow Clearing Tracker** | Transparent payment milestones from lot inspection to final bank credit. |
| **Dispute & Grievance Arbitration** | Form with unique grievance ticketing and SLA tracking for quality disputes. |
| **Trilingual Localization** | Instant toggle between **English**, **हिंदी (Hindi)**, and **ગુજરાતી (Gujarati)** (Marathi removed). |

---

## 🛠️ Free & Open-Source Technology Stack

- **Frontend Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **3D Graphics & WebGL:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation & Transitions:** [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), Lucide React Icons
- **Typography:** Noto Sans Gujarati, Plus Jakarta Sans, Outfit
- **Data Persistence:** Local JSON mock models + browser `localStorage`

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation & Execution

1. **Clone or Navigate to the Project Directory:**
   ```bash
   cd farmer_project
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/` (or the port specified in terminal).

4. **Production Build & Verification:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🎬 10-Step Hackathon Demonstration Script

For jury evaluation and presentations:

1. **Explore the 3D Hero Ecosystem:** Rotate the floating circular Gujarat farm model, inspect the moving electric cargo vehicle, and view floating price badges (e.g. *Gondal APMC · ₹2,920/qtl*, *Ahmedabad Buyer Demand · High*).
2. **Switch Roles / Languages:** Toggle between English, Hindi, and **ગુજરાતી (Gujarati)** in the navigation bar. Notice the instant native localization.
3. **Compare Market Prices:** Navigate to **Price Discovery Matrix**, select *Onion* and *Gondal*, and view the net realization callout showing higher returns from institutional buyers.
4. **Analyze Price Forecast:** Open **Price & Demand Forecast Engine** to review the 7-day arrival pressure and recommended sale window across Rajkot, Bhavnagar, and Ahmedabad.
5. **Create a Farmer Produce Lot:** Click **"List New Produce Lot"**, enter 100 Quintals of Grade A Mahuva/Gondal Red Onion from Rajkot, and submit to see the animated celebration and dashboard addition.
6. **Browse Verified Buyers:** Visit **Verified Buyer Marketplace**, filter by *Rajkot* or *Bhavnagar*, and click **"Compare Net Value"**.
7. **Transparent Deductions Breakdown:** In the modal, examine the detailed comparison between gross price, transport costs, and final farmer net payout.
8. **Optimize Pooled Freight:** In **Pooled Route Logistics**, click **"Optimize Route & Calculate Savings"** to see route sequencing and ₹20,020 in shared transport savings.
9. **Cold Storage Decision:** In **WDRA Storage Advisor**, compare *Sell Today* vs. *Store in GWC Cold Storage* to see net economic gain.
10. **Track Escrow & Lodge Grievance:** Review the 6-milestone payment timeline and submit a test query in the **Dispute & Grievance Portal** to receive an instant case ID.

---

## 🗄️ MongoDB Atlas Architecture & Production Setup Guide

KrushiSetu utilizes **MongoDB Atlas** as the single source of truth for all permanent platform data, eliminating reliance on transient browser storage or Supabase.

### 1. MongoDB Atlas Cluster Provisioning
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new organization and project (e.g. `KrushiSetu-Gujarat`).
3. Deploy a cluster:
   - **M0 Sandbox (Free Tier)** for staging/testing or **M10+ Dedicated Cluster** for production.
   - Select cloud provider (AWS / Google Cloud / Azure) and choose a region close to your primary users (e.g. `ap-south-1` Mumbai).
4. Create a Database User:
   - Go to **Security → Database Access → Add New Database User**.
   - Choose **Built-in Role: `readWriteAnyDatabase`** (or `readWrite` on `krishisetu`).
   - Use a cryptographically random, strong password.
5. Configure IP Access List:
   - Go to **Security → Network Access → Add IP Address**.
   - For global server hosting (Vercel, Render, Railway, AWS EC2), add `0.0.0.0/0` (Allow Access from Anywhere) or whitelist your specific server egress IPs.

### 2. Connection String & Server Environment Variables
Obtain your SRV connection URI from **Database → Connect → Drivers (Node.js)**:
```text
mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/krishisetu?retryWrites=true&w=majority&appName=KrushiSetu
```

Set server environment variables in your deployment dashboard or root `.env` file (never commit production credentials):
```env
# Server Database Connection (SERVER-SIDE ONLY - NEVER prefix with VITE_)
MONGODB_URI=mongodb+srv://krishisetu_admin:YourSecurePassword@cluster0.abcde.mongodb.net/krishisetu?retryWrites=true&w=majority

# JWT & Authentication Secret
JWT_SECRET=your_production_secure_jwt_secret_key_min_32_chars

# Official MSAMB / GSAMB Admin Credentials (SERVER-SIDE ONLY)
ADMIN_PHONE=9274288006
ADMIN_PASSWORD=your_secure_admin_password
```

> [!IMPORTANT]
> In production environments (`NODE_ENV=production`), the backend strictly enforces the presence of `MONGODB_URI`. The server refuses to boot and halts immediately if this environment variable is omitted, preventing accidental fallback to ephemeral local databases.

### 3. Database Health Monitoring
Verify your connection status via the automated health check endpoint:
```bash
curl http://localhost:3001/api/health
```
- **HTTP 200 (Online):** Database successfully connected and pinged.
- **HTTP 503 (Degraded):** Database connection failed or unavailable. Credential details and internal connection strings are strictly redacted from public response payloads.

### 4. Migration from Supabase / LocalStorage
If transitioning historical demo data into MongoDB Atlas:
1. Ensure your MongoDB Atlas cluster is reachable and `MONGODB_URI` is populated.
2. Run the migration script:
   ```bash
   npx ts-node scripts/migrateSupabaseToMongo.ts
   ```
3. The script migrates:
   - User profiles & role collections (`FarmerProfile`, `BuyerProfile`)
   - Produce listings with multilingual fields
   - Product catalog crops and market benchmark rates
   - Verifications, deals, and audit trail logs
4. Supabase integration files (`src/services/supabaseClient.ts`) remain preserved in the codebase for reference and are annotated with `@deprecated`.

### 5. Automated Backups & Disaster Recovery
- **Continuous Cloud Backups:** Enable MongoDB Atlas Cloud Backups with point-in-time recovery (PITR) within your Atlas dashboard under **Database → Backup**.
- **CLI Dump & Restore:**
  ```bash
  # Create full encrypted database backup
  mongodump --uri="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/krishisetu" --out="./backups/$(date +%Y%m%d)"

  # Restore backup archive into cluster
  mongorestore --uri="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/krishisetu" "./backups/20260918/krishisetu"
  ```

---

## 🔐 Registration & Role Authentication Flows

1. **Mandatory Registration Before Login:**
   - Unregistered phone numbers attempting to request OTP for login are rejected with `ACCOUNT_NOT_FOUND` ("No account found. Please register first.").
   - New users click **"New user? Register"** to complete mobile, full name, role selection, district, and village details before receiving verification OTP.
2. **Distinct Role Portals:**
   - **Farmer Portal:** Lot creation, crop approval requests, buyer offer acceptance, cold storage planning.
   - **Buyer Portal:** Marketplace browsing, corporate bulk orders, bid offers, escrow funding.
   - **Admin Portal:** MSAMB KYC queue, produce grading verification, and custom crop review approval.
3. **Dynamic Crop Registration:**
   - When a farmer types an unlisted crop (e.g. *Banana*, *Guava*, *Papaya*), KrushiSetu prompts: *"{crop} is not in the directory. Add this crop."*
   - Farmers can submit bilingual names, category, variety, benchmark price, and notes. The crop is created with `status: 'pending'` and can be immediately listed under a *"Pending crop approval"* badge.
   - Admin reviews, calibrates official APMC benchmark rates, and approves or rejects with reason from the **Crop Approvals** dashboard.

---

## 📄 License
This project is open-source and free for educational and hackathon demonstration purposes under the [MIT License](LICENSE).
