import React from 'react';

const LabelUi = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-start text-[1rem] font-[550] capitalize text-slate-700">
      {children}
    </div>
  );
};

export default LabelUi;
