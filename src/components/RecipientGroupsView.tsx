import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Mail, Phone, Users, Trash2, Edit2, X, Check, 
  AlertCircle, Download, FileText, Share2, MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Recipient {
  id: string;
  name: string;
  createdAt: string;
}

export function RecipientGroupsView({ theme }: { theme: 'light' | 'dark' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Recipient | null>(null);
  
  const [groups, setGroups] = useState<Recipient[]>([
    {
      id: 'RG001',
      name: 'NOC Alert Team',
      createdAt: '2026-05-18 10:30'
    },
    {
      id: 'RG002',
      name: 'Sales Finance Group',
      createdAt: '2026-05-19 14:20'
    }
  ]);

  const [formData, setFormData] = useState({
    name: ''
  });

  const handleOpenModal = (group: Recipient | null = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: '' });
    }
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? {
        ...g,
        name: formData.name
      } : g));
    } else {
      const newGroup: Recipient = {
        id: `RG00${groups.length + 1}`,
        name: formData.name,
        createdAt: new Date().toISOString().replace('T', ' ').substr(0, 16)
      };
      setGroups([newGroup, ...groups]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass = "w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all";

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-night-bg transition-colors duration-500 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#428bca]">System Recipient Groups</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Manage centralized contact groups for system-wide notifications</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="SEARCH GROUPS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 h-10 w-64 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-10 px-6 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Recipient Group
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGroups.map((group) => (
            <motion.div
              layout
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all group flex flex-col"
            >
              <div className="p-5 border-b border-zinc-50 dark:border-zinc-800/50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-zinc-800 dark:text-zinc-100">{group.name}</h3>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{group.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(group)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-500 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(group.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1">
                <p className="text-[10px] font-medium text-zinc-500 italic">This group serves as a named entry for recipient selection. Contact details are managed at the customer level.</p>
              </div>

              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-b-2xl flex items-center justify-between gap-4 mt-auto">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Created {group.createdAt}</span>
                <div className="flex items-center gap-2">
                  <button className="text-[8px] font-black text-blue-500 hover:underline uppercase">View Stats</button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
              <Users className="w-16 h-16 opacity-10 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No recipient groups found</p>
              <button onClick={() => handleOpenModal()} className="mt-4 text-[#428bca] text-[10px] font-black uppercase underline underline-offset-4">Create your first group</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100">
                    {editingGroup ? 'Edit Recipient Group' : 'New Recipient Group'}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Populate group with multi-channel contacts</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Group Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="E.G. TECHNICAL SUPPORT TEAM"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                  <p className="text-[9px] font-medium text-zinc-400 italic">This name will be available for selection during customer creation.</p>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 leading-relaxed">
                    System recipient groups are now managed as named identifiers only. Contact details (emails/mobiles) are assigned individually within the Customer Profile or Customer Account forms.
                  </p>
                </div>
              </div>

              <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-[10px] font-black uppercase text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-10 py-2.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all"
                >
                  {editingGroup ? 'Update Group' : 'Save Recipient Group'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
