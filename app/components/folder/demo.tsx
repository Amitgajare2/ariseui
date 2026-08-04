"use client";

import Folder from "@/components/ui/folder";

export default function Demo() {
  return (
    <div className="mx-auto max-w-6xl py-20 px-4">
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
        {/* Orange Folder */}
        <Folder
          title="Design Folder"
          fileCount={45}
          color="#ff9f1c"
        />

        {/* Black Folder */}
        <Folder
          title="Design Folder"
          fileCount={45}
          color="#6ecff8"
        />

       
      </div>
      
      
    </div>
  );
}