import React from 'react';
import { MetricCard } from '../../components/lms/MetricCard';
import { Users, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { mockUsers, mockCourses, mockAssignments, mockSubmissions } from '../../mockData';

import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { adminCreateUser } from '../../services/authService';

const AdminDashboard = () => {
  const [seeding, setSeeding] = React.useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      // Seed a Team
      await setDoc(doc(db, 'teams', 'team1'), {
        id: 'team1',
        name: 'Alpha Team (Demo)',
        description: 'Test Team',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Seed a Leader
      await adminCreateUser('leader@mitra.com', 'password123', {
        name: 'Demo Leader',
        email: 'leader@mitra.com',
        role: 'Team Leader',
        teamId: 'team1',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Seed a Member
      await adminCreateUser('member@mitra.com', 'password123', {
        name: 'Demo Member',
        email: 'member@mitra.com',
        role: 'Member',
        teamId: 'team1',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      alert('Seeded test Team, Leader, and Member! Password is "password123"');
    } catch(err) {
      alert('Error seeding: ' + err);
    }
    setSeeding(false);
  };

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-theme-primary'>MITRA LMS Overview</h1>
          <p className='text-theme-text-secondary mt-1'>Ecosystem health and analytics</p>
        </div>
        <button onClick={handleSeed} disabled={seeding} className='px-4 py-2 bg-theme-accent text-white rounded-lg shadow-glow'>
          {seeding ? 'Seeding...' : 'Seed Test Team/Users'}
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title='Total Members' value={mockUsers.filter(u => u.role === 'Member').length} icon={<Users size={20} />} />
        <MetricCard title='Total Courses' value={mockCourses.length} icon={<BookOpen size={20} />} />
        <MetricCard title='Active Assignments' value={mockAssignments.length} icon={<FileText size={20} />} />
        <MetricCard title='Pending Evaluations' value={mockSubmissions.filter(s => s.status !== 'EVALUATED').length} icon={<CheckCircle size={20} className='text-theme-absent' />} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Recent Submissions</h2>
          <p className='text-theme-text-secondary text-sm'>Placeholder for submissions list.</p>
        </div>
        <div className='card p-6'>
          <h2 className='text-xl font-bold text-theme-primary mb-4'>Overall Growth Trend</h2>
          <p className='text-theme-text-secondary text-sm'>Placeholder for growth chart.</p>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
