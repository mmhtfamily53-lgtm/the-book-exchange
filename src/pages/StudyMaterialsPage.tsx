import React, { useState } from 'react';
import {
  GraduationCap,
  Download,
  Eye,
  CheckCircle,
  FileText,
  Filter,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationalBoard, EducationalClass, MaterialType, StudyMaterial } from '../types';

export const StudyMaterialsPage: React.FC = () => {
  const { studyMaterials, downloadMaterial, openReaderModal, openListBookModal } = useApp();

  // Advanced Cascading Filter: Board → Class → Subject → Chapter → Material Type
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activePreviewDoc, setActivePreviewDoc] = useState<StudyMaterial | null>(null);

  const filteredMaterials = studyMaterials.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.chapter.toLowerCase().includes(q) ||
        m.uploaderName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedBoard !== 'all' && m.board !== selectedBoard) return false;
    if (selectedClass !== 'all' && m.classLevel !== selectedClass) return false;
    if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
    if (selectedMaterialType !== 'all' && m.materialType !== selectedMaterialType) return false;
    return true;
  });

  const handleDownload = (material: StudyMaterial) => {
    downloadMaterial(material.id);
    const content = material.fullContent || material.previewSnippet;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title.slice(0, 35)}.txt`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            Open-Access Educational Library
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-editorial">
            Study Materials & Revision Notes
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Free handwritten formulas, chapter summaries, 10-year solved papers, and model tests
            verified by teachers and top rankers. Free of cost for all students.
          </p>
        </div>

        <button
          onClick={openListBookModal}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4 text-slate-950" />
          <span>Upload Study Notes</span>
        </button>
      </div>

      {/* Advanced Cascading Filter: Board → Class → Subject → Chapter → Material Type */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            Curriculum Navigator: Board → Class → Subject → Material Type
          </span>
          {(selectedBoard !== 'all' || selectedClass !== 'all' || selectedSubject !== 'all' || selectedMaterialType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBoard('all');
                setSelectedClass('all');
                setSelectedSubject('all');
                setSelectedMaterialType('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword search */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              Search Topic / Chapter
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Electricity, Optics, Trees"
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 1. Board */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              1. Board
            </label>
            <select
              value={selectedBoard}
              onChange={e => setSelectedBoard(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="all">All Boards</option>
              <option value="CBSE">CBSE</option>
              <option value="NCERT">NCERT</option>
              <option value="ICSE">ICSE</option>
              <option value="RBSE">RBSE</option>
              <option value="UP Board">UP Board</option>
              <option value="Bihar Board">Bihar Board</option>
              <option value="Maharashtra Board">Maharashtra Board</option>
              <option value="College / University">College / University</option>
            </select>
          </div>

          {/* 2. Class */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              2. Class / Standard
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="all">All Classes</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="Undergraduate (UG)">Undergraduate (UG)</option>
              <option value="Competitive (JEE/NEET/UPSC/GATE)">Competitive Exams</option>
            </select>
          </div>

          {/* 3. Subject */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              3. Subject
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="Science">Science (General)</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Hindi">Hindi Literature</option>
              <option value="English">English</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          {/* 4. Material Type */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              4. Material Type
            </label>
            <select
              value={selectedMaterialType}
              onChange={e => setSelectedMaterialType(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="all">All Material Types</option>
              <option value="Chapter-wise Notes">Chapter-wise Notes</option>
              <option value="Handwritten Notes">Handwritten Notes</option>
              <option value="Formula Sheets & Cheats">Formula Sheets</option>
              <option value="Previous Year Papers">Previous Year Papers</option>
              <option value="Sample Question Papers">Sample Papers</option>
              <option value="Assignments & Worksheets">Worksheets & Problems</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-slate-400">
          <span>Found <strong>{filteredMaterials.length}</strong> verified study resources</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">All downloads 100% free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMaterials.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {m.board} • {m.classLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-slate-300">
                    {m.subject}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {m.materialType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">
                  {m.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  Chapter: <strong className="text-stone-700 dark:text-slate-300">{m.chapter}</strong>
                </p>

                <p className="text-xs text-stone-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>

                {/* Snippet box */}
                <div className="mt-3 p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-100 dark:border-slate-800 text-[11px] font-mono text-stone-700 dark:text-slate-300 line-clamp-3">
                  {m.previewSnippet}
                </div>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={m.uploaderAvatar}
                    alt={m.uploaderName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-stone-800 dark:text-slate-200">
                    {m.uploaderName}
                  </span>
                  {m.verifiedByTeacher && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5" title="Verified by Teacher">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      openReaderModal({
                        title: m.title,
                        author: `${m.uploaderName} (${m.board} ${m.classLevel})`,
                        content: m.fullContent || m.previewSnippet
                      })
                    }
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>

                  <button
                    onClick={() => handleDownload(m)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF ({m.fileSize})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
