
import React, { useState } from 'react';
import { ContactInfo } from '../types';
import { downloadVCard } from '../utils/vCardGenerator';

interface ContactEditorProps {
  initialData: ContactInfo;
  onReset: () => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ initialData, onReset }) => {
  const [contact, setContact] = useState<ContactInfo>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    downloadVCard(contact);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Extracted Details</h2>
          <p className="text-slate-400 text-sm">Review and edit before saving</p>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Full Name</span>
              <input 
                type="text" 
                name="fullName"
                value={contact.fullName || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Company / Organization</span>
              <input 
                type="text" 
                name="organization"
                value={contact.organization || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Job Title</span>
              <input 
                type="text" 
                name="jobTitle"
                value={contact.jobTitle || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email Address</span>
              <input 
                type="email" 
                name="email"
                value={contact.email || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Phone (Work)</span>
              <input 
                type="text" 
                name="phone"
                value={contact.phone || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Mobile Number</span>
              <input 
                type="text" 
                name="mobile"
                value={contact.mobile || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Website</span>
              <input 
                type="text" 
                name="website"
                value={contact.website || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Address</span>
              <input 
                type="text" 
                name="address"
                value={contact.address || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download vCard (.vcf)
          </button>
          <button 
            onClick={onReset}
            className="sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 px-8 rounded-2xl transition-all"
          >
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
};
