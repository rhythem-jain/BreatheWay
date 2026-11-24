// ============================================================
// src/components/IAQ/IAQCenter.tsx
// Indoor Air Quality (IAQ) & CADR Architecture (Dual Theme)
// Senior Craftsmanship SaaS Design (Light & Dark WCAG AA Compliant)
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  calculateRoomVolume,
  calculateRequiredCADR,
  estimatePurificationTime,
} from '@/lib/aqiCompute';
import { WindowSchedule } from './WindowSchedule';
import { DIYHackGrid } from './DIYHackGrid';
import {
  IAQIcon,
  SparklesIcon,
  AlertTriangleIcon,
} from '@/components/ui/Icons';

export const IAQCenter = memo(function IAQCenter() {
  const { rooms, updateRoom, selectedZone } = useAppContext();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0].roomId);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.roomId === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  const roomVolumeM3 = useMemo(() => {
    return calculateRoomVolume(activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters);
  }, [activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters]);

  const requiredCadrM3H = useMemo(() => {
    return calculateRequiredCADR(roomVolumeM3, 4);
  }, [roomVolumeM3]);

  const effectiveAch = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return 0.3;
    return Math.round((activeRoom.purifierCadrM3H / roomVolumeM3) * 10) / 10;
  }, [activeRoom.purifierCadrM3H, roomVolumeM3]);

  const purificationTimeMins = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return 999;
    return estimatePurificationTime(roomVolumeM3, activeRoom.purifierCadrM3H, 0.8);
  }, [roomVolumeM3, activeRoom.purifierCadrM3H]);

  const cadrDeficit = useMemo(() => {
    return Math.max(0, requiredCadrM3H - activeRoom.purifierCadrM3H);
  }, [requiredCadrM3H, activeRoom.purifierCadrM3H]);

  const handleAreaChange = useCallback(
    (area: number) => {
      updateRoom(activeRoom.roomId, { areaSqMeters: Math.max(4, area) });
    },
    [activeRoom.roomId, updateRoom]
  );

  const handleCadrChange = useCallback(
    (cadr: number) => {
      updateRoom(activeRoom.roomId, {
        purifierCadrM3H: Math.max(0, cadr),
        hasAirPurifier: cadr > 0,
      });
    },
    [activeRoom.roomId, updateRoom]
  );

  return (
    <section
      aria-label="Indoor Air Quality and Low-Cost Hack Center"
      className="flex flex-col gap-8 fade-in"
    >
      {/* CADR Calculator & Room Profile Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
              <SparklesIcon size={13} className="text-emerald-600 dark:text-emerald-400" />
              ROOM MASS BALANCE ENGINE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <IAQIcon size={22} />
            </div>
            <span>Room CADR & Indoor Air Quality (IAQ) Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Calculate Clean Air Delivery Rate (CADR) requirements, air changes per hour (ACH), and purification duration.
          </p>
        </div>

        {/* Room Tab Selection Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          {rooms.map((room) => {
            const isSelected = room.roomId === selectedRoomId;
            return (
              <button
                key={room.roomId}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedRoomId(room.roomId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 border border-emerald-500 font-extrabold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {room.roomName}
              </button>
            );
          })}
        </div>

        {/* Room Parameters & Diagnostic Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sliders Console */}
          <div className="lg:col-span-5 bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-2xs">
            {/* Floor Area Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <label htmlFor="room-area-range" className="uppercase tracking-wider">
                  Floor Area:
                </label>
                <span className="text-emerald-800 dark:text-emerald-300 font-mono font-extrabold text-sm px-3 py-1 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
                  {activeRoom.areaSqMeters} m²
                </span>
              </div>
              <input
                id="room-area-range"
                type="range"
                min="6"
                max="80"
                step="1"
                value={activeRoom.areaSqMeters}
                onChange={(e) => handleAreaChange(parseFloat(e.target.value))}
                className="w-full mt-2 cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                <span>6 m² (Small)</span>
                <span>40 m²</span>
                <span>80 m² (Large)</span>
              </div>
            </div>

            {/* CADR Slider */}
            <div className="flex flex-col gap-3 pt-5 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <label htmlFor="room-cadr-range" className="uppercase tracking-wider">
                  Purifier Clean Air Delivery Rate (CADR):
                </label>
                <span className="text-emerald-800 dark:text-emerald-300 font-mono font-extrabold text-sm px-3 py-1 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
                  {activeRoom.purifierCadrM3H} m³/h
                </span>
              </div>
              <input
                id="room-cadr-range"
                type="range"
                min="0"
                max="600"
                step="20"
                value={activeRoom.purifierCadrM3H}
                onChange={(e) => handleCadrChange(parseFloat(e.target.value))}
                className="w-full mt-2 cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                <span>0 m³/h (None)</span>
                <span>300 m³/h</span>
                <span>600 m³/h (Max)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Display */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target CADR */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  Target CADR (4 ACH)
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono tracking-tight">
                  {requiredCadrM3H} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">m³/h</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                Volume: {roomVolumeM3} m³ ({activeRoom.ceilingHeightMeters}m ceiling).
              </p>
            </div>

            {/* Effective ACH */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  Effective Air Changes
                </span>
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2 font-mono tracking-tight">
                  {effectiveAch} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ACH</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-3 leading-relaxed font-semibold">
                {effectiveAch >= 4
                  ? '✅ Meets hospital-grade clean room target.'
                  : '⚠️ Sub-optimal air recycling rate.'}
              </p>
            </div>

            {/* 80% Clean Time */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  80% Clean Time
                </span>
                <div className="text-3xl font-black text-sky-700 dark:text-sky-400 mt-2 font-mono tracking-tight">
                  {purificationTimeMins > 120 ? 'No Purifier' : `${purificationTimeMins} mins`}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                Time required to filter out airborne ambient particles.
              </p>
            </div>
          </div>
        </div>

        {/* CADR Deficit Alert Banner */}
        {cadrDeficit > 0 && (
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shrink-0 shadow-2xs">
                <AlertTriangleIcon size={18} />
              </div>
              <div className="leading-relaxed">
                <strong className="font-extrabold">CADR Deficit Detected:</strong> Your current setup is short by{' '}
                <strong className="text-slate-900 dark:text-white font-mono font-extrabold">{cadrDeficit} m³/h</strong>. Build a low-cost{' '}
                DIY Corsi-Rosenthal Box to achieve full 4 ACH protection!
              </div>
            </div>
          </div>
        )}
      </div>

      <WindowSchedule currentAqi={selectedZone.aqi} />
      <DIYHackGrid />
    </section>
  );
});
