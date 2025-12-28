
import { CategoryType, MediaType } from './types';

export const CATEGORIES: CategoryType[] = [
  '1.1 การสร้างและ/หรือพัฒนาหลักสูตร',
  '1.2 การจัดการเรียนรู้',
  '1.3 การสร้างและพัฒนา สื่อ นวัตกรรม...',
  '1.4 การวัดและประเมินผลการเรียนรู้',
  '1.5 การวิจัยเพื่อพัฒนาการเรียนรู้',
  '2.1 การบริหารจัดการชั้นเรียน',
  '2.2 การจัดระบบดูแลช่วยเหลือผู้เรียน',
  '2.3 การจัดทำข้อมูลสารสนเทศ...',
  '3.1 การพัฒนาตนเอง',
  '3.2 การพัฒนาวิชาชีพ',
  'นวัตกรรม',
  'วิจัย',
  'สื่อการเรียนรู้',
  'อื่นๆ'
];

export const MEDIA_TYPES: MediaType[] = ['PDF', 'YouTube', 'Image', 'Video'];

// URL นี้ต้องเปลี่ยนเป็น URL จากการ Deploy Google Apps Script
export const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
