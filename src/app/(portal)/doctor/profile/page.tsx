"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import GenericFormModal from '@/components/ui/GenericFormModal';
import { User, Lock, Mail, Phone, Stethoscope, Edit2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // User Data State
  const [userData, setUserData] = useState({
    fullName: 'Dr. Michael Anderson',
    email: 'dr.anderson@hospital.com',
    specialization: 'Cardiologist',
    contact: '(555) 123-4567',
  });

  // --- FIX 1: defaultValue hata diya hai (yeh ab initialData se handle hoga) ---
  const profileFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. John Smith', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'abz@example.com', required: true },
    { name: 'specialization', label: 'Specialization', type: 'text', placeholder: 'Cardiologist', required: true },
    { name: 'contact', label: 'Contact Number', type: 'text', placeholder: '(555) 123-4567', required: true },
  ];

  const passwordFields = [
    { name: 'currentPassword', label: 'Current Password', type: 'password', placeholder: '........', required: true },
    { name: 'newPassword', label: 'New Password', type: 'password', placeholder: '........', required: true },
    { name: 'confirmPassword', label: 'Confirm New Password', type: 'password', placeholder: '........', required: true },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar 
        role="doctor" 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="w-full lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <Header 
            title="My Profile" 
            onMenuClick={() => setSidebarOpen(true)} 
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* 1. Personal Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-fit hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                            <p className="text-sm text-slate-500 mt-1">Manage your personal details</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsProfileModalOpen(true)}
                        className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all">
                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                            <p className="text-slate-800 font-semibold">{userData.fullName}</p>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all">
                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                            <p className="text-slate-800 font-semibold">{userData.email}</p>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all">
                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Specialization</p>
                            <p className="text-slate-800 font-semibold">{userData.specialization}</p>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all">
                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Number</p>
                            <p className="text-slate-800 font-semibold">{userData.contact}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Security Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-fit hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-5">
                        <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 shadow-sm shadow-rose-100">
                            <Lock size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Security</h2>
                            <p className="text-sm text-slate-500 mt-1">Password & Authentication</p>
                        </div>
                    </div>
                    <button 
                         onClick={() => setIsPasswordModalOpen(true)}
                         className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <ShieldCheck size={16} /> Update
                    </button>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 text-sm font-medium mb-3">Password Strength</p>
                    <div className="flex gap-1.5 mb-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="flex-1 h-2 bg-emerald-500 rounded-full"></div>)}
                        <div className="flex-1 h-2 bg-slate-200 rounded-full"></div>
                    </div>
                    <p className="text-xs text-slate-400">
                        Last changed <span className="text-slate-700 font-bold">30 days ago</span>. 
                        We recommend updating your password every 3 months.
                    </p>
                </div>
            </div>
        </div>

        {/* --- FIX 2: initialData prop pass kiya hai --- */}
        <GenericFormModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            title="Edit Profile Details"
            fields={profileFields}
            initialData={userData} // <--- YE ZAROORI HAI
            onSubmit={(data: any) => { 
                setUserData({...userData, ...data}); 
                setIsProfileModalOpen(false); 
            }}
            submitLabel="Save Changes"
            />

        <GenericFormModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            initialData={userData} // <--- YE ZAROORI HAI
            title="Change Password"
            fields={passwordFields}
            onSubmit={() => {
                toast.success("Password Updated");
                setIsPasswordModalOpen(false);
            }}
            submitLabel="Update Password"
        />

      </main>
    </div>
  );
}