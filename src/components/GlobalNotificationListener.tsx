"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { saveDoctorFcmToken } from '@/lib/store/features/doctorSlice';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import { messaging, getToken, onMessage } from '@/lib/firebase'; // Path verify karlena

export default function GlobalNotificationListener() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux se current user nikaalo
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check karo ke kya user login hai aur wo doctor hai
    const actualDoctorId = user?.id || user?.sub || user?.doctorid;
    // Agar doctor ki specialization/doctorid nahi hai toh yeh listener band rahay ga
    const isDoctor = user && (user.role === 'doctor' || user.doctorid || user.specialization);

    if (!isDoctor || !actualDoctorId) return;

    // --- 1. GET FCM TOKEN & SEND TO BACKEND ---
    const registerToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted' && messaging) {
          const token = await getToken(messaging, { 
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
          });
          
          if (token) {
            console.log("FCM Token Generated for Doctor:", actualDoctorId);
            await dispatch(saveDoctorFcmToken(token)).unwrap(); 
          }
        }
      } catch (error) {
        console.error("Token generation failed:", error);
      }
    };
    
    registerToken();

    // --- 2. LISTEN FOR NOTIFICATIONS GLOBALLY ---
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        const newNotif = {
          id: Math.random().toString(36).substr(2, 9),
          title: payload.notification?.title || 'New Notification',
          desc: payload.notification?.body || 'You have a new update.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'info'
        };

        // VISUAL POP-UP (Toast)
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer border-l-4 border-indigo-500`}
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/doctor-dashboard'); 
            }}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <AlertCircle className="h-10 w-10 text-indigo-500 rounded-full bg-indigo-50 p-1.5" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">{newNotif.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{newNotif.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 6000, position: 'top-right' });

        // 3. User-Specific LocalStorage (Mixup khatam)
        const storageKey = `doctor_notifications_${actualDoctorId}`;
        const saved = localStorage.getItem(storageKey);
        const prevNotifs = saved ? JSON.parse(saved) : [];
        const updatedNotifs = [newNotif, ...prevNotifs];
        
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifs));

        // 4. Custom event fire karo taake Notifications page foran update ho jaye
        window.dispatchEvent(new Event('new_notification'));
      });

      return () => unsubscribe(); 
    }
  }, [dispatch, router, user]);

  return null; 
}