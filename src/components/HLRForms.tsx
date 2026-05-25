import React from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function AddHLRProviderForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">ADD HLR PROVIDER</h3>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Save</button>
          <button onClick={onClose} className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Cancel</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* Request Information */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">REQUEST INFORMATION</h4>
          </div>
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: 'Provider Name', required: true },
                  { label: 'UserName' },
                  { label: 'URL', required: true, type: 'textarea' },
                  { label: 'Password', type: 'password' },
                  { label: 'Extra Headers', type: 'textarea', placeholder: 'Each header & value are separated by colon ( : )\nEach header & value pair is separated by pipe ( | )\nExample: Content-Type:application/json|Authorization:Basic' },
                  { label: 'Data', type: 'textarea' },
                ].map((field) => (
                  <div key={field.label} className="flex items-start gap-4">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right pt-2">
                       {field.label} {field.required && <span className="text-red-500">*</span>} :
                    </label>
                    <div className="flex-1 flex flex-col gap-1">
                      {field.type === 'textarea' ? (
                        <textarea rows={3} placeholder={field.placeholder} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                      ) : (
                        <input type={field.type || 'text'} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <div className="col-start-1 px-32 text-[10px] text-blue-500 italic space-y-1">
                  <p className="font-bold underline not-italic">Example:</p>
                  <p>User can use below given variables in URL, Extra Headers & Data.</p>
                  <p>(1) http://www.example.com/phone=%d?service=pri&msg-id=%m&sender=%s&content=%c&enc-content=%C</p>
                  <p>(2) https://www.example.com/phone=%d?service=pub&msg-id=%m&sender=%s&content=%c&enc-content=%C</p>
                  <p>%d will be get replaced by target phone number</p>
                  <p>%m will be get replaced by unique message id</p>
                  <p>%s will be get replaced by sender id</p>
                  <p>%c will be get replaced by message content</p>
                  <p>%C will be get replaced by encoded message content</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Currency :</label>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">EUR</span>
                </div>
             </div>

             <div className="flex items-center gap-4 pt-4">
               <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Enable Caching (Days) :</label>
               <select className="max-w-[200px] w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>0</option>
                  <option>1</option>
                  <option>7</option>
               </select>
             </div>
          </div>
        </div>

        {/* Response Information */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">RESPONSE INFORMATION</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
               {[
                 { label: 'MCC Caption', required: true, placeholder: 'json-sub-object/keyword' },
                 { label: 'MNC Caption', required: true, placeholder: 'json-sub-object/keyword' },
                 { label: 'MCCMNC Caption', required: true, placeholder: 'json-sub-object/keyword' },
                 { label: 'Old MCC Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Old MNC Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Old MCCMNC Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Ported Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Error Code Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Error String Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'Success Codes', placeholder: 'Comma separated' },
                 { label: 'Number Check Caption', placeholder: 'json-sub-object/keyword' },
                 { label: 'DNID Score Caption', placeholder: 'json-sub-object/keyword' },
               ].map((field) => (
                 <div key={field.label} className="flex items-center gap-4">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[200px] text-right">
                       {field.label} {field.required && <span className="text-red-500">*</span>} :
                    </label>
                    <input type="text" placeholder={field.placeholder} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                 </div>
               ))}
            </div>
            <div className="px-52 text-[10px] text-blue-500 italic space-y-1">
              <p><span className="font-bold underline not-italic">Note:</span> Provider supplied MCC/MNC or MCCMNC caption (case sensitive), at least one pair is compulsory.</p>
              <p>Example: MCC Caption: NEW_MCC, MNC Caption: NEW_MNC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
