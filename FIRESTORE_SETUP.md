# Firestore Security Rules Setup

## Quick Fix for Development (TEMPORARY - NOT FOR PRODUCTION!)

If you want to test immediately, use these temporary open rules:

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

⚠️ **WARNING**: These rules allow any authenticated user to read/write everything. Only use for development!

## How to Update Firestore Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nciplibrarysystem**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab
5. Copy the contents from `firestore.rules` file in this project
6. Click **Publish**

## Production Setup:

Once you've tested with temporary rules, use the production rules in `firestore.rules` which include:
- Role-based access control (admin, staff, user)
- Users can only access their own data
- Staff and admins have elevated permissions
- Proper security for books, transactions, members, etc.

## Initial Data Setup:

After setting up rules, create initial user documents in Firestore:

**Collection: `users`**

Document ID: `[Copy UID from Authentication]`
```json
{
  "email": "admin@ncip.gov.ph",
  "role": "admin",
  "displayName": "Admin User",
  "createdAt": [Timestamp]
}
```

Repeat for staff and regular users.
