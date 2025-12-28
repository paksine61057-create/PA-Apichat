
import React, { useState, useEffect, useMemo } from 'react';
import { PortfolioItem, CategoryType } from './types';
import { CATEGORIES, API_URL } from './constants';
import { fetchItems, saveItem, deleteItem } from './services/apiService';
import PortfolioCard from './components/PortfolioCard';
import PortfolioModal from './components/PortfolioModal';
import AdminDashboard from './components/AdminDashboard';
import { 
  Search, Lock, GraduationCap, Loader2, User, Home, Award, 
  FileStack, Mail, Menu, X, ChevronRight, Book, Monitor, 
  BarChart3, Users, HeartHandshake, ClipboardList, Zap, Rocket, 
  RefreshCcw, AlertCircle, ExternalLink, Globe, BookOpen, Layers
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

  const isConfigured = useMemo(() => {
    return API_URL && !API_URL.includes('ระบุ_ID_ที่นี่') && !API_URL.includes('YOUR_SCRIPT_ID');
  }, []);

  useEffect(() => { 
    if (isConfigured) {
      loadData(); 
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Username: admin / Pass: 1234)');
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
            await loadData();
          } else {
            alert('ไม่สามารถบันทึกได้ โปรดตรวจสอบ URL ใน constants.tsx');
          }
          setIsSaving(false);
        }} 
        onDelete={async (id) => {
          setIsSaving(true);
          const success = await deleteItem(id);
          if (success) {
            await loadData();
          } else {
            alert('ไม่สามารถลบได้');
          }
          setIsSaving(false);
        }} 
        onLogout={() => setIsAdmin(false)}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun']">
      {!isConfigured && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg shadow-2xl animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12" />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-4">ยังไม่ได้ตั้งค่า API_URL</h2>
             <p className="text-slate-500 mb-8 leading-relaxed">
                กรุณานำ URL ที่ได้จาก Google Apps Script มาวางในไฟล์ <code className="bg-slate-100 px-2 py-1 rounded text-rose-500 font-bold">constants.tsx</code>
             </p>
             <button onClick={() => window.location.reload()} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <RefreshCcw className="w-5 h-5" /> ตรวจสอบอีกครั้ง
             </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:block uppercase">TEACHER PORTFOLIO</span>
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
              disabled={loading}
              className={`p-2 text-slate-400 hover:text-indigo-600 transition-colors ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button onClick={() => setShowLogin(true)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Lock className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top duration-300">
            {navItems.map((nav) => (
              <button
                key={nav.id}
                onClick={() => { setCurrentTab(nav.id as TabType); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold ${
                  currentTab === nav.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
             <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
             <p className="text-slate-400 font-bold">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <>
            {currentTab === 'HOME' && (
              <div className="animate-in fade-in duration-500">
                <section className="bg-indigo-900 py-20 md:py-32 px-4 relative overflow-hidden text-center">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
                   <div className="max-w-7xl mx-auto relative z-10">
                      <span className="inline-block px-4 py-1.5 bg-indigo-500/30 text-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Online Academic Portfolio</span>
                      <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">รวบรวมผลงานวิชาการ <br/> และหลักฐานการประเมิน ว9/PA</h1>
                      <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">แสดงนวัตกรรม การจัดการเรียนรู้ และผลลัพธ์ผู้เรียนอย่างเป็นระบบ พร้อมรองรับการประเมินวิทยฐานะดิจิทัล</p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => setCurrentTab('REPOSITORY')} className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform">สำรวจคลังผลงาน</button>
                        <button onClick={() => setCurrentTab('ABOUT')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl border border-indigo-400 hover:bg-indigo-500">เกี่ยวกับผู้จัดทำ</button>
                      </div>
                   </div>
                </section>
                <section className="py-20 px-4 max-w-7xl mx-auto">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                         <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Globe className="w-8 h-8"/></div>
                         <h3 className="text-xl font-bold text-slate-800 mb-3">เข้าถึงได้ทุกที่</h3>
                         <p className="text-slate-500 leading-relaxed">รวบรวมไฟล์ PDF, วิดีโอ YouTube และรูปภาพกิจกรรมไว้ในหน้าเดียว เปิดดูได้ทันทีไม่ต้องโหลดไฟล์ลงเครื่อง</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                         <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><BookOpen className="w-8 h-8"/></div>
                         <h3 className="text-xl font-bold text-slate-800 mb-3">จัดหมวดหมู่ชัดเจน</h3>
                         <p className="text-slate-500 leading-relaxed">แบ่งหมวดหมู่ตามเกณฑ์การประเมิน PA ครบทั้ง 3 ด้าน 15 ตัวชี้วัด ค้นหาง่ายด้วยระบบกรองข้อมูล</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                         <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Layers className="w-8 h-8"/></div>
                         <h3 className="text-xl font-bold text-slate-800 mb-3">อัปเดตข้อมูล Real-time</h3>
                         <p className="text-slate-500 leading-relaxed">เชื่อมต่อกับ Google Sheets โดยตรง เมื่อแอดมินแก้ไขข้อมูลในระบบ หน้าเว็บจะอัปเดตทันที</p>
                      </div>
                   </div>
                </section>
              </div>
            )}

            {currentTab === 'ABOUT' && (
              <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                 <div className="w-48 h-48 bg-slate-200 rounded-full mx-auto mb-8 overflow-hidden border-8 border-white shadow-xl">
                    <img src="https://images.unsplash.com/photo-1544717297-fa154daaf762?w=400&h=400&fit=crop" alt="Teacher" className="w-full h-full object-cover" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 mb-4">ชื่อ-นามสกุล ของท่าน</h2>
                 <p className="text-indigo-600 font-bold text-xl mb-6">ตำแหน่ง ครู วิทยฐานะ...</p>
                 <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto text-lg mb-12">
                   ยินดีต้อนรับสู่พอร์ตโฟลิโอออนไลน์ รวบรวมผลงานการจัดการเรียนรู้ นวัตกรรมการศึกษา และการพัฒนาตนเองอย่างต่อเนื่อง เพื่อยกระดับคุณภาพการศึกษาและพัฒนาผู้เรียนอย่างรอบด้าน
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100">
                       <h4 className="font-bold text-slate-800 mb-2">การศึกษา</h4>
                       <ul className="text-slate-500 space-y-1">
                          <li>ปริญญาตรี ครุศาสตรบัณฑิต (สาขา...)</li>
                          <li>ปริญญาโท ศึกษาศาสตรมหาบัณฑิต (สาขา...)</li>
                       </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100">
                       <h4 className="font-bold text-slate-800 mb-2">สถานศึกษา</h4>
                       <p className="text-slate-500">โรงเรียน....................................</p>
                       <p className="text-slate-500">สังกัด........................................</p>
                    </div>
                 </div>
              </div>
            )}

            {currentTab === 'CRITERIA' && (
              <div className="max-w-7xl mx-auto px-4 py-16">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">ผลงานตามเกณฑ์การประเมิน ว9/PA</h2>
                    <p className="text-slate-500">เลือกดูผลงานแยกตามตัวชี้วัดเพื่อความสะดวกในการประเมิน</p>
                 </div>
                 <div className="space-y-16">
                    {paSections.map((section, sIdx) => (
                       <div key={sIdx}>
                          <h3 className={`text-2xl font-black mb-8 pb-4 border-b-4 border-${section.color}-500 inline-block`}>{section.title}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                             {section.points.map((point) => (
                                <button 
                                  key={point.id}
                                  onClick={() => { setActiveCategory(point.id as any); setCurrentTab('REPOSITORY'); }}
                                  className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-500 hover:shadow-xl transition-all group text-left"
                                >
                                   <div className={`w-12 h-12 bg-${section.color}-50 text-${section.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                      <point.icon className="w-6 h-6" />
                                   </div>
                                   <h4 className="font-bold text-slate-800 mb-2 line-clamp-1">{point.label}</h4>
                                   <p className="text-slate-400 text-sm">{point.desc}</p>
                                   <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      ดูผลงานทั้งหมด <ChevronRight className="w-3 h-3" />
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

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.map(item => <PortfolioCard key={item.id} item={item} onClick={setSelectedItem} />)}
                 </div>

                 {filteredItems.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"><FileStack className="w-10 h-10" /></div>
                     <h4 className="text-xl font-black text-slate-800">ไม่พบผลงานในหมวดหมู่นี้</h4>
                     <p className="text-slate-400 mt-2 font-medium">ลองเปลี่ยนหมวดหมู่หรือคำค้นหา</p>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'CONTACT' && (
              <div className="max-w-4xl mx-auto px-4 py-20">
                 <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
                    <div className="bg-indigo-600 p-12 text-white md:w-1/3 flex flex-col justify-center">
                       <h2 className="text-3xl font-black mb-6">ติดต่อครู</h2>
                       <p className="opacity-80 mb-8">สามารถสอบถามข้อมูลเพิ่มเติมหรือแลกเปลี่ยนเรียนรู้วิชาชีพ</p>
                       <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5"/></div>
                             <span className="font-bold">email@school.ac.th</span>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5"/></div>
                             <span className="font-bold">www.facebook.com/teacher</span>
                          </div>
                       </div>
                    </div>
                    <div className="p-12 md:w-2/3">
                       <h3 className="text-2xl font-black text-slate-800 mb-6">ส่งข้อความ</h3>
                       <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('ระบบจำลอง: ข้อความถูกส่งแล้ว'); }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <input type="text" placeholder="ชื่อของคุณ" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                             <input type="email" placeholder="อีเมลติดต่อ" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                          </div>
                          <textarea placeholder="ข้อความของคุณ..." rows={4} className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" required></textarea>
                          <button className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">ส่งข้อความ</button>
                       </form>
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16 px-4 text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} Teacher Digital Portfolio Hub</p>
        <p className="text-slate-300 text-xs mt-2 italic">Powering Professional Growth through Technology</p>
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
