
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GraveyardDashPuzzleProps {
    onSolve: () => void;
    onFail: () => void;
}

const GraveyardDashPuzzle: React.FC<GraveyardDashPuzzleProps> = ({ onSolve, onFail }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const game = useRef<any>(null); // To hold all game state and methods

    const [hud, setHud] = useState({ time: 60, lives: 3, score: 0 });
    const [status, setStatus] = useState<'playing' | 'paused' | 'won' | 'lost'>('playing');

    const handleGameOver = useCallback((win: boolean) => {
        if (win) {
            setStatus('won');
            setTimeout(onSolve, 1500);
        } else {
            setStatus('lost');
            setTimeout(onFail, 1500);
        }
    }, [onSolve, onFail]);

    // --- Initialize Game ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width, H = canvas.height;
        const keys = new Set();

        const state = {
            running: true, paused: false,
            time: 60, lives: 3, score: 0, soulsNeeded: 5,
            player: { x: W * 0.1, y: H * 0.5, r: 14, speed: 220 },
            ghosts: [] as any[], souls: [] as any[], particles: [] as any[]
        };
        game.current = { ctx, W, H, keys, state, animationFrameId: null, lastTime: 0, accumulator: 0 };
        
        // --- Game Logic (adapted from original script) ---
        const clamp = (v:number,a:number,b:number) => Math.max(a, Math.min(b,v));
        const dist = (a:{x:number,y:number},b:{x:number,y:number}) => { const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); };

        const makeSoul = () => ({x:Math.random()*(W*0.8)+W*0.15, y:Math.random()*(H*0.8)+H*0.1, r:10+Math.random()*5, p:0});
        const makeGhost = () => {
            const side = Math.random()<0.5? -40: W+40;
            const y = Math.random()*H*0.8+H*0.1;
            const speed = 70+Math.random()*80;
            const drift = (Math.random()*0.6+0.3) * (Math.random()<0.5?-1:1);
            return {x:side, y, r:18, speed:Math.sign(W/2 - side)*speed, drift, phase:Math.random()*Math.PI*2};
        };
        const poof = (x:number,y:number,c:string) => {
          for(let i=0;i<14;i++) state.particles.push({x,y, vx:(Math.random()*2-1)*80, vy:(Math.random()*2-1)*80, life:0.6, c});
        };

        const spawnWave = () => {
            for(let i=0;i<4;i++) state.souls.push(makeSoul());
            for(let i=0;i<3;i++) state.ghosts.push(makeGhost());
        };
        spawnWave();

        const update = (dt: number) => {
            if (!state.running || state.paused) return;
            game.current.accumulator += dt;
            if (game.current.accumulator >= 1) {
                game.current.accumulator -= 1;
                state.time--;
                if (state.time <= 0) { 
                    state.running = false; 
                    handleGameOver(false); 
                    return;
                }
            }
            const p = state.player, sp = p.speed;
            if(keys.has('ArrowLeft')) p.x -= sp*dt;
            if(keys.has('ArrowRight')) p.x += sp*dt;
            if(keys.has('ArrowUp')) p.y -= sp*dt;
            if(keys.has('ArrowDown')) p.y += sp*dt;
            p.x = clamp(p.x, 10, W-10); p.y = clamp(p.y, 10, H-10);
            for(const g of state.ghosts){ g.x += g.speed*dt; g.y += Math.sin((performance.now()/1000)*1.5 + g.phase)*25*dt + g.drift; }
            state.ghosts = state.ghosts.filter(g=> g.x>-60 && g.x<W+60);
            while(state.ghosts.length<4) state.ghosts.push(makeGhost());
            for(const s of state.souls) s.p += dt*3;
            for(let i=state.souls.length-1;i>=0;i--){
                const s = state.souls[i]; if(dist(p,s) < p.r + s.r){ 
                    state.souls.splice(i,1); 
                    state.score++; 
                    poof(s.x,s.y,'#66e2ff'); 
                    if(state.score>=state.soulsNeeded) { 
                        state.running = false; 
                        handleGameOver(true); 
                        return;
                    } 
                    state.souls.push(makeSoul()); 
                }
            }
            for(let i=state.ghosts.length-1;i>=0;i--){
                const g = state.ghosts[i]; if(dist(p,g) < p.r + g.r){ 
                    state.ghosts.splice(i,1); 
                    state.lives--; 
                    poof(p.x,p.y,'#ff4d4d'); 
                    if(state.lives<=0) { 
                        state.running = false; 
                        handleGameOver(false); 
                        return;
                    } 
                }
            }
            for(const prt of state.particles){ prt.life -= dt; prt.x += prt.vx*dt; prt.y += prt.vy*dt; }
            state.particles = state.particles.filter(p=>p.life>0);

            setHud({ time: state.time, lives: state.lives, score: state.score });
        };
        
        // --- Drawing Functions ---
        const draw = () => {
            ctx.clearRect(0,0,W,H);
            const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0b1420'); g.addColorStop(.7,'#070b11'); g.addColorStop(1,'#04070b');
            ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
            ctx.save(); ctx.translate(W*0.8, H*0.18); const r=42; const grd = ctx.createRadialGradient(0,0,1,0,0,r); grd.addColorStop(0,'#cfe0ff'); grd.addColorStop(1,'#86a3c8'); ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill(); const halo = ctx.createRadialGradient(0,0, r*0.8, 0,0, r*2.2); halo.addColorStop(0,'#9ec0ff22'); halo.addColorStop(1,'#0000'); ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.fill(); ctx.restore();
            for(const s of state.souls){ const pul = (Math.sin(s.p*2)+1)/2; const r2 = s.r + pul*2; const grd2 = ctx.createRadialGradient(s.x,s.y, r2*0.2, s.x,s.y, r2); grd2.addColorStop(0,'#d6f6ff'); grd2.addColorStop(.6,'#66e2ff'); grd2.addColorStop(1,'#66e2ff00'); ctx.fillStyle=grd2; ctx.beginPath(); ctx.arc(s.x,s.y,r2,0,Math.PI*2); ctx.fill(); }
            for(const gh of state.ghosts){ ctx.save(); ctx.translate(gh.x,gh.y); ctx.fillStyle='#d9d9d9'; ctx.globalAlpha=0.75; ctx.beginPath(); ctx.ellipse(0,0,gh.r, gh.r*1.2, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-gh.r*0.7, gh.r*0.6); ctx.quadraticCurveTo(0, gh.r*1.6, gh.r*0.7, gh.r*0.6); ctx.fill(); ctx.globalAlpha=1; ctx.fillStyle='#0a0e13'; ctx.beginPath(); ctx.arc(-5,-4,3,0,Math.PI*2); ctx.arc(6,-4,3,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0,6,4,0,Math.PI); ctx.fill(); ctx.restore(); }
            const p = state.player; ctx.save(); ctx.translate(p.x,p.y); ctx.fillStyle='#d9e3f2'; ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#10131a'; ctx.beginPath(); ctx.arc(-5,-4,3,0,Math.PI*2); ctx.arc(6,-4,3,0,Math.PI*2); ctx.fill(); ctx.shadowColor='#66e2ff55'; ctx.shadowBlur=14; ctx.strokeStyle='#66e2ff55'; ctx.beginPath(); ctx.arc(0,0,p.r+2,0,Math.PI*2); ctx.stroke(); ctx.restore();
            for(const prt of state.particles){ ctx.globalAlpha = Math.max(0,prt.life*1.2); ctx.fillStyle=prt.c; ctx.beginPath(); ctx.arc(prt.x,prt.y,2.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
        };
        
        // --- Game Loop ---
        const loop = (timestamp: number) => {
            if (!game.current) return;
            const dt = Math.min(0.033, (timestamp - game.current.lastTime) / 1000);
            game.current.lastTime = timestamp;
            update(dt);
            draw();
            game.current.animationFrameId = requestAnimationFrame(loop);
        };
        
        game.current.lastTime = performance.now();
        game.current.animationFrameId = requestAnimationFrame(loop);

        // --- Event Handlers ---
        const handleKeyDown = (e: KeyboardEvent) => { if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){ game.current.keys.add(e.key); e.preventDefault(); }};
        const handleKeyUp = (e: KeyboardEvent) => game.current.keys.delete(e.key);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            if (game.current?.animationFrameId) {
                cancelAnimationFrame(game.current.animationFrameId);
            }
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            game.current = null;
        };
    }, [handleGameOver]);
    
    // --- On-screen Controls ---
    const handlePointerDown = (key: string) => game.current?.keys.add(key);
    const handlePointerUp = (key: string) => game.current?.keys.delete(key);

    const splashMessage = status === 'won' ? 'You Captured the Souls! 🎉' : status === 'lost' ? 'The Ghosts Overwhelmed You…' : null;

    return (
        <div className="bg-gray-900 rounded-lg p-2 text-white">
            <p className="text-center mb-2">Collect 5 souls! Use Arrow Keys or on-screen buttons.</p>
            <div className="flex gap-4 flex-wrap justify-center mb-2 text-sm">
                <span>⏱️ Time: <b>{hud.time}</b>s</span>
                <span>💀 Lives: <b>{hud.lives}</b></span>
                <span>🔥 Score: <b>{hud.score}</b> / 5</span>
            </div>
            <div className="relative">
                <canvas ref={canvasRef} width="960" height="540" className="w-full h-auto bg-black" />
                {splashMessage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <h2 className="text-4xl font-bold font-cinzel text-white drop-shadow-lg">{splashMessage}</h2>
                    </div>
                )}
            </div>
            <div className="flex gap-2 justify-center p-2">
                <button onPointerDown={()=>handlePointerDown('ArrowLeft')} onPointerUp={()=>handlePointerUp('ArrowLeft')} onPointerLeave={()=>handlePointerUp('ArrowLeft')} className="w-14 h-14 rounded-lg bg-gray-700 active:bg-gray-600">⬅</button>
                <button onPointerDown={()=>handlePointerDown('ArrowUp')} onPointerUp={()=>handlePointerUp('ArrowUp')} onPointerLeave={()=>handlePointerUp('ArrowUp')} className="w-14 h-14 rounded-lg bg-gray-700 active:bg-gray-600">⬆</button>
                <button onPointerDown={()=>handlePointerDown('ArrowDown')} onPointerUp={()=>handlePointerUp('ArrowDown')} onPointerLeave={()=>handlePointerUp('ArrowDown')} className="w-14 h-14 rounded-lg bg-gray-700 active:bg-gray-600">⬇</button>
                <button onPointerDown={()=>handlePointerDown('ArrowRight')} onPointerUp={()=>handlePointerUp('ArrowRight')} onPointerLeave={()=>handlePointerUp('ArrowRight')} className="w-14 h-14 rounded-lg bg-gray-700 active:bg-gray-600">➡</button>
            </div>
        </div>
    );
};

export default GraveyardDashPuzzle;