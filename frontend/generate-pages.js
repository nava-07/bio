const fs = require('fs');
const path = require('path');

const pages = [
  'about',
  'skills',
  'projects',
  'education',
  'experience',
  'achievements',
  'technologies',
  'contact'
];

const basePath = 'c:/project/Biopic/frontend/src/app';

pages.forEach(p => {
  const compName = p.charAt(0).toUpperCase() + p.slice(1);
  const dirPath = path.join(basePath, p);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  
  const content = `"use client";

import CustomCursor from "@/components/CustomCursor";
import Background3D from "@/components/Background3D";
import Navbar from "@/components/Navbar";
import ${compName} from "@/components/${compName}";

export default function ${compName}Page() {
  return (
    <main className="relative w-full min-h-screen bg-[#030303]">
      <CustomCursor />
      <div className="relative z-10">
        <Background3D />
        <Navbar />
        <div className="pt-20">
          <${compName} />
        </div>
      </div>
    </main>
  );
}
`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});
