import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, updateCourse } from '../../services/courseService';
import { fetchModulesByCourse, createModule } from '../../services/moduleService';
import { fetchLessonsByCourse, createLesson } from '../../services/lessonService';
import type { Course, Module, Lesson } from '../../types';
import { ArrowLeft, Plus, Video, BookOpen, FileText, ChevronDown, ChevronUp, Globe, Edit3 } from 'lucide-react';
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
  const [publishing, setPublishing] = useState(false);

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
      setModules(mData.sort((a, b) => a.order - b.order));
      setLessons(lData);
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

  const handleTogglePublish = async () => {
    if (!course) return;
    setPublishing(true);
    try {
      const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await updateCourse(course.id!, { status: newStatus });
      setCourse({ ...course, status: newStatus });
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const getLessonSections = (lesson: Lesson & any) => {
    const sections = [];
    if (lesson.videoUrl) sections.push(<span key='v' className='flex items-center gap-1 text-xs text-blue-400'><Video size={12} /> Video</span>);
    if (lesson.content) sections.push(<span key='t' className='flex items-center gap-1 text-xs text-green-400'><BookOpen size={12} /> Theory</span>);
    if (lesson.assignmentTitle) sections.push(<span key='a' className='flex items-center gap-1 text-xs text-yellow-400'><FileText size={12} /> Assignment</span>);
    return sections;
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

      {/* Course header */}
      <div className='card p-6 mb-8'>
        <div className='flex justify-between items-start'>
          <div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.status === 'PUBLISHED' ? 'bg-theme-present-bg text-theme-present' : 'bg-theme-late-bg text-theme-late'}`}>
              {course.status}
            </span>
            <h1 className='text-3xl font-bold text-theme-primary mt-3 mb-1'>{course.title}</h1>
            <p className='text-theme-text-secondary max-w-2xl'>{course.description}</p>
            <div className='text-sm text-theme-muted mt-2'>{course.category} · {course.difficulty} · {course.estimatedDurationMins} mins</div>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <button
              onClick={handleTogglePublish}
              disabled={publishing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                course.status === 'PUBLISHED'
                  ? 'bg-theme-surface-higher border border-theme-border text-theme-text hover:bg-theme-border'
                  : 'bg-theme-accent hover:bg-theme-accent-hover text-white shadow-glow'
              }`}
            >
              <Globe size={16} />
              {publishing ? 'Saving...' : course.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Modules section */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-theme-primary'>Modules <span className='text-theme-muted font-normal text-base'>({modules.length})</span></h2>
        <button onClick={() => setIsModuleModalOpen(true)} className='flex items-center gap-2 bg-theme-surface-higher hover:bg-theme-border text-theme-text px-4 py-2 rounded-lg border border-theme-border-subtle transition-colors'>
          <Plus size={18} />
          <span>Create Module</span>
        </button>
      </div>

      <div className='space-y-4'>
        {modules.map((module, idx) => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id);
          const isExpanded = expandedModules[module.id!] !== false;

          return (
            <div key={module.id} className='card overflow-hidden'>
              <div
                className='bg-theme-surface-higher p-4 flex justify-between items-center cursor-pointer'
                onClick={() => toggleModule(module.id!)}
              >
                <div>
                  <span className='text-xs text-theme-muted mr-2'>Module {idx + 1}</span>
                  <h3 className='font-semibold text-theme-primary inline'>{module.title}</h3>
                  {module.description && <p className='text-xs text-theme-text-secondary mt-1'>{module.description}</p>}
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs text-theme-muted'>{moduleLessons.length} {moduleLessons.length === 1 ? 'item' : 'items'}</span>
                  {isExpanded ? <ChevronUp size={20} className='text-theme-muted'/> : <ChevronDown size={20} className='text-theme-muted'/>}
                </div>
              </div>

              {isExpanded && (
                <div className='p-4 border-t border-theme-border-subtle'>
                  <div className='space-y-2'>
                    {moduleLessons.length === 0 && (
                      <p className='text-sm text-theme-muted italic py-2'>No content yet. Add module content below.</p>
                    )}
                    {moduleLessons.map(lesson => (
                      <div key={lesson.id} className='flex items-center gap-3 p-3 bg-theme-bg rounded-md border border-theme-border-subtle'>
                        <div className='flex-1'>
                          <h4 className='text-sm font-medium text-theme-text'>{lesson.title}</h4>
                          <div className='flex gap-3 mt-1'>{getLessonSections(lesson)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveModuleIdForLesson(module.id!)}
                    className='mt-3 flex items-center gap-2 text-sm text-theme-accent hover:text-theme-accent-hover font-medium'
                  >
                    <Edit3 size={16} />
                    Add Module Content
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {modules.length === 0 && (
          <div className='text-center py-12 text-theme-muted border-2 border-dashed border-theme-border-active rounded-lg'>
            No modules yet. Click <strong>Create Module</strong> to start building the curriculum.
          </div>
        )}
      </div>

      {/* Save / Publish row */}
      <div className='flex justify-end gap-3 mt-8 pt-6 border-t border-theme-border-subtle'>
        <button
          onClick={handleTogglePublish}
          disabled={publishing}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            course.status === 'PUBLISHED'
              ? 'border border-theme-border text-theme-text hover:bg-theme-surface-higher'
              : 'bg-theme-accent hover:bg-theme-accent-hover text-white shadow-glow'
          }`}
        >
          {publishing ? 'Saving...' : course.status === 'PUBLISHED' ? 'Unpublish Course' : 'Publish Course'}
        </button>
      </div>

      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title='Create Module'>
        <CreateModuleForm courseId={course.id!} orderIndex={modules.length} onCancel={() => setIsModuleModalOpen(false)} onSubmit={handleAddModule} />
      </Modal>

      <Modal isOpen={!!activeModuleIdForLesson} onClose={() => setActiveModuleIdForLesson(null)} title='Add Module Content'>
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
