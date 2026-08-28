'use server';

import { adminDb } from '../../lib/firebaseAdmin';

// Server action to verify password
export async function verifyPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return false;
  }
  return true;
}

export async function getInvitations(password: string) {
  if (!(await verifyPassword(password))) throw new Error('Unauthorized');

  const snapshot = await adminDb.collection('invitations').get();
  const invitations = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  }));

  return invitations;
}

export async function createInvitation(password: string, id: string) {
  if (!(await verifyPassword(password))) throw new Error('Unauthorized');
  
  if (!id.trim()) throw new Error('ID cannot be empty');

  const docRef = adminDb.collection('invitations').doc(id);
  const docSnap = await docRef.get();
  
  if (docSnap.exists) {
    throw new Error('Invitation ID already exists');
  }

  await docRef.set({
    checked: false
    // deviceId, fullName, phone, isParticipating are intentionally omitted so they start empty
  });

  return { success: true };
}

export async function resetDevice(password: string, id: string) {
  if (!(await verifyPassword(password))) throw new Error('Unauthorized');

  const docRef = adminDb.collection('invitations').doc(id);
  await docRef.update({
    deviceId: null,
    // we can optionally clear name/phone too, but usually it's just to allow another device to open it
  });

  return { success: true };
}

export async function deleteInvitation(password: string, id: string) {
  if (!(await verifyPassword(password))) throw new Error('Unauthorized');

  await adminDb.collection('invitations').doc(id).delete();

  return { success: true };
}

export async function validateInvitation(password: string, id: string) {
  if (!(await verifyPassword(password))) throw new Error('Mot de passe administrateur incorrect');

  await adminDb.collection('invitations').doc(id).update({
    checked: true
  });

  return { success: true };
}
