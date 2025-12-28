
import React, { useState, useEffect, useMemo } from 'react';
import { PortfolioItem, CategoryType } from './types';
import { CATEGORIES, API_URL } from './constants';
import { fetchItems, saveItem, deleteItem } from './services/apiService';
import PortfolioCard from './components/PortfolioCard';
import PortfolioModal from './components/PortfolioModal';
import AdminDashboard from './components/AdminDashboard';
import { 
  Search, Grid3X3, Filter, Lock, BookOpen, GraduationCap, 
  Loader2, User, Home, Award, FileStack, Mail, Menu, X, ChevronRight,
  Book, Monitor, BarChart3, Users, HeartHandshake, ClipboardList, Zap, Rocket, RefreshCcw
} from 'lucide-react';

type TabType = 'HOME' | 'ABOUT' | 'CRITERIA' | 'REPOSITORY' | 'CONTACT';

const App: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ทั้งหมด'>('ทั้งหมด');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchItems();
    setItems(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'ทั้งหมด' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, activeCategory]);

  const navItems = [
    { id: 'HOME', label: 'หน้าแรก', icon: Home },
    { id: 'ABOUT', label: 'เกี่ยวกับครู', icon: User },
    { id: 'CRITERIA', label: 'ผลงานตามเกณฑ์ ว9', icon: Award },
    { id: 'REPOSITORY', label: 'คลังผลงาน', icon: FileStack },
    { id: 'CONTACT', label: 'ติดต่อ', icon: Mail },
  ];

  const paSections = [
    {
      title: "1. ด้านการจัดการเรียนการสอน",
      color: "indigo",
      points: [
        { id: "1.1 การสร้างและ/หรือพัฒนาหลักสูตร", label: "1.1 การสร้าง/พัฒนาหลักสูตร", icon: Book, desc: "หลักสูตรรายวิชา / แผนการสอน" },
        { id: "1.2 การจัดการเรียนรู้", label: "1.2 การจัดการเรียนรู้", icon: Users, desc: "ภาพกิจกรรม / วิดีโอการสอน / Active Learning" },
        { id: "1.3 การสร้างและพัฒนา สื่อ นวัตกรรม...", label: "1.3 สื่อ นวัตกรรม และเทคโนโลยี", icon: Monitor, desc: "สื่อดิจิทัล / YouTube / บอร์ดเกม" },
        { id: "1.4 การวัดและประเมินผลการเรียนรู้", label: "1.4 การวัดและประเมินผล", icon: BarChart3, desc: "แบบทดสอบ / Rubric / สรุปคะแนน" },
        { id: "1.5 การวิจัยเพื่อพัฒนาการเรียนรู้", label: "1.5 การวิจัยเพื่อพัฒนาการเรียนรู้", icon: Search, desc: "รายงานวิจัยในชั้นเรียน / PDF" },
      ]
    },
    {
      title: "2. ด้านการบริหารจัดการชั้นเรียน",
      color: "rose",
      points: [
        { id: "2.1 การบริหารจัดการชั้นเรียน", label: "2.1 การบริหารจัดการชั้นเรียน", icon: Zap, desc: "บรรยากาศชั้นเรียน / วินัยเชิงบวก" },
        { id: "2.2 การจัดระบบดูแลช่วยเหลือผู้เรียน", label: "2.2 ระบบดูแลช่วยเหลือผู้เรียน", icon: HeartHandshake, desc: "คัดกรอง / เยี่ยมบ้าน / แนะแนว" },
        { id: "2.3 การจัดทำข้อมูลสารสนเทศ...", label: "2.3 ข้อมูลสารสนเทศและเอกสาร", icon: ClipboardList, desc: "Dashboard / ปพ. / สรุปสถิติ" },
      ]
    },
    {
      title: "3. ด้านการพัฒนาตนเองและวิชาชีพ",
      color: "emerald",
      points: [
        { id: "3.1 การพัฒนาตนเอง", label: "3.1 การพัฒนาตนเอง", icon: Rocket, desc: "เกียรติบัตร / วุฒิบัตร / การอบรม" },
        { id: "3.2 การพัฒนาวิชาชีพ", label: "3.2 การพัฒนาวิชาชีพ (PLC)", icon: GraduationCap, desc: "บันทึก PLC / การเผยแพร่ผลงาน" },
      ]
    }
  ];

  if (isAdmin) {
    return (
      <AdminDashboard 
        items={items} 
        onSave={async (item, action) => {
          setIsSaving(true);
          const success = await saveItem(item, action);
          if (success) {
            // Google Sheets takes time to reflect changes, we wait 3 seconds before reloading
            setTimeout(loadData, 3000);
          } else {
            alert('ไม่สามารถบันทึกได้ โปรดตรวจสอบการตั้งค่า GAS');
            setIsSaving(false);
          }
        }} 
        onDelete={async (id) => {
          setIsSaving(true);
          const success = await deleteItem(id);
          if (success) {
            setTimeout(loadData, 3000);
          } else {
            alert('ไม่สามารถลบได้');
            setIsSaving(false);
          }
        }} 
        onLogout={() => setIsAdmin(false)}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun']">
      {/* API Warning for User */}
      {API_URL.includes('YOUR_SCRIPT_ID') && (
        <div className="bg-amber-500 text-white text-xs py-2 text-center font-bold">
          ⚠️ คำเตือน: ระบบยังไม่ได้เชื่อมต่อกับ Google Sheets (ยังเป็น URL ตัวอย่าง)
        </div>
      )}

      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">TEACHER PORTFOLIO</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((nav) => (
              <button
                key={nav.id}
                onClick={() => { setCurrentTab(nav.id as TabType); window.scrollTo(0,0); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentTab === nav.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadData} 
              className={`p-2 text-slate-400 hover:text-indigo-600 transition-colors ${loading ? 'animate-spin' : ''}`}
              title="รีเฟรชข้อมูล"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button onClick={() => setShowLogin(true)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Lock className="w-5 h-5" /></button>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2">
            {navItems.map((nav) => (
              <button key={nav.id} onClick={() => { setCurrentTab(nav.id as TabType); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                  currentTab === nav.id ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-50'
                }`}
              >
                <nav.icon className="w-4 h-4" /> {nav.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {currentTab === 'HOME' && (
          <div className="animate-in fade-in duration-500">
            <section className="bg-indigo-900 py-20 md:py-32 px-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
               <div className="max-w-7xl mx-auto text-center relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-indigo-500/30 text-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Online Academic Portfolio</span>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">รวบรวมผลงานวิชาการ <br/> และหลักฐานการประเมิน ว9/PA</h1>
                  <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">แสดงนวัตกรรม การจัดการเรียนรู้ และผลลัพธ์ผู้เรียนอย่างเป็นระบบ พร้อมรองรับการประเมินวิทยฐานะดิจิทัล</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => setCurrentTab('CRITERIA')} className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform">ดูผลงานตามเกณฑ์ ว9</button>
                    <button onClick={() => setCurrentTab('REPOSITORY')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl border border-indigo-400 hover:bg-indigo-500">สำรวจคลังผลงาน</button>
                  </div>
               </div>
            </section>
            
            <section className="max-w-7xl mx-auto px-4 -mt-10 mb-20 relative z-20">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-start gap-4">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0"><Award /></div>
                     <div><h4 className="font-black text-slate-800 text-lg">PA Ready</h4><p className="text-sm text-slate-500 mt-1">จัดเรียงผลงานตามตัวชี้วัด ว9 ครบทุกด้าน</p></div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-start gap-4">
                     <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0"><FileStack /></div>
                     <div><h4 className="font-black text-slate-800 text-lg">Multi-Media</h4><p className="text-sm text-slate-500 mt-1">รองรับทั้ง PDF, วิดีโอสอน และสื่อปฏิสัมพันธ์</p></div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-start gap-4">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0"><Monitor /></div>
                     <div><h4 className="font-black text-slate-800 text-lg">Modern UI</h4><p className="text-sm text-slate-500 mt-1">เข้าถึงง่ายบนทุกอุปกรณ์สำหรับกรรมการและนักเรียน</p></div>
                  </div>
               </div>
            </section>
          </div>
        )}

        {currentTab === 'ABOUT' && (
          <div className="max-w-5xl mx-auto px-4 py-16 animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="h-64 bg-indigo-600 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-transparent"></div>
                </div>
                <div className="px-8 md:px-16 pb-16 -mt-32 relative">
                   <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                      <div className="w-48 h-48 bg-white p-3 rounded-[2.5rem] shadow-2xl relative">
                         <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 overflow-hidden">
                            <User className="w-24 h-24" />
                         </div>
                      </div>
                      <div className="pb-4 text-center md:text-left">
                         <h2 className="text-4xl font-black text-slate-800">ชื่อ-นามสกุล ของท่านครู</h2>
                         <p className="text-indigo-600 font-bold text-xl mt-1">ตำแหน่ง ครู วิทยฐานะครูชำนาญการพิเศษ</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                      <div className="space-y-8">
                         <div>
                            <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div> ประวัติการศึกษา
                            </h4>
                            <ul className="space-y-3 text-slate-600 font-medium">
                               <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div> ค.บ. คอมพิวเตอร์ศึกษา (เกียรตินิยม)</li>
                               <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div> ศษ.ม. การบริหารการศึกษา</li>
                            </ul>
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div> ความเชี่ยวชาญ
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               {['Active Learning', 'EdTech', 'Robotics', 'Web Design'].map(t => (
                                 <span key={t} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold">{t}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                         <h4 className="text-xl font-black text-slate-800 mb-2">ข้อมูลเบื้องต้น</h4>
                         <p className="text-slate-500 leading-relaxed font-medium">ท่านสามารถใส่คำแนะนำตนเองสั้นๆ เกี่ยวกับอุดมการณ์การสอน หรือเป้าหมายในการพัฒนาผู้เรียนได้ในส่วนนี้ เพื่อให้ผู้เข้าชมได้รู้จักตัวตนของครูผู้สอนมากยิ่งขึ้น</p>
                         <div className="pt-4 border-t border-slate-200 space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-slate-400">สังกัด:</span> <span className="font-bold text-slate-700">กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400">โรงเรียน:</span> <span className="font-bold text-slate-700">ระบุชื่อโรงเรียนของท่าน</span></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {currentTab === 'CRITERIA' && (
          <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-500">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black text-slate-800 mb-4">เกณฑ์การประเมิน ว9 (PA)</h2>
               <p className="text-slate-500 max-w-2xl mx-auto font-medium">เลือกหัวข้อที่ต้องการตรวจสอบหลักฐานและผลการดำเนินงานตามมาตรฐานวิทยฐานะ</p>
            </div>

            <div className="space-y-16">
               {paSections.map((section, sIdx) => (
                 <div key={sIdx}>
                    <div className="flex items-center gap-4 mb-8">
                       <h3 className="text-2xl font-black text-slate-800">{section.title}</h3>
                       <div className="flex-grow h-px bg-slate-200"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {section.points.map((p, pIdx) => (
                         <button 
                           key={pIdx}
                           onClick={() => { setActiveCategory(p.id as CategoryType); setCurrentTab('REPOSITORY'); window.scrollTo(0,0); }}
                           className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col h-full"
                         >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                              section.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
                              section.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                               <p.icon className="w-7 h-7" />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{p.label}</h4>
                            <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed font-medium">{p.desc}</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                               <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">View Evidence</span>
                               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <ChevronRight className="w-4 h-4" />
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {currentTab === 'REPOSITORY' && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
              <div>
                 <h2 className="text-3xl font-black text-slate-800">คลังผลงาน</h2>
                 <p className="text-slate-400 mt-1 font-medium">รวมสื่อ นวัตกรรม และเอกสารวิชาการทั้งหมด</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                   <input 
                    type="text" placeholder="ค้นหาผลงาน..."
                    className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm w-full sm:w-64 transition-all"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <select 
                  className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
                  value={activeCategory} onChange={(e) => setActiveCategory(e.target.value as any)}
                >
                   <option value="ทั้งหมด">ทุกหมวดหมู่</option>
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                 <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                 <p className="text-slate-400 font-bold">กำลังโหลดคลังผลงาน...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredItems.map(item => <PortfolioCard key={item.id} item={item} onClick={setSelectedItem} />)}
                </div>
                {filteredItems.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"><FileStack className="w-10 h-10" /></div>
                     <h4 className="text-xl font-black text-slate-800">ไม่พบผลงานในหมวดหมู่นี้</h4>
                     <p className="text-slate-400 mt-2 font-medium">ลองเปลี่ยนหมวดหมู่หรือคำค้นหาเพื่อดูรายการอื่นๆ</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {currentTab === 'CONTACT' && (
          <div className="max-w-4xl mx-auto px-4 py-24 animate-in fade-in duration-500">
             <div className="text-center mb-16">
               <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">Get In Touch</span>
               <h2 className="text-4xl font-black text-slate-800 mt-2">ติดต่อและดาวน์โหลด</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                   <h3 className="text-2xl font-black mb-8">ข้อมูลการติดต่อ</h3>
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Mail className="w-5 h-5" /> <span>teacher@school.ac.th</span></div>
                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Home className="w-5 h-5" /> <span>โรงเรียน... จ. ...</span></div>
                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"><Users className="w-5 h-5" /> <span>กลุ่มสาระการเรียนรู้...</span></div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-800 mb-6">ไฟล์ประกอบการประเมิน</h3>
                   {[
                     { name: 'แบบข้อตกลงในการพัฒนางาน (PA) 2567', type: 'PDF' },
                     { name: 'คู่มือการประเมินวิทยฐานะ (ว9)', type: 'PDF' },
                     { name: 'แผนการจัดการเรียนรู้บูรณาการ', type: 'ZIP' },
                   ].map((f, idx) => (
                     <button key={idx} className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl hover:border-indigo-600 transition-all group">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><FileStack className="w-5 h-5" /></div>
                           <div><p className="font-black text-slate-800 text-sm">{f.name}</p><span className="text-xs text-slate-400 font-bold">{f.type}</span></div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><GraduationCap /></div>
              <div className="text-left"><p className="font-black text-slate-800 leading-none">TEACHER PORTFOLIO</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Academic Excellence</p></div>
           </div>
           <div className="text-center text-slate-400 text-sm font-medium">
             &copy; {new Date().getFullYear()} พัฒนาโดย คณะครูเพื่อการศึกษาไทย <br className="md:hidden"/> <span className="hidden md:inline">|</span> สนับสนุนนวัตกรรมการเรียนรู้
           </div>
           <div className="flex gap-8">
              {['Home', 'Criteria', 'Privacy'].map(l => <a key={l} href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">{l}</a>)}
           </div>
        </div>
      </footer>

      <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8" /></div>
            <h2 className="text-2xl font-black text-center mb-8">Admin Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
              <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all mt-4">เข้าสู่ระบบ</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors">ยกเลิก</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
