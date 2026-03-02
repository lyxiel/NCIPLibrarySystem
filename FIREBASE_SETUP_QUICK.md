# Quick Firebase User Setup Guide

## STEP 1: Create Users in Firebase Authentication

1. Go to: https://console.firebase.google.com/
2. Select project: **nciplibrarysystem**
3. Click **Authentication** → **Users** → **Add User**

Create these 3 users and **COPY each UID**:

| Email | Password | Role |
|-------|----------|------|
| admin@ncip.gov.ph | admin123 | admin |
| staff@ncip.gov.ph | staff123 | staff |
| user@ncip.gov.ph | user123 | user |

---

## STEP 2: Create Firestore User Documents

1. Click **Firestore Database** → **Create Database** (if needed)
   - Choose "Test Mode" → Enable
2. Click **Start Collection**
3. Collection ID: `users`

### For ADMIN user:
- Document ID: `[PASTE THE ADMIN UID HERE]`
- Add these fields:
  ```
  email: "admin@ncip.gov.ph" (string)
  role: "admin" (string)
  displayName: "Administrator" (string)
  active: true (boolean)
  ```

### For STAFF user:
- Document ID: `[PASTE THE STAFF UID HERE]`
  ```
  email: "staff@ncip.gov.ph" (string)
  role: "staff" (string)
  displayName: "Library Staff" (string)
  active: true (boolean)
  ```

### For USER:
- Document ID: `[PASTE THE USER UID HERE]`
  ```
  email: "user@ncip.gov.ph" (string)
  role: "user" (string)
  displayName: "Regular User" (string)
  active: true (boolean)
  ```

---

## STEP 3: Update Firestore Security Rules

1. **Firestore Database** → **Rules** tab
2. Paste this (TEMPORARY - for testing only):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

---

## DONE! ✅

Now you can login:
- **admin@ncip.gov.ph** / admin123 → Goes to Admin Dashboard (/admin)
- **staff@ncip.gov.ph** / staff123 → Goes to Dashboard
- **user@ncip.gov.ph** / user123 → Goes to Dashboard

---

## Alternative: Use Automated Script

If you prefer to run a script instead:

1. Download Service Account Key from Firebase Console
2. Save as `serviceAccountKey.json` in root folder
3. Run: `node scripts/createFirebaseUsers.js`
