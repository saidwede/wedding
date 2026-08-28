'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { validateInvitation } from '../app/admin/actions';

type InvitationStatus = 'loading' | 'not-found' | 'form' | 'invitation' | 'already-claimed';

const BowGraphic = () => (
  <div className="mb-6 opacity-80">
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
    <div className="text-center flex flex-col items-center mb-10 pt-8">
      <p className="font-cursive text-6xl sm:text-6xl text-[#3a3f38] mb-2 leading-none">Saïd</p>
      <p className="font-cursive text-5xl sm:text-3xl text-[#3a3f38] mb-2 leading-none">&</p>
      <p className="font-cursive text-6xl sm:text-6xl text-[#3a3f38] leading-none">Hidayath</p>
    </div>
    
    <div className="text-center font-serif tracking-widest text-xs leading-loose mb-6 text-[#3a3f38]">
      <p className="lowercase opacity-80 mb-1">seraient ravis que vous vous joigniez à eux</p>
      <p className="lowercase opacity-80 mb-2">pour célébrer leur mariage le</p>
      <p className="uppercase mb-4 text-sm font-bold mt-4">Samedi 29 Août 2026</p>
      
      <div className="mb-4">
        <p className="uppercase opacity-70 text-[10px] mb-1">Mariage Religieux</p>
        <p className="uppercase mb-1">10H00</p>
        <p className="opacity-90 capitalize text-sm">Mosquée Wakaïya (derrière le CHD)</p>
      </div>
      
      <p className="font-sans text-xs uppercase tracking-widest my-4 opacity-80">suivi de la réception</p>
      
      <div>
        <p className="uppercase opacity-70 text-[10px] mb-1">Soirée</p>
        <p className="uppercase mb-1">19H00</p>
        <p className="opacity-90 capitalize text-sm">Hôtel Sounon Sero (Von Yayi Boni)</p>
      </div>
    </div>
  </>
);

const FallingBalloons = () => {
  const [balloons, setBalloons] = useState<any[]>([]);

  useEffect(() => {
    const newBalloons = Array.from({ length: 15 }).map((_, i) => {
      const isYellow = Math.random() > 0.5;
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 15; // 10 to 25s
      const delay = Math.random() * 15; // 0 to 15s delay
      const size = 30 + Math.random() * 40; // 30px to 70px

      return {
        id: i,
        color: isYellow ? '#FEF08A' : '#93C5FD', // light yellow, light blue
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        size
      };
    });
    setBalloons(newBalloons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {balloons.map(b => (
        <div 
          key={b.id} 
          className="balloon-anim flex flex-col items-center"
          style={{ 
            left: b.left, 
            animationDuration: b.duration,
            animationDelay: b.delay,
            width: b.size,
          }}
        >
          {/* Balloon shape */}
          <div 
            style={{ 
              width: b.size, 
              height: b.size * 1.2, 
              backgroundColor: b.color,
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
            }}
            className="shadow-sm opacity-60"
          />
          {/* Balloon tie */}
          <div 
            style={{
              width: 0, 
              height: 0, 
              borderLeft: `${b.size * 0.1}px solid transparent`,
              borderRight: `${b.size * 0.1}px solid transparent`,
              borderBottom: `${b.size * 0.15}px solid ${b.color}`,
              marginTop: '-2px'
            }}
            className="opacity-60"
          />
          {/* Balloon string */}
          <div 
            style={{
              width: 1,
              height: b.size * 1.5,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

const FloralTop = () => (
  <svg width="100%" height="250" viewBox="0 0 400 250" preserveAspectRatio="xMidYMin slice" className="absolute top-0 left-0 w-full pointer-events-none opacity-80 z-0">
    <defs>
      <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    <path d="M-20,-20 Q50,0 80,60 Q20,80 -20,20 Z" fill="url(#leafGrad1)" />
    <path d="M0,0 Q80,20 120,80 Q40,110 0,60 Z" fill="url(#leafGrad2)" />
    <path d="M-10,30 Q60,60 90,130 Q10,140 -10,80 Z" fill="url(#leafGrad1)" opacity="0.6" />
    <path d="M30,-10 Q90,10 150,50 Q100,80 50,20 Z" fill="url(#leafGrad2)" opacity="0.5" />
    <path d="M0,0 Q100,50 150,120" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    <path d="M0,0 Q120,30 200,60" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    
    <path d="M420,-20 Q350,0 320,60 Q380,80 420,20 Z" fill="url(#leafGrad1)" />
    <path d="M400,0 Q320,20 280,80 Q360,110 400,60 Z" fill="url(#leafGrad2)" />
    <path d="M410,30 Q340,60 310,130 Q390,140 410,80 Z" fill="url(#leafGrad1)" opacity="0.6" />
    <path d="M370,-10 Q310,10 250,50 Q300,80 350,20 Z" fill="url(#leafGrad2)" opacity="0.5" />
    <path d="M400,0 Q300,50 250,120" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    <path d="M400,0 Q280,30 200,60" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    
    <path d="M180,20 C190,10 200,20 190,30 C180,40 170,30 180,20" fill="url(#leafGrad1)" />
    <path d="M220,10 C230,5 240,15 230,25 C220,35 210,20 220,10" fill="url(#leafGrad2)" />
  </svg>
);

const FloralBottom = () => (
  <svg width="100%" height="250" viewBox="0 0 400 250" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 w-full pointer-events-none opacity-80 z-0">
    <defs>
      <linearGradient id="leafGrad1b" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="leafGrad2b" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    <path d="M-20,270 Q50,250 80,190 Q20,170 -20,230 Z" fill="url(#leafGrad1b)" />
    <path d="M0,250 Q80,230 120,170 Q40,140 0,190 Z" fill="url(#leafGrad2b)" />
    <path d="M-10,220 Q60,190 90,120 Q10,110 -10,170 Z" fill="url(#leafGrad1b)" opacity="0.6" />
    <path d="M30,260 Q90,240 150,200 Q100,170 50,230 Z" fill="url(#leafGrad2b)" opacity="0.5" />
    <path d="M0,250 Q100,200 150,130" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    <path d="M0,250 Q120,220 200,190" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    
    <path d="M420,270 Q350,250 320,190 Q380,170 420,230 Z" fill="url(#leafGrad1b)" />
    <path d="M400,250 Q320,230 280,170 Q360,140 400,190 Z" fill="url(#leafGrad2b)" />
    <path d="M410,220 Q340,190 310,120 Q390,110 410,170 Z" fill="url(#leafGrad1b)" opacity="0.6" />
    <path d="M370,260 Q310,240 250,200 Q300,170 350,230 Z" fill="url(#leafGrad2b)" opacity="0.5" />
    <path d="M400,250 Q300,200 250,130" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    <path d="M400,250 Q280,220 200,190" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1" />
    
    <path d="M170,230 C180,220 190,230 180,240 C170,250 160,240 170,230" fill="url(#leafGrad1b)" />
  </svg>
);

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDFBF7] sm:p-8 flex items-center justify-center font-sans text-[#333333] relative overflow-hidden">
    <FallingBalloons />
    <div className="bg-[#f2e6db] sm:rounded-md shadow-sm max-w-[420px] w-full relative flex flex-col items-center py-8 px-6 min-h-screen sm:min-h-[auto] z-10 overflow-hidden">
      <FloralTop />
      {children}
      <FloralBottom />
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
  const [isValidationAllowed, setIsValidationAllowed] = useState(false);

  useEffect(() => {
    // 1. Get or create deviceId
    let currentDeviceId = localStorage.getItem('wedding_device_id');
    if (!currentDeviceId) {
      currentDeviceId = uuidv4();
      localStorage.setItem('wedding_device_id', currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    // Check if validation is allowed (after 29/08/2026 19:00 GMT+1)
    const unlockDate = new Date('2026-08-29T19:00:00+01:00');
    setIsValidationAllowed(new Date() >= unlockDate);

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
        
        <div className="w-full mt-auto pt-6 border-t border-[#d8ccbc]">
          <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-center mb-2">RSVP</h1>
          <p className="text-center font-serif tracking-widest text-[10px] leading-relaxed opacity-70 mb-6 lowercase">
            veuillez remplir vos informations
          </p>
          
          <form onSubmit={handleSubmitForm} className="w-full space-y-4 font-serif tracking-widest text-xs">
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
        ) : (
          <div className="w-full mt-6 space-y-3 relative z-10">
            {isValidationAllowed && (
              showPasswordInput ? (
                <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-b border-[#333] text-center focus:outline-none focus:border-[#7a9071] transition-colors"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setShowPasswordInput(false)}
                      className="w-1/3 bg-transparent border border-[#333] text-[#333] py-2 transition tracking-widest text-[10px]"
                    >
                      ANNULER
                    </button>
                    <button 
                      onClick={handleCheck}
                      className="w-2/3 bg-[#333] text-[#f2e6db] py-2 transition tracking-widest text-[10px]"
                    >
                      {isSubmitting ? '...' : 'CONFIRMER'}
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
              )
            )}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
