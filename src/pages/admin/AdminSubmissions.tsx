import React, { useEffect, useState } from 'react';
import { fetchAssignments } from '../../services/assignmentService';
import { collection, getDocs, doc, updateDoc, Timestamp, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Assignment, Submission } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Modal } from '../../components/common/Modal';

const AdminSubmissions = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [evalMarks, setEvalMarks] = useState('');
  const [evalFeedback, setEvalFeedback] = useState('');
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [savingEval, setSavingEval] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const aData = await fetchAssignments();
      setAssignments(aData);
      
      const q = query(collection(db, 'submissions'));
      const snap = await getDocs(q);
      const sData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission));
      setSubmissions(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !selectedSub.id) return;
    setSavingEval(true);
    try {
      const docRef = doc(db, 'submissions', selectedSub.id);
      await updateDoc(docRef, {
        obtainedMarks: Number(evalMarks),
        feedback: evalFeedback,
        evaluatorId: user?.id,
        evaluatedAt: Timestamp.now(),
        status: 'EVALUATED'
      });
      setIsEvalModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEval(false);
    }
  };

  const openEvalModal = (sub: Submission) => {
    setSelectedSub(sub);
    setEvalMarks(sub.obtainedMarks?.toString() || '');
    setEvalFeedback(sub.feedback || '');
    setIsEvalModalOpen(true);
  };

  const getAssignment = (id: string) => assignments.find(a => a.id === id);

  if (loading) return <div className='flex justify-center p-12'><div className='animate-pulse text-theme-accent'>Loading...</div></div>;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Submission Records</h1>
          <p className='text-theme-text-secondary text-sm mt-1'>Evaluate member assignments</p>
        </div>
      </div>

      <div className='bg-theme-surface border border-theme-border rounded-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-theme-surface-higher border-b border-theme-border-subtle'>
              <tr>
                <th className='p-4 font-semibold text-theme-text-secondary'>Member</th>
                <th className='p-4 font-semibold text-theme-text-secondary'>Assessment</th>
                <th className='p-4 font-semibold text-theme-text-secondary'>Status</th>
                <th className='p-4 font-semibold text-theme-text-secondary'>Submission Date</th>
                <th className='p-4 font-semibold text-theme-text-secondary'>Marks</th>
                <th className='p-4 font-semibold text-theme-text-secondary'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-theme-border-subtle'>
              {submissions.map(sub => {
                const assignment = getAssignment(sub.assignmentId);
                const maxMarks = sub.maximumMarks || assignment?.maxMarks || 100;
                
                return (
                  <tr key={sub.id} className='hover:bg-theme-surface-higher/50 transition-colors'>
                    <td className='p-4 font-medium text-theme-primary'>{sub.memberId}</td>
                    <td className='p-4'>
                      <div className='font-medium text-theme-text'>{assignment?.title || 'Unknown Assignment'}</div>
                    </td>
                    <td className='p-4'>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sub.status === 'EVALUATED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-late-bg text-theme-late'}`}>
                        {sub.status || 'SUBMITTED'}
                      </span>
                    </td>
                    <td className='p-4 text-theme-text-secondary'>
                      {sub.submittedAt ? format(('toDate' in sub.submittedAt ? sub.submittedAt.toDate() : sub.submittedAt), 'MMM d, yyyy HH:mm') : '—'}
                    </td>
                    <td className='p-4 font-medium'>
                      {sub.status === 'EVALUATED' ? `${sub.obtainedMarks} / ${maxMarks}` : '—'}
                    </td>
                    <td className='p-4'>
                      <button onClick={() => openEvalModal(sub)} className='text-theme-accent hover:text-theme-accent-hover font-medium'>
                        {sub.status === 'EVALUATED' ? 'Edit Marks' : 'Evaluate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-theme-muted'>No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isEvalModalOpen} onClose={() => setIsEvalModalOpen(false)} title='Evaluate Submission'>
        {selectedSub && (
          <form onSubmit={handleEvaluate} className='space-y-4'>
            <div className='bg-theme-surface-higher p-4 rounded-lg mb-4'>
              <h3 className='font-bold text-theme-primary mb-2'>Submission Content</h3>
              {selectedSub.githubUrl && (
                <a href={selectedSub.githubUrl} target="_blank" rel="noreferrer" className='flex items-center gap-2 text-theme-accent hover:underline mb-2'>
                  <FileText size={16} /> GitHub Repository
                </a>
              )}
              {selectedSub.fileUrl && (
                <div className='flex items-center gap-2 text-theme-text mb-2'>
                  <Upload size={16} className='text-theme-muted' /> File Uploaded
                </div>
              )}
              {selectedSub.folderUrl && (
                <div className='flex items-center gap-2 text-theme-text mb-2'>
                  <Upload size={16} className='text-theme-muted' /> Folder Uploaded
                </div>
              )}
              {!selectedSub.githubUrl && !selectedSub.fileUrl && !selectedSub.folderUrl && (
                <p className='text-theme-text-secondary text-sm'>No content provided.</p>
              )}
            </div>

            <div className='flex gap-4 items-center'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Obtained Marks</label>
                <input required type='number' min='0' max={selectedSub.maximumMarks || getAssignment(selectedSub.assignmentId)?.maxMarks || 100} value={evalMarks} onChange={e => setEvalMarks(e.target.value)} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none' />
              </div>
              <div className='pt-6 text-theme-muted font-bold'>
                / {selectedSub.maximumMarks || getAssignment(selectedSub.assignmentId)?.maxMarks || 100}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-theme-text-secondary mb-1'>Feedback</label>
              <textarea required value={evalFeedback} onChange={e => setEvalFeedback(e.target.value)} rows={3} className='w-full bg-theme-surface-higher border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-accent outline-none' />
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t border-theme-border-subtle'>
              <button type='button' onClick={() => setIsEvalModalOpen(false)} className='px-4 py-2 rounded-lg text-theme-text-secondary hover:bg-theme-surface-higher transition-colors'>Cancel</button>
              <button type='submit' disabled={savingEval} className='px-4 py-2 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-lg font-medium shadow-glow disabled:opacity-50'>{savingEval ? 'Saving...' : 'Save Evaluation'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminSubmissions;
