# PAANO MAG-CREATE UG FIREBASE USERS

## MGA LAKANG (MANUAL - DALI RA NI):

### 1. ADTO SA FIREBASE CONSOLE
- Buksan: https://console.firebase.google.com/
- Pilia ang project: **nciplibrarysystem**

### 2. I-CREATE ANG AUTHENTICATION USERS

**Firebase Console → Authentication → Users → Add User**

Himua ni nga 3 ka users:

#### ADMIN USER:
- Email: `admin@ncip.gov.ph`
- Password: `admin123`
- (I-klik "Add User")
- **I-COPY ANG UID** (makita nimo sa user list) - kinahanglan ni para sa Firestore

#### STAFF USER:
- Email: `staff@ncip.gov.ph`
- Password: `staff123`
- I-copy pud ang UID

#### REGULAR USER:
- Email: `user@ncip.gov.ph`
- Password: `user123`
- I-copy pud ang UID

---

### 3. I-CREATE ANG FIRESTORE DOCUMENTS

**Firebase Console → Firestore Database**

Kung wala pay database, i-click "Create Database" → Test Mode → Next → Enable

**Himua ang collection "users":**

1. I-click "Start Collection"
2. Collection ID: `users`
3. I-click "Next"

**Para sa ADMIN:**
- Document ID: `[I-PASTE ANG UID SA ADMIN USER]`
- I-click "Add Field":
  - Field: `email` | Type: string | Value: `admin@ncip.gov.ph`
- I-click "Add Field":
  - Field: `role` | Type: string | Value: `admin`
- I-click "Add Field":
  - Field: `displayName` | Type: string | Value: `Administrator`
- I-click "Add Field":
  - Field: `active` | Type: boolean | Value: `true`
- I-click "Save"

**Repeat para sa STAFF ug USER:**

STAFF Document:
- Document ID: `[UID sa staff user]`
- email: `staff@ncip.gov.ph`
- role: `staff`
- displayName: `Library Staff`
- active: `true`

USER Document:
- Document ID: `[UID sa user]`
- email: `user@ncip.gov.ph`
- role: `user`
- displayName: `Regular User`
- active: `true`

---

### 4. I-UPDATE ANG FIRESTORE RULES

**Firebase Console → Firestore Database → Rules**

I-paste ni temporarily (PARA SA TESTING LANG):

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

I-click **Publish**

---

## HUMAN NA!

Pwede na nimo i-login:
- **admin@ncip.gov.ph** / admin123 → Moadto sa Admin Dashboard
- **staff@ncip.gov.ph** / staff123 → Moadto sa Dashboard
- **user@ncip.gov.ph** / user123 → Moadto sa Dashboard

---

## PASPAS NGA PAAGI (GAMIT SCRIPT):

Kung gusto nimo gamiton ang script:

1. Download Service Account Key:
   - Firebase Console → Project Settings → Service Accounts
   - I-click "Generate New Private Key"
   - I-save as `serviceAccountKey.json` sa root folder

2. Run ang script:
   ```bash
   node scripts/createFirebaseUsers.js
   ```

Automatic na mahimo tanan!
