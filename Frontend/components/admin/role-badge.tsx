'use client'

const getRoleStyles = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-500/10';
    case 'counsellor':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
    case 'student':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/10';
  }
};


export const RoleBadge = ({ role }: { role: string }) => {
  return (
    <span className={`
      inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold 
      ring-1 ring-inset border capitalize tracking-tight
      ${getRoleStyles(role)}
    `}>
      {role}
    </span>
  );
};