// Script to create Firebase users for NCIP Library System
// Run this once to set up your initial users

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nciplibrarysystem-default-rtdb.firebaseio.com"
});

const users = [
  {
    email: 'admin@ncip.gov.ph',
    password: 'admin123',
    role: 'admin',
    displayName: 'Administrator'
  },
  {
    email: 'staff@ncip.gov.ph',
    password: 'staff123',
    role: 'staff',
    displayName: 'Library Staff'
  },
  {
    email: 'user@ncip.gov.ph',
    password: 'user123',
    role: 'user',
    displayName: 'Regular User'
  }
];

async function createUsers() {
  const db = admin.firestore();
  
  for (const userData of users) {
    try {
      // Create user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true
      });

      console.log(`✓ Created user: ${userData.email} (UID: ${userRecord.uid})`);

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email: userData.email,
        role: userData.role,
        displayName: userData.displayName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        active: true
      });

      console.log(`✓ Created Firestore document for: ${userData.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠ User already exists: ${userData.email}`);
        
        // Try to update Firestore document if user exists
        try {
          const existingUser = await admin.auth().getUserByEmail(userData.email);
          await db.collection('users').doc(existingUser.uid).set({
            email: userData.email,
            role: userData.role,
            displayName: userData.displayName,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            active: true
          }, { merge: true });
          console.log(`✓ Updated Firestore document for: ${userData.email}`);
        } catch (updateError) {
          console.error(`✗ Error updating ${userData.email}:`, updateError.message);
        }
      } else {
        console.error(`✗ Error creating ${userData.email}:`, error.message);
      }
    }
  }

  console.log('\n✓ All users processed!');
  process.exit(0);
}

createUsers().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
