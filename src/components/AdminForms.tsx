import React from 'react';
import { X, Save, ArrowLeft, Eye, EyeOff, Key, Mail, FileCode, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { AddIMAPAccountForm, AddFileTemplateForm, AddAutoUploadRuleForm } from './ProductForms';

interface AdminFormProps {
  title: string;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function AdminFormView({ title, onClose, theme }: AdminFormProps) {
  const effectiveTitle = title.includes(' / ') ? title.split(' / ').pop()! : title;
  const [isEdit, setIsEdit] = React.useState(effectiveTitle === 'Business Company'); // Mock edit mode for demo if needed

  if (effectiveTitle === 'IMAP Mail Account' || effectiveTitle === 'IMAP account') {
    return <AddIMAPAccountForm onClose={onClose} theme={theme} />;
  }

  if (effectiveTitle === 'File Template' || effectiveTitle === 'File template') {
    return <AddFileTemplateForm onClose={onClose} theme={theme} />;
  }
  
  if (effectiveTitle === 'Auto Upload Rules') {
    return <AddAutoUploadRuleForm onClose={onClose} theme={theme} />;
  }
  
  if (effectiveTitle === 'Business Company') {
    return (
      <div className="bg-zinc-50 dark:bg-black/20 min-h-screen p-6 custom-scrollbar overflow-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
            {title} <span className="text-zinc-400 font-normal">/ {isEdit ? 'Edit' : 'Add'}</span>
          </h2>
          <div className="flex gap-2">
            <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
              <Save className="w-3 h-3" /> Save
            </button>
            <button onClick={onClose} className="px-6 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all flex items-center gap-2">
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section: General Information */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">GENERAL INFORMATION</h3>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-x-20 gap-y-4">
              <div className="space-y-4">
                <FormRow label="Business Company Name" required>
                  <input type="text" defaultValue={isEdit ? "Breelink PERU" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="Description">
                  <textarea rows={3} defaultValue={isEdit ? "PERU" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="Company Logo(PNG)" required>
                  <div className="flex-1 flex items-center gap-4">
                    <input type="file" className="flex-1 text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-100 file:text-zinc-600 hover:file:bg-zinc-200" />
                  </div>
                </FormRow>
                <FormRow label="Invoice Format File (XLSX)" required>
                   <div className="flex-1 flex items-center gap-4">
                    <input type="file" className="flex-1 text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-100 file:text-zinc-600 hover:file:bg-zinc-200" />
                    <img src="https://img.icons8.com/color/48/microsoft-excel-2019.png" className="w-6 h-6 grayscale opacity-50" alt="excel" />
                   </div>
                </FormRow>
                <FormRow label="Customer Rate Format File (XLSX)" required>
                   <div className="flex-1 flex items-center gap-4">
                    <input type="file" className="flex-1 text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-100 file:text-zinc-600 hover:file:bg-zinc-200" />
                    <img src="https://img.icons8.com/color/48/microsoft-excel-2019.png" className="w-6 h-6 grayscale opacity-50" alt="excel" />
                   </div>
                </FormRow>
                <FormRow label="Customer Rate File Name" required>
                  <input type="text" defaultValue="[EnterpriseName]_[ProductCategoryName]_[Currency]_[Username]_[SelectedDate]" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-400" />
                </FormRow>
                <FormRow label="SOA Format File (XLSX)" required>
                   <div className="flex-1 flex items-center gap-4">
                    <input type="file" className="flex-1 text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-100 file:text-zinc-600 hover:file:bg-zinc-200" />
                    <img src="https://img.icons8.com/color/48/microsoft-excel-2019.png" className="w-6 h-6 grayscale opacity-50" alt="excel" />
                   </div>
                </FormRow>
                <FormRow label="Base Currency" required>
                  <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600">
                    <option>PEN (SOLES)</option>
                    <option>USD (DOLLAR)</option>
                  </select>
                </FormRow>
                <FormRow label="Website">
                  <input type="text" defaultValue={isEdit ? "www.breelink.com" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="SMPP Port">
                  <input type="text" defaultValue={isEdit ? "2775" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="Business Company IP">
                  <input type="text" defaultValue={isEdit ? "176.9.20.171" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
              </div>

              <div className="space-y-4">
                {isEdit && (
                  <div className="flex justify-center mb-10">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-100 dark:border-zinc-700 shadow-sm relative">
                      <img src="https://teleoss.com/wp-content/uploads/2021/04/TeleOSS-Logo-1.png" className="max-w-[150px] opacity-80" alt="logo" />
                      <div className="absolute -right-2 top-0 text-[30px] font-bold text-blue-500 opacity-20">itelvox</div>
                    </div>
                  </div>
                )}
                <FormRow label="TPS Limit" labelSize="min-w-[100px]">
                  <input type="text" defaultValue={isEdit ? "1500" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="SMPP IP" labelSize="min-w-[100px]">
                  <input type="text" defaultValue={isEdit ? "176.9.20.171" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
                <FormRow label="Invoice Number" labelSize="min-w-[100px]">
                  <input type="text" defaultValue={isEdit ? "1" : ""} className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-bold text-zinc-600" />
                </FormRow>
              </div>
            </div>
          </section>

          {/* Section: Email Template Information */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">EMAIL TEMPLATE INFORMATION</h3>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
              <FormRow label="Customer Rate" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Invoice" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Low Balance" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Bind Down" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Customer Tech Info" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Customer Trunk Change Info" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="SOA Statement" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Rate Upload Notification" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="Auto Upload Report - Rejected" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
            </div>
          </section>

          {/* Section: Rates Contact */}
          <ContactSection title="RATES CONTACT" />

          {/* Section: Finance Contact */}
          <ContactSection title="FINANCE CONTACT" />

          {/* Section: Address Information */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ADDRESS INFORMATION</h3>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
              <FormRow label="Address Line 1">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Address Line 2">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="City">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="State">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Country">
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>Select</option>
                </select>
              </FormRow>
              <FormRow label="ZIP/PIN Code">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
            </div>
          </section>

          {/* Section: Bank Information */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">BANK INFORMATION</h3>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
              <FormRow label="Beneficiary Name">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Beneficiary Address">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Beneficiary Bank">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Beneficiary Bank Address">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Currency">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Beneficiary Account Number">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="IBAN">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Swift Code">
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
            </div>
          </section>

          {/* Section: Commercial Contact */}
          <ContactSection title="COMMERCIAL CONTACT" />

          {/* Section: Technical Contact */}
          <ContactSection title="TECHNICAL CONTACT" />
        </div>
      </div>
    );
  }

  if (title === 'Email Template') {
    return (
      <div className="bg-zinc-50 dark:bg-black/20 min-h-screen p-6 custom-scrollbar overflow-auto pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              Admin / Email Template <span className="text-zinc-400 font-normal">/ Add</span>
            </h2>
            <div className="flex gap-2">
              <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
                 <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={onClose} className="px-6 py-1.5 bg-[#555] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-zinc-600 transition-all">Back</button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">EMAIL TEMPLATE Information</h3>
              <button className="px-4 py-1 bg-[#5cb85c] text-white text-[10px] font-bold rounded shadow hover:bg-green-600">Template Variables</button>
            </div>
            <div className="p-8 space-y-6">
              <FormRow label="Email Template Name" required>
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Email Template Subject" required>
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </FormRow>
              <FormRow label="Email Type" required>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                  <option>Select</option>
                  <option>Rate Sheet</option>
                  <option>Invoice</option>
                  <option>Ticket</option>
                </select>
              </FormRow>
              <div className="flex items-start gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[200px] text-right pt-2">Email Template Body <span className="text-red-500">*</span> :</label>
                <div className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 overflow-hidden shadow-inner">
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    {['Bold', 'Italic', 'Underline', 'Link', 'Image'].map(tool => (
                      <button key={tool} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-[10px] font-bold text-zinc-600">{tool}</button>
                    ))}
                  </div>
                  <textarea rows={15} className="w-full p-6 bg-transparent outline-none text-xs custom-scrollbar resize-none" placeholder="Type here..." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveTitle === 'Customer Portal') {
    return (
      <div className="bg-zinc-50 dark:bg-black/20 min-h-screen p-6 custom-scrollbar overflow-auto pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              {title} <span className="text-zinc-400 font-normal">/ Add</span>
            </h2>
            <div className="flex gap-2">
              <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={onClose} className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Cancel</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">GENERAL INFORMATION</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <FormRow label="First Name" required labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Last Name" required labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Organization" labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Website" labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Email" required labelSize="min-w-[150px]">
                    <input type="email" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Mobile" labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Username" required labelSize="min-w-[150px]">
                    <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                  </FormRow>
                  <FormRow label="Enterprise" required labelSize="min-w-[150px]">
                    <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                      <option>Select</option>
                    </select>
                  </FormRow>
                  <FormRow label="Password" required labelSize="min-w-[150px]">
                    <PasswordInput />
                  </FormRow>
                  <FormRow label="Confirm Password" required labelSize="min-w-[150px]">
                    <PasswordInput />
                  </FormRow>
                  <FormRow label="Status" labelSize="min-w-[150px]">
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><input type="radio" name="status" defaultChecked /> Active</label>
                      <label className="flex items-center gap-1.5 text-[11px] font-normal text-zinc-500"><input type="radio" name="status" /> Inactive</label>
                    </div>
                  </FormRow>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ACCESS CHECKLIST</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    'Enterprise Profile', 'Document Download', 'Rate Analytics', 'Invoice Download',
                    'Payment', 'Report', 'TCP Dump', 'Signalling Deck', 'Route Simulator',
                    'Route Simulator Group', 'Traffic Insights', 'LCR', 'DLR', 'Bilateral Report'
                  ].map(access => (
                    <label key={access} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-all hover:border-blue-200 group">
                      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600">{access}</span>
                      <input type="checkbox" className="w-4 h-4 accent-blue-500" />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl shadow-sm">
                <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Recommended
                </h4>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                  To make your password more secure, it should be at least 8 characters long and should contain:
                  <br /><br />
                  <span className="block pl-2">• At least one upper case character (A-Z)</span>
                  <span className="block pl-2">• At least one lower case character (a-z)</span>
                  <span className="block pl-2">• At least one numeric character (0-9)</span>
                  <span className="block pl-2">• At least one special character (!@#$%^&*)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function FormRow({ label, required, labelSize = "min-w-[200px]", children }: { label: string; required?: boolean; labelSize?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <label className={cn("text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right", labelSize)}>
        {label} {required && <span className="text-red-500">*</span>} :
      </label>
      {children}
    </div>
  );
}

function PasswordInput() {
  const [show, setShow] = React.useState(false);
  return (
    <div className="flex-1 relative">
      <input 
        type={show ? "text" : "password"} 
        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" 
      />
      <button 
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#428bca] text-white rounded hover:bg-blue-600 shadow-sm"
      >
        {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
}

function ContactSection({ title }: { title: string }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
        <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{title}</h3>
      </div>
      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-4">
        <FormRow label="Name">
          <input type="text" placeholder="Person Name" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="Phone">
          <input type="text" placeholder="Phone" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="SMTP Email" required>
          <input type="email" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="SMTP Secure" required>
          <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
            <option>Select</option>
          </select>
        </FormRow>
        <FormRow label="SMTP Host" required>
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="SMTP Port">
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="SMTP UserName">
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="SMTP Password">
          <div className="flex-1 relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" 
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#428bca] text-white rounded hover:bg-blue-600 shadow-sm"
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </FormRow>
        <FormRow label="Check SMTP Connection">
          <div className="flex-1 flex gap-px">
            <input type="text" placeholder="Test Email Address" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-l text-xs outline-none focus:border-blue-500" />
            <button className="px-3 bg-[#428bca] text-white rounded-r hover:bg-blue-600 transition-all">
              <Key className="w-3 h-3" />
            </button>
          </div>
        </FormRow>
        <FormRow label="Extension Number">
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="Skype Name">
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="Redirect URIs" required>
          <input type="text" defaultValue="https://demo-alphasms.breelink.com/businesscompany/callback" className="flex-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none italic text-zinc-500" disabled />
        </FormRow>
        <FormRow label="Client ID" required>
          <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
        </FormRow>
        <FormRow label="Client Secret" required>
          <div className="flex-1 relative">
            <input type="password" placeholder="Client Secret" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#428bca] text-white rounded hover:bg-blue-600 shadow-sm">
              <Key className="w-3 h-3" />
            </button>
          </div>
        </FormRow>
      </div>
    </section>
  );
}
