import { collection, getDocs, doc, setDoc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
// removed import
import { db } from './firebase';

export const fetchAttendance = async (teamId?: string | null, userId?: string | null, startDate?: string | null, endDate?: string | null) => {
  const constraints: any[] = [];
  
  if (teamId) constraints.push(where('teamId', '==', teamId));
  if (userId) constraints.push(where('userId', '==', userId));
  if (startDate) constraints.push(where('date', '>=', startDate));
  if (endDate) constraints.push(where('date', '<=', endDate));
  
  const q = constraints.length > 0
    ? query(collection(db, 'attendance'), ...constraints)
    : collection(db, 'attendance');
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markAttendance = async (attendanceData: any) => {
  const recordId = `${attendanceData.userId}_${attendanceData.date}`;
  const record = { ...attendanceData, markedAt: Timestamp.now() };
  await setDoc(doc(db, 'attendance', recordId), record, { merge: true });
  return { id: recordId, ...record };
};

export const editAttendance = async (recordId: string, newStatus: string) => {
  await updateDoc(doc(db, 'attendance', recordId), { status: newStatus, markedAt: Timestamp.now() });
};

export const fetchDailyAttendance = async (teamId: string, dateStr: string) => {
  const q = query(
    collection(db, 'attendance'),
    where('teamId', '==', teamId),
    where('date', '==', dateStr)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};
