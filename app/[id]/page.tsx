import type { Metadata, ResolvingMetadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import InvitationFlow from '../../components/InvitationFlow';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  try {
    const docRef = doc(db, 'invitations', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // If the invitation is valid AND not claimed
      if (!data.deviceId) {
        return {
          title: "Mariage de Saïd et Hidayath",
          description: "Invitation au mariage de Saïd BIO WEDE et Hidayath ALASSANE YATCHE le Samedi 29 Août 2026.",
          openGraph: {
            images: ['/og-image.png'],
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title: "Invitation",
    description: "Lien d'invitation",
  };
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvitationFlow id={id} />;
}
