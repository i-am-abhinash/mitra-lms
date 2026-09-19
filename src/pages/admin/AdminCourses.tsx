import React, { useEffect, useState } from 'react';
import { fetchCourses, deleteCourse } from '../../services/courseService';
import type { Course } from '../../types';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { CreateCourseForm } from './CreateCourseForm';
import { createCourse } from '../../services/courseService';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
      loadCourses();
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>Manage Courses</h1>
          <p className='text-theme-text-secondary text-sm mt-1'>Create and manage learning paths for MITRA</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className='flex items-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-lg transition-colors shadow-glow'>
          <Plus size={18} />
          <span>New Course</span>
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center p-12'><div className='animate-pulse text-theme-accent'>Loading...</div></div>
      ) : courses.length === 0 ? (
        <div className='card p-12 flex flex-col items-center justify-center text-center'>
          <BookOpen size={48} className='text-theme-muted mb-4' />
          <h3 className='text-lg font-medium text-theme-text'>No courses found</h3>
          <p className='text-theme-text-secondary text-sm mt-2'>Start by creating your first course</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map(course => (
            <div key={course.id} onClick={() => navigate(`/admin/courses/${course.id}`)} className='card p-5 group flex flex-col cursor-pointer hover:border-theme-accent transition-colors'>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex items-center gap-2'>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.status === 'PUBLISHED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-late-bg text-theme-late'}`}>
                    {course.status}
                  </span>
                  <span className='text-xs px-2 py-1 rounded-full bg-theme-surface-elevated text-theme-text-secondary font-medium'>
                    {course.difficulty}
                  </span>
                </div>
                <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button className='p-1.5 text-theme-text-secondary hover:text-theme-accent hover:bg-theme-surface-higher rounded-md transition-colors'><Edit2 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(course.id!); }} className='p-1.5 text-theme-text-secondary hover:text-theme-absent hover:bg-theme-absent-bg rounded-md transition-colors'><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className='text-lg font-semibold text-theme-primary mb-2 line-clamp-1'>{course.title}</h3>
              <p className='text-theme-text-secondary text-sm line-clamp-2 mb-4 flex-1'>{course.description}</p>
              <div className='flex justify-between items-center text-xs text-theme-muted pt-4 border-t border-theme-border'>
                <span>{course.category}</span>
                <span>{course.estimatedDurationMins} mins</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Create New Course'>
        <CreateCourseForm 
          onCancel={() => setIsModalOpen(false)} 
          onSubmit={async (data) => { await createCourse(data); setIsModalOpen(false); loadCourses(); }} 
        />
      </Modal>
    </div>
  );
};

export default AdminCourses;
