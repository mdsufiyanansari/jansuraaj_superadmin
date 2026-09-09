import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import SuperAdminLogout from "./SuperAdminLogout";

const navigation = [
  ['Overview', '/', '⌂'], ['Users', '/users', '♙'], ['Issues', '/issues', '▤'],
  ['Geography', '/geography', '⌖'], ['Analytics', '/analytics', '◒'], ['Calendar', '/calendar', '▣'],
  ['Alerts', '/alerts', '⚠'], ['Reports', '/reports', '▥'],
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
    {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-10 bg-slate-900/20 lg:hidden" />}
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:translate-x-0`}>
      <div className="flex items-center gap-3 px-2"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0b766d] text-xl font-bold text-white">ॐ</div><div><p className="font-bold tracking-tight">Jan Suraaj</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Admin console</p></div></div>
      <div className="mt-10 flex-1"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p><nav className="mt-3 space-y-1">{navigation.map(([label, path, icon]) => <NavLink key={label} to={path} end={path === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[#e5f4f0] text-[#08776d]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><span className="grid w-5 place-items-center text-base">{icon}</span>{label}{label === 'Alerts' && <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">12</span>}</NavLink>)}</nav><p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Manage</p><nav className="mt-3 space-y-1"><NavLink to="/admin-audit" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"><span>♙</span> Admin & Audit</NavLink><NavLink to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"><span>⚙</span> Settings</NavLink></nav>
      </div>

      <div className="mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-105 text-sm font-medium  border-2 border-red-400 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">     <SuperAdminLogout
  onLogout={() => setMobileOpen(false)}
/></div>
 
      <div className="rounded-2xl bg-[#f1f7f5] p-4"><p className="text-xs font-semibold text-[#08776d]">Bihar coverage</p><div className="mt-3 flex items-end justify-between"><span className="text-2xl font-bold">38 / 38</span><span className="text-xs text-slate-500">districts live</span></div><div className="mt-3 h-1.5 rounded-full bg-white"><div className="h-full w-full rounded-full bg-[#0b766d]" /></div></div>
    </aside>
    <main className="min-h-screen lg:pl-64"><header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200/80 bg-[#f6f8f7]/95 px-5 backdrop-blur md:px-10"><div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="text-xl lg:hidden">☰</button><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Thursday, 20 August 2026</p><h1 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">Good morning, Rahul</h1></div></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex"><span className="text-slate-400">⌕</span><input placeholder="Search anything..." className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div><button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500">♧<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" /></button><div className="grid h-10 w-10 place-items-center rounded-full bg-[#e9b949] text-sm font-bold text-white">RK</div></div></header><Outlet /></main>
  </div>
}
