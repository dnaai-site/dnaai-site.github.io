import React from 'react';

const MentionSuggestions = ({ suggestions, onSelect, position }) => {
    if (!suggestions.length) return null;
    return (
        <div
            className="absolute bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden min-w-[220px] animate-slide-up"
            style={{
                top: position.top === 'auto' ? 'unset' : position.top,
                bottom: position.bottom === 'auto' ? 'unset' : position.bottom,
                left: position.left,
                transform: position.bottom !== 'auto' ? 'translateY(-10px)' : 'translateY(10px)'
            }}
        >
            <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gợi ý thành viên</span>
            </div>
            {suggestions.map(u => (
                <div
                    key={u.uid}
                    onClick={() => onSelect(u.username)}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-50/50 flex items-center gap-3 transition-all border-b border-gray-50 last:border-none group"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm transition-transform group-hover:scale-110 ${u.isAI ? 'bg-gradient-to-tr from-indigo-600 to-purple-500' : 'bg-gray-400'}`}>
                        {u.isAI ? '✨' : u.username[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="font-bold text-sm text-gray-900 leading-tight">@{u.username}</span>
                        {u.isAI && <span className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter">HeartAI Official</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MentionSuggestions;
