// removePasswordField.js
// Usage:
//  - Remove from all users: node scripts/removePasswordField.js
//  - Remove from single user by UID: node scripts/removePasswordField.js <userUid>

const admin = require('firebase-admin');
const path = require('path');

// Expect serviceAccountKey.json at repo root
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (err) {
  console.error('Could not load serviceAccountKey.json. Please download from Firebase Console and place at the project root.');
  console.error('Error:', err.message);
  process.exit(1);
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function removeFromAll() {
  console.log('Fetching all user documents from `users` collection...');
  const snapshot = await db.collection('users').get();
  if (snapshot.empty) {
    console.log('No user documents found.');
    return;
  }

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (Object.prototype.hasOwnProperty.call(data, 'password')) {
      console.log(`Removing 'password' field from document ${doc.id} (email: ${data.email || 'unknown'})`);
      await db.collection('users').doc(doc.id).update({
        password: FieldValue.delete()
      });
      count++;
    }
  }

  console.log(`Done. Removed 'password' field from ${count} document(s).`);
}

async function removeFromUid(uid) {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    console.error('Document not found for UID:', uid);
    return;
  }
  const data = snap.data();
  if (!Object.prototype.hasOwnProperty.call(data, 'password')) {
    console.log(`Document ${uid} does not have a 'password' field.`);
    return;
  }
  await ref.update({ password: FieldValue.delete() });
  console.log(`Removed 'password' field from document ${uid} (email: ${data.email || 'unknown'})`);
}

(async () => {
  const arg = process.argv[2];
  try {
    if (arg) {
      await removeFromUid(arg);
    } else {
      await removeFromAll();
    }
    process.exit(0);
  } catch (err) {
    console.error('Error while removing password field:', err);
    process.exit(1);
  }
})();
