'use client';

import { WarningCircle } from '@phosphor-icons/react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <WarningCircle weight="fill" className="text-red-500 text-5xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Invitation introuvable
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Le lien que vous avez suivi est invalide ou l'invitation n'existe plus. Veuillez vérifier le lien qui vous a été transmis.
        </p>
      </div>
    </div>
  );
}
