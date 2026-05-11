import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAssignedPatientsWithDetails } from '@/services/apiService';
import { updateDoctorFcmToken } from '@/services/apiService';
import { 
  doctorPredictCadica, 
  doctorGetCadicaPrediction, 
  doctorGetStrokePrediction 
} from '@/services/apiService';

import { 
  getDoctorPatientOcrHistory, 
  getDoctorPatientStrokeHistory, 
  getDoctorPatientCadicaHistory 
} from '@/services/apiService';
// NOTE: Is slice ko apne store.ts mein reducers k andar zaroor add karna (e.g., doctor: doctorReducer)

export interface PatientRecord {
  id: number;
  name: string;
  age: number | string;
  gender: string;
  status: string;
  risk: string;
  riskColor: string;
  rawReports?: any[]; 
  strokeReports?: any[];
  cadicaReports?: any[]; 
}

interface DoctorState {
  patients: PatientRecord[];
  loading: boolean;
  error: string | null;
  // Nayi History States
  ocrHistory: any[];
  strokeHistory: any[];
  cadicaHistory: any[];
}

const initialState: DoctorState = {
  patients: [],
  loading: false,
  error: null,
  ocrHistory: [],
  strokeHistory: [],
  cadicaHistory: [],
};

// export const fetchAssignedPatients = createAsyncThunk<
//   PatientRecord[], 
//   { doctorId: number; severity?: string } 
// >(
//   'doctor/fetchAssignedPatients',
//   async ({ doctorId, severity = 'all' }, { rejectWithValue }) => {
//     try {
//       const response = await getAssignedPatientsWithDetails(doctorId);
      
//       // Mapping API response to UI format (with safe checks)
//       const formattedPatients: PatientRecord[] = response.map((assignment: any) => {
//         const p = assignment.patient || {}; // Fallback empty object
//         const category = assignment.patientRiskCategory || 'Normal';
        
//         let riskColor = 'bg-slate-500 shadow-slate-200';
//         if (category === 'Critical') riskColor = 'bg-rose-500 shadow-rose-200';
//         else if (category === 'Moderate') riskColor = 'bg-amber-500 shadow-amber-200';
//         else if (category === 'Normal') riskColor = 'bg-emerald-500 shadow-emerald-200';

//         return {
//           id: p.patientid || Math.random(),
//           name: p.fullname || 'Unknown Patient',
//           age: p.age || 'N/A',
//           gender: p.gender === 1 ? 'Female' : p.gender === 2 ? 'Male' : p.gender || 'N/A',
//           status: category,
//           risk: category === 'No AI Result' ? 'N/A' : 'Check Details', 
//           riskColor,
//           rawReports: p.reports || [],
//         };
//       });

//       return formattedPatients;
//     } catch (error: any) {
//       console.error("API Error in fetchAssignedPatients:", error);
//       return rejectWithValue(error.message || 'Failed to fetch patients');
//     }
//   }
// );

export const fetchAssignedPatients = createAsyncThunk<
  PatientRecord[], 
  { doctorId: number; severity?: string } 
>(
  'doctor/fetchAssignedPatients',
  async ({ doctorId, severity = 'all' }, { rejectWithValue }) => {
    try {
      const response = await getAssignedPatientsWithDetails(doctorId);
      
      const formattedPatients: PatientRecord[] = response.map((assignment: any) => {
        const p = assignment.patient || {}; 
        const category = assignment.patientRiskCategory || 'Normal';
        
        let riskColor = 'bg-slate-500 shadow-slate-200';
        if (category === 'Critical') riskColor = 'bg-rose-500 shadow-rose-200';
        else if (category === 'Moderate') riskColor = 'bg-amber-500 shadow-amber-200';
        else if (category === 'Normal') riskColor = 'bg-emerald-500 shadow-emerald-200';

        return {
          id: p.patientid || Math.random(),
          name: p.fullname || 'Unknown Patient',
          age: p.age || 'N/A',
          gender: p.gender === 1 ? 'Female' : p.gender === 2 ? 'Male' : p.gender || 'N/A',
          status: category,
          risk: category === 'No AI Result' ? 'N/A' : 'Check Details', 
          riskColor,
          rawReports: p.reports || [],
          // ✅ FIX: Backend ki keys se exact data nikal kar state mein save kiya
          strokeReports: p.strokeReports || [], 
          cadicaReports: p.cadicaVideoReports || [], 
        };
      });

      return formattedPatients;
    } catch (error: any) {
      console.error("API Error in fetchAssignedPatients:", error);
      return rejectWithValue(error.message || 'Failed to fetch patients');
    }
  }
);


// --- GENERATE CADICA PREDICTION ---
export const generateCadicaPredictionThunk = createAsyncThunk(
  'doctor/generateCadicaPrediction',
  async (cadicaVideoReportId: number, { rejectWithValue }) => {
    try {
      const response = await doctorPredictCadica(cadicaVideoReportId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate CADICA prediction');
    }
  }
);

// --- GET EXISTING CADICA PREDICTION ---
export const fetchCadicaPredictionThunk = createAsyncThunk(
  'doctor/fetchCadicaPrediction',
  async (cadicaVideoReportId: number, { rejectWithValue }) => {
    try {
      const response = await doctorGetCadicaPrediction(cadicaVideoReportId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch CADICA prediction');
    }
  }
);

// --- GET STROKE PREDICTION ---
export const fetchStrokePredictionThunk = createAsyncThunk(
  'doctor/fetchStrokePrediction',
  async (strokeReportId: number, { rejectWithValue }) => {
    try {
      const response = await doctorGetStrokePrediction(strokeReportId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Stroke prediction');
    }
  }
);


// Doctor ka FCM Token backend mein save karne ka Thunk
export const saveDoctorFcmToken = createAsyncThunk<any, string>(
  'doctor/saveFcmToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await updateDoctorFcmToken(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save FCM token');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchAssignedPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // -----------------------------
      // FETCH STROKE PREDICTION
      // -----------------------------
      .addCase(fetchStrokePredictionThunk.pending, (state) => {
        // Optional: you can add a specific loading state here
      })
      .addCase(fetchStrokePredictionThunk.fulfilled, (state, action) => {
        // Tum is data ko directly Modal component mein .unwrap() se bhi use kar sakte ho
      })
      .addCase(fetchStrokePredictionThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // OCR History
      .addCase(fetchPatientOcrHistoryThunk.fulfilled, (state, action) => {
        state.ocrHistory = action.payload;
      })
      // Stroke History
      .addCase(fetchPatientStrokeHistoryThunk.fulfilled, (state, action) => {
        state.strokeHistory = action.payload;
      })
      // Cadica History
      .addCase(fetchPatientCadicaHistoryThunk.fulfilled, (state, action) => {
        state.cadicaHistory = action.payload;
      });
  },
});


export const fetchPatientOcrHistoryThunk = createAsyncThunk(
  'doctor/fetchOcrHistory',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const response = await getDoctorPatientOcrHistory(patientId);
      return response.reports || response; 
    } catch (error: any) { return rejectWithValue(error.message); }
  }
);

export const fetchPatientStrokeHistoryThunk = createAsyncThunk(
  'doctor/fetchStrokeHistory',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const response = await getDoctorPatientStrokeHistory(patientId);
      return response.strokeReports || response; 
    } catch (error: any) { return rejectWithValue(error.message); }
  }
);

export const fetchPatientCadicaHistoryThunk = createAsyncThunk(
  'doctor/fetchCadicaHistory',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const response = await getDoctorPatientCadicaHistory(patientId);
      return response.cadicaVideoReports || response; 
    } catch (error: any) { return rejectWithValue(error.message); }
  }
);
export default doctorSlice.reducer;