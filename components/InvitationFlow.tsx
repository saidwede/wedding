'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { validateInvitation } from '../app/admin/actions';

type InvitationStatus = 'loading' | 'not-found' | 'form' | 'invitation' | 'already-claimed';

const BowGraphic = () => (
  <div className="mb-10 opacity-80">
    <svg width="60" height="90" viewBox="0 0 100 150" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 35 C40 10, 15 20, 25 45 C35 65, 45 45, 50 35" />
      <path d="M50 35 C60 10, 85 20, 75 45 C65 65, 55 45, 50 35" />
      <circle cx="50" cy="38" r="5" fill="#333" />
      <path d="M47 43 Q40 90 42 140" />
      <path d="M53 43 Q65 80 58 120" />
      <path d="M42 140 L35 135 M58 120 L51 115" />
    </svg>
  </div>
);

const InvitationDetails = () => (
  <>
    <div className="text-center font-serif tracking-[0.3em] text-xl leading-relaxed mb-10 uppercase">
      <p>Saïd</p>
      <p>BIO WEDE</p>
      <p className="font-cursive text-5xl lowercase tracking-normal my-2 opacity-80">et</p>
      <p>Hidayath</p>
      <p>ALASSANE YATCHE</p>
    </div>
    
    <div className="text-center font-serif tracking-widest text-[10px] leading-loose mb-12">
      <p className="lowercase opacity-80 mb-1">seraient ravis que vous vous joigniez à eux</p>
      <p className="lowercase opacity-80 mb-4">pour célébrer leur mariage le</p>
      <p className="uppercase mb-2 text-xs">Samedi 29 Août 2026</p>
      <p className="uppercase mb-4 text-xs">à 10h00</p>
      <p className="opacity-90 capitalize">Mosquée </p>
      
      <p className="font-cursive text-3xl lowercase mt-8 tracking-normal opacity-90">Soirée à Hotel SOUNON SERO</p>
    </div>
  </>
);

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDFBF7] sm:p-8 flex items-center justify-center font-sans text-[#333333]">
    <div className="bg-[#f2e6db] sm:rounded-md shadow-sm max-w-[420px] w-full relative flex flex-col items-center py-16 px-8 min-h-screen sm:min-h-[auto]">
      {children}
    </div>
  </div>
);

export default function InvitationFlow({ id }: { id: string }) {
  const [status, setStatus] = useState<InvitationStatus>('loading');
  const [deviceId, setDeviceId] = useState<string>('');
  const [invitationData, setInvitationData] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isParticipating, setIsParticipating] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    // 1. Get or create deviceId
    let currentDeviceId = localStorage.getItem('wedding_device_id');
    if (!currentDeviceId) {
      currentDeviceId = uuidv4();
      localStorage.setItem('wedding_device_id', currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    // 2. Fetch invitation from Firestore
    const fetchInvitation = async () => {
      try {
        const docRef = doc(db, 'invitations', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setStatus('not-found');
          return;
        }

        const data = docSnap.data();
        setInvitationData(data);

        // Logic routing
        if (!data.deviceId) {
          // Unclaimed invitation
          setStatus('form');
        } else if (data.deviceId === currentDeviceId) {
          // Claimed by this device
          setStatus('invitation');
        } else {
          // Claimed by another device
          setStatus('already-claimed');
        }
      } catch (error) {
        console.error('Error fetching invitation:', error);
        setStatus('not-found');
      }
    };

    fetchInvitation();
  }, [id]);



  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || isParticipating === null) return;
    
    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'invitations', id);
      const updateData = {
        deviceId: deviceId,
        fullName: fullName,
        phone: phone,
        isParticipating: isParticipating,
        checked: false
      };
      
      await updateDoc(docRef, updateData);
      setInvitationData({ ...invitationData, ...updateData });
      setStatus('invitation');
    } catch (error) {
      console.error('Error claiming invitation:', error);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheck = async () => {
    if (!adminPassword) return;
    setIsSubmitting(true);
    try {
      await validateInvitation(adminPassword, id);
      setInvitationData({ ...invitationData, checked: true });
    } catch (error: any) {
      console.error('Error checking invitation:', error);
      alert(error.message || "Erreur lors de la validation.");
    } finally {
      setIsSubmitting(false);
      setAdminPassword('');
      setShowPasswordInput(false);
    }
  };



  if (status === 'loading') {
    return (
      <LayoutWrapper>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#333]"></div>
      </LayoutWrapper>
    );
  }

  if (status === 'not-found') {
    return (
      <LayoutWrapper>
        <BowGraphic />
        <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-center mb-6">Introuvable</h1>
        <p className="text-center font-serif tracking-widest text-xs leading-relaxed opacity-80">
          l'invitation que vous cherchez n'existe pas ou le lien est invalide.
        </p>
      </LayoutWrapper>
    );
  }

  if (status === 'already-claimed') {
    return (
      <LayoutWrapper>
        <BowGraphic />
        <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-center mb-6">Déjà ouverte</h1>
        <p className="text-center font-serif tracking-widest text-xs leading-relaxed opacity-80">
          cette invitation a déjà été ouverte et est associée à un autre appareil. par mesure de sécurité, elle ne peut pas être partagée.
        </p>
      </LayoutWrapper>
    );
  }

  if (status === 'form') {
    return (
      <LayoutWrapper>
        <BowGraphic />
        <InvitationDetails />
        
        <div className="w-full mt-auto pt-8 border-t border-[#d8ccbc]">
          <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-center mb-2">RSVP</h1>
          <p className="text-center font-serif tracking-widest text-[10px] leading-relaxed opacity-70 mb-8 lowercase">
            veuillez remplir vos informations
          </p>
          
          <form onSubmit={handleSubmitForm} className="w-full space-y-6 font-serif tracking-widest text-xs">
            <div>
              <label className="block mb-2 opacity-80">NOM COMPLET</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-[#333] focus:outline-none focus:border-[#000]"
              />
            </div>
            
            <div>
              <label className="block mb-2 opacity-80">TÉLÉPHONE</label>
              <input 
                type="tel" 
                required
                pattern="[0-9]*"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-0 py-2 bg-transparent border-b border-[#333] focus:outline-none focus:border-[#000]"
              />
            </div>

            <div className="pt-4">
              <label className="block mb-4 opacity-80 text-center">CONFIRMEZ-VOUS VOTRE PRÉSENCE ?</label>
              <div className="flex flex-col gap-3">
                <label className={`w-full text-center cursor-pointer border py-3 transition ${isParticipating === true ? 'border-[#333] bg-[#333] text-[#f2e6db]' : 'border-[#d8ccbc] hover:border-[#333]'}`}>
                  <input type="radio" name="participation" className="hidden" onChange={() => setIsParticipating(true)} />
                  OUI, AVEC PLAISIR
                </label>
                <label className={`w-full text-center cursor-pointer border py-3 transition ${isParticipating === false ? 'border-[#333] bg-[#333] text-[#f2e6db]' : 'border-[#d8ccbc] hover:border-[#333]'}`}>
                  <input type="radio" name="participation" className="hidden" onChange={() => setIsParticipating(false)} />
                  NON, DÉSOLÉ
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || isParticipating === null}
              className="w-full bg-[#333] hover:bg-black disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white text-[#f2e6db] py-4 mt-8 transition tracking-widest"
            >
              {isSubmitting ? '...' : 'VALIDER'}
            </button>
          </form>
        </div>
      </LayoutWrapper>
    );
  }

  // Invitation View
  return (
    <LayoutWrapper>
      <BowGraphic />
      <InvitationDetails />
      
      {/* Guest validation Info */}
      <div className="w-full mt-auto pt-8 border-t border-[#d8ccbc] text-center text-xs font-serif tracking-widest">
        <p className="mb-2 opacity-70">
          INVITÉ(E) : <span className="font-bold opacity-100">{invitationData?.fullName}</span>
        </p>
        <p className="mb-8 opacity-70">
          RÉPONSE : <span className="font-bold opacity-100">{invitationData?.isParticipating ? 'PRÉSENT(E)' : 'ABSENT(E)'}</span>
        </p>

        {invitationData?.checked ? (
          <div className="bg-[#e4dacd] text-[#333] p-3 rounded font-medium text-[10px] tracking-widest border border-[#d8ccbc]">
            VALIDÉE ✅
          </div>
        ) : showPasswordInput ? (
          <div className="space-y-4">
            <input 
              type="password"
              placeholder="Mot de passe"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border-b border-[#333] text-center focus:outline-none focus:border-[#000] tracking-wider text-xs"
            />
            <div className="flex gap-2 text-[10px]">
              <button 
                onClick={() => setShowPasswordInput(false)}
                className="flex-1 bg-transparent border border-[#d8ccbc] hover:bg-[#e4dacd] text-[#333] py-2 transition tracking-widest"
              >
                ANNULER
              </button>
              <button 
                onClick={handleCheck}
                disabled={isSubmitting || !adminPassword}
                className="flex-1 bg-[#333] text-[#f2e6db] hover:bg-black py-2 transition tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'OK'}
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowPasswordInput(true)}
            className="w-full bg-transparent border border-[#333] text-[#333] hover:bg-[#333] hover:text-[#f2e6db] py-3 transition tracking-widest text-[10px]"
          >
            VALIDER L'ENTRÉE
          </button>
        )}
      </div>
    </LayoutWrapper>
  );
}
