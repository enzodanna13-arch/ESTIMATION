"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Viewer de visite virtuelle 360° — WebGL pur, sans dépendance.
// Les prises de vue Insta360 exportées en JPG équirectangulaire (ratio 2:1)
// sont projetées par un fragment shader : glisser pour regarder autour,
// molette / pincement pour zoomer, boutons pour changer de pièce.

export interface Scene360 {
  imgId: string;
  nom: string;
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uReso;
uniform float uYaw;
uniform float uPitch;
uniform float uFov; // fov vertical en radians
const float PI = 3.14159265358979;

void main() {
  vec2 ndc = (gl_FragCoord.xy / uReso) * 2.0 - 1.0;
  float aspect = uReso.x / uReso.y;
  float t = tan(uFov * 0.5);
  // Base caméra à partir du yaw/pitch
  float cy = cos(uYaw), sy = sin(uYaw);
  float cp = cos(uPitch), sp = sin(uPitch);
  vec3 forward = vec3(cp * sy, sp, -cp * cy);
  vec3 right = vec3(cy, 0.0, sy);
  vec3 up = cross(right, forward);
  vec3 dir = normalize(forward + ndc.x * t * aspect * right + ndc.y * t * up);
  float lon = atan(dir.x, -dir.z);
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  vec2 uv = vec2((lon + PI) / (2.0 * PI), 0.5 - lat / PI);
  gl_FragColor = texture2D(uTex, uv);
}
`;

export default function Visite360({
  scenes,
  urlImage,
  hauteur = "70vh",
}: {
  scenes: Scene360[];
  urlImage: (imgId: string) => string;
  hauteur?: string;
}) {
  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const etatRef = useRef({ yaw: 0, pitch: 0, fov: (75 * Math.PI) / 180, drag: false, px: 0, py: 0 });
  const rafRef = useRef<number>(0);
  const [sceneActive, setSceneActive] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const rendre = useCallback(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;
    const u = uniformsRef.current;
    const e = etatRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(u.uReso, canvas.width, canvas.height);
    gl.uniform1f(u.uYaw, e.yaw);
    gl.uniform1f(u.uPitch, e.pitch);
    gl.uniform1f(u.uFov, e.fov);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);

  const demanderRendu = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(rendre);
  }, [rendre]);

  // Initialisation WebGL (une fois)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });
    if (!gl) {
      setErreur("WebGL indisponible sur cet appareil — impossible d'afficher la visite 360°.");
      return;
    }
    glRef.current = gl;
    const compiler = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compiler(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    uniformsRef.current = {
      uReso: gl.getUniformLocation(prog, "uReso"),
      uYaw: gl.getUniformLocation(prog, "uYaw"),
      uPitch: gl.getUniformLocation(prog, "uPitch"),
      uFov: gl.getUniformLocation(prog, "uFov"),
      uTex: gl.getUniformLocation(prog, "uTex"),
    };
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uniformsRef.current.uTex, 0);
    const surResize = () => demanderRendu();
    window.addEventListener("resize", surResize);
    return () => {
      window.removeEventListener("resize", surResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [demanderRendu]);

  // Chargement de la scène active dans la texture
  useEffect(() => {
    const gl = glRef.current;
    const scene = scenes[sceneActive];
    if (!gl || !scene) return;
    setChargement(true);
    setErreur(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      setChargement(false);
      etatRef.current.yaw = 0;
      etatRef.current.pitch = 0;
      demanderRendu();
    };
    img.onerror = () => {
      setChargement(false);
      setErreur("Prise de vue impossible à charger.");
    };
    img.src = urlImage(scene.imgId);
  }, [sceneActive, scenes, urlImage, demanderRendu]);

  // Interactions : glisser pour regarder, molette pour zoomer
  const surPointerDown = (ev: React.PointerEvent) => {
    etatRef.current.drag = true;
    etatRef.current.px = ev.clientX;
    etatRef.current.py = ev.clientY;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
  };
  const surPointerMove = (ev: React.PointerEvent) => {
    const e = etatRef.current;
    if (!e.drag) return;
    const vitesse = e.fov / (canvasRef.current?.clientHeight || 600);
    e.yaw -= (ev.clientX - e.px) * vitesse;
    e.pitch += (ev.clientY - e.py) * vitesse;
    e.pitch = Math.max(-1.48, Math.min(1.48, e.pitch));
    e.px = ev.clientX;
    e.py = ev.clientY;
    demanderRendu();
  };
  const surPointerUp = () => {
    etatRef.current.drag = false;
  };
  const surWheel = (ev: React.WheelEvent) => {
    const e = etatRef.current;
    e.fov = Math.max((30 * Math.PI) / 180, Math.min((100 * Math.PI) / 180, e.fov + ev.deltaY * 0.001));
    demanderRendu();
  };

  const pleinEcran = () => {
    const el = conteneurRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().then(() => demanderRendu());
  };

  return (
    <div ref={conteneurRef} className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ height: hauteur }}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={surPointerDown}
        onPointerMove={surPointerMove}
        onPointerUp={surPointerUp}
        onPointerCancel={surPointerUp}
        onWheel={surWheel}
      />
      {chargement && !erreur && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">
          Chargement de la pièce…
        </div>
      )}
      {erreur && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-white">{erreur}</div>
      )}

      {/* Barre des pièces */}
      {scenes.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-1.5 bg-gradient-to-t from-black/80 to-transparent p-3">
          {scenes.map((s, i) => (
            <button
              key={s.imgId}
              type="button"
              onClick={() => setSceneActive(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                i === sceneActive ? "bg-copper text-white" : "bg-white/15 text-white hover:bg-white/30"
              }`}
            >
              {s.nom}
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] text-white/60 sm:block">Glissez pour regarder · molette pour zoomer</span>
          <button
            type="button"
            onClick={pleinEcran}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30"
            aria-label="Plein écran"
          >
            ⛶
          </button>
        </div>
      )}
    </div>
  );
}
