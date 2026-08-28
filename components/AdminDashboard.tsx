'use client';

import { useState, useEffect } from 'react';
import { getInvitations, createInvitation, resetDevice, deleteInvitation } from '../app/admin/actions';
import { Copy, Trash, ArrowsClockwise, CheckCircle } from '@phosphor-icons/react';

interface AdminDashboardProps {
  adminPassword: string;
}

export default function AdminDashboard({ adminPassword }: AdminDashboardProps) {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newId, setNewId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const data = await getInvitations(adminPassword);
      setInvitations(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewId(result);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim()) return;
    setIsCreating(true);
    try {
      await createInvitation(adminPassword, newId.trim());
      setNewId('');
      fetchDocs();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Attention ! Êtes-vous sûr de vouloir supprimer définitivement cette invitation ?')) return;
    try {
      await deleteInvitation(adminPassword, id);
      fetchDocs();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(link);
    setNotification(`Lien copié : ${link}`);
    setTimeout(() => setNotification(null), 5000);
  };

  const stats = {
    total: invitations.length,
    yes: invitations.filter(i => i.isParticipating === true).length,
    no: invitations.filter(i => i.isParticipating === false).length,
    pending: invitations.filter(i => i.isParticipating === undefined || i.isParticipating === null).length,
    checked: invitations.filter(i => i.checked).length
  };

  if (isLoading && invitations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
          <button onClick={fetchDocs} className="bg-white px-4 py-2 rounded-lg shadow text-primary border border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-medium transition">
            <ArrowsClockwise weight="bold" size={18} />
            Actualiser
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Présents (Oui)</p>
            <p className="text-3xl font-bold text-green-600">{stats.yes}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Absents (Non)</p>
            <p className="text-3xl font-bold text-red-500">{stats.no}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">En attente</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-primary">
            <p className="text-sm text-gray-500 font-medium">Validées à l'entrée</p>
            <p className="text-3xl font-bold text-primary">{stats.checked}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Create New */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Nouvelle Invitation</h2>
              <form onSubmit={handleCreate}>
                <label className="block text-sm text-gray-600 mb-2">Identifiant de l'invitation (URL)</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="ex: AB12"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomId}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
                  >
                    Générer
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 rounded-lg transition disabled:bg-gray-400"
                >
                  {isCreating ? 'Création...' : 'Créer l\'invitation'}
                </button>
              </form>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <th className="p-4 font-semibold text-sm">ID / Lien</th>
                    <th className="p-4 font-semibold text-sm">Contact</th>
                    <th className="p-4 font-semibold text-sm">RSVP</th>
                    <th className="p-4 font-semibold text-sm">Appareil</th>
                    <th className="p-4 font-semibold text-sm">Entrée</th>
                    <th className="p-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Aucune invitation pour le moment.
                      </td>
                    </tr>
                  ) : invitations.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {inv.id}
                          <button onClick={() => copyLink(inv.id)} className="text-gray-400 hover:text-primary transition" title="Copier le lien">
                            <Copy weight="bold" size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        {inv.fullName ? (
                          <>
                            <div className="font-medium text-gray-800">{inv.fullName}</div>
                            <div className="text-xs text-gray-500">{inv.phone}</div>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Non renseigné</span>
                        )}
                      </td>
                      <td className="p-4">
                        {inv.isParticipating === true && <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs font-bold">OUI</span>}
                        {inv.isParticipating === false && <span className="bg-red-100 text-red-700 py-1 px-2 rounded-full text-xs font-bold">NON</span>}
                        {inv.isParticipating == null && <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs font-bold">En attente</span>}
                      </td>
                      <td className="p-4">
                        {inv.deviceId ? (
                          <span className="text-green-600 text-sm">✅ Associé</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Libre</span>
                        )}
                      </td>
                      <td className="p-4">
                        {inv.checked ? (
                          <span className="text-primary font-bold text-sm">Validée</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm flex gap-2">
                        <button 
                          onClick={() => handleDelete(inv.id)}
                          className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                          title="Supprimer définitivement"
                        >
                          <Trash weight="fill" size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {notification && (
        <div 
          className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 transform translate-y-0 opacity-100"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <CheckCircle weight="fill" className="text-green-400" size={24} />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}
    </div>
  );
}
