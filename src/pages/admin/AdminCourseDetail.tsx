import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '../../services/courseService';
import { fetchModulesByCourse, createModule } from '../../services/moduleService';
import { fetchLessonsByCourse, createLesson } from '../../services/lessonService';
import type { Course, Module, Lesson } from '../../types';
import { ArrowLeft, Plus, Video, BookOpen, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { CreateModuleForm } from './CreateModuleForm';
import { CreateLessonForm } from './CreateLessonForm';

const AdminCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [activeModuleIdForLesson, setActiveModuleIdForLesson] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (courseId) loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      const [cData, mData, lData] = await Promise.all([
        getCourse(courseId!),
        fetchModulesByCourse(courseId!),
        fetchLessonsByCourse(courseId!)
      ]);
      setCourse(cData);
      setModules(mData);
      setLessons(lData);
      // Expand all modules by default
      const initialExpanded: Record<string, boolean> = {};
      mData.forEach(m => { initialExpanded[m.id!] = true; });
      setExpandedModules(initialExpanded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddModule = async (data: Omit<Module, 'id'>) => {
    await createModule(data);
    setIsModuleModalOpen(false);
    loadCourseData();
  };

  const handleAddLesson = async (data: Omit<Lesson, 'id' | 'contentVersion'>) => {
    await createLesson(data);
    setActiveModuleIdForLesson(null);
    loadCourseData();
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.videoUrl) return <Video size={16} className='text-blue-500' />;
    return <BookOpen size={16} className='text-green-500' />;
  };

  if (loading) return <div className='flex justify-center p-12'><div className='animate-pulse text-theme-accent'>Loading...</div></div>;
  if (!course) return <div className='text-center p-12 text-theme-absent'>Course not found</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <button 
        onClick={() => navigate('/admin/courses')}
        className='flex items-center gap-2 text-theme-text-secondary hover:text-theme-text mb-6 transition-colors'
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>

      <div className='card p-6 mb-8'>
        <div className='flex justify-between items-start'>
          <div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.status === 'PUBLISHED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-late-bg text-theme-late'}`}>
              {course.status}
            </span>
            <h1 className='text-3xl font-bold text-theme-primary mt-3 mb-1'>{course.title}</h1>
            <p className='text-theme-text-secondary max-w-2xl'>{course.description}</p>
          </div>
          <div className='text-right'>
            <div className='text-theme-accent font-bold'>{course.estimatedDurationMins} mins</div>
            <div className='text-sm text-theme-text-secondary'>{course.category} - {course.difficulty}</div>
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-theme-primary'>Curriculum</h2>
        <button onClick={() => setIsModuleModalOpen(true)} className='flex items-center gap-2 bg-theme-surface-higher hover:bg-theme-border text-theme-text px-4 py-2 rounded-lg border border-theme-border-subtle transition-colors'>
          <Plus size={18} />
          <span>Add Module</span>
        </button>
      </div>

      <div className='space-y-4'>
        {modules.map(module => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id);
          const isExpanded = expandedModules[module.id!] !== false;

          return (
            <div key={module.id} className='card overflow-hidden'>
              <div 
                className='bg-theme-surface-higher p-4 flex justify-between items-center cursor-pointer' 
                onClick={() => toggleModule(module.id!)}
              >
                <div>
                  <h3 className='font-semibold text-theme-primary'>{module.title}</h3>
                  <p className='text-xs text-theme-text-secondary mt-1'>{module.description}</p>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs text-theme-muted'>{moduleLessons.length} lessons</span>
                  {isExpanded ? <ChevronUp size={20} className='text-theme-muted'/> : <ChevronDown size={20} className='text-theme-muted'/>}
                </div>
              </div>
              
              {isExpanded && (
                <div className='p-4 border-t border-theme-border-subtle'>
                  <div className='space-y-2'>
                    {moduleLessons.map(lesson => (
                      <div key={lesson.id} className='flex items-center gap-3 p-3 bg-theme-bg rounded-md border border-theme-border-subtle'>
                        <div className='p-1.5 bg-theme-surface-higher rounded-md'>
                          {getLessonIcon(lesson)}
                        </div>
                        <div className='flex-1'>
                          <h4 className='text-sm font-medium text-theme-text'>{lesson.title}</h4>
                          <p className='text-xs text-theme-text-secondary'>{lesson.videoUrl ? 'Video' : 'Reading'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveModuleIdForLesson(module.id!)}
                    className='mt-3 flex items-center gap-2 text-sm text-theme-accent hover:text-theme-accent-hover font-medium'
                  >
                    <Plus size={16} />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {modules.length === 0 && (
          <div className='text-center py-12 text-theme-muted border2 border-dashed border-theme-border-active rounded-lg'>
            No modules yet. Click 'Add Module' to start building the curriculum.
          </div>
        )}
      </div>

      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title='Add New Module'>
        <CreateModuleForm courseId={course.id!} orderIndex={modules.length} onCancel={() => setIsModuleModalOpen(false)} onSubmit={handleAddModule} />
      </Modal>

      <Modal isOpen={!!activeModuleIdForLesson} onClose={() => setActiveModuleIdForLesson(null)} title='Add New Lesson'>
        <CreateLessonForm 
          courseId={course.id!} 
          moduleId={activeModuleIdForLesson || ''}
          orderIndex={lessons.filter(l => l.moduleId === activeModuleIdForLesson).length}
          onCancel={() => setActiveModuleIdForLesson(null)} 
          onSubmit={handleAddLesson} 
        />
      </Modal>
    </div>
  );
};

export default AdminCourseDetail;
