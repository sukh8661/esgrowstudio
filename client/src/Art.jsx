import React, { useId } from "react";
export function Sprout({ className = "", size = 28 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 35V20M20 23C6 26 3 14 5 9c13-1 18 7 15 14ZM20 20C18 8 27 3 36 5c1 10-6 16-16 15Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Garden({ compact = false }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`garden ${compact ? "compact" : ""}`}
      viewBox="0 0 760 720"
      role="img"
      aria-label="An original illustrated digital garden with sculptural leaves, stepping stones and a growing business chart"
    >
      <defs>
        <linearGradient id={`${id}leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efffb8" />
          <stop offset=".42" stopColor="#a9cc64" />
          <stop offset="1" stopColor="#426c36" />
        </linearGradient>
        <linearGradient id={`${id}dark`} x1="0" x2="1" y2="1">
          <stop stopColor="#a0bd72" />
          <stop offset=".5" stopColor="#477651" />
          <stop offset="1" stopColor="#183d2a" />
        </linearGradient>
        <linearGradient id={`${id}pot`}>
          <stop stopColor="#acb49c" />
          <stop offset=".4" stopColor="#f6f3df" />
          <stop offset="1" stopColor="#9ca58e" />
        </linearGradient>
        <radialGradient id={`${id}ground`}>
          <stop stopColor="#ebefbb" />
          <stop offset="1" stopColor="#8caf78" />
        </radialGradient>
        <radialGradient id={`${id}sun`}>
          <stop stopColor="#f9f7c2" />
          <stop offset="1" stopColor="#f9f7c2" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}shadow`} x="-50%" y="-50%" width="200%" height="220%">
          <feDropShadow
            dx="0"
            dy="20"
            stdDeviation="15"
            floodColor="#244938"
            floodOpacity=".2"
          />
        </filter>
      </defs>
      <circle cx="500" cy="260" r="270" fill={`url(#${id}sun)`} />
      <g opacity=".3" fill="none" stroke="#78966a">
        <ellipse cx="405" cy="520" rx="330" ry="150" />
        <ellipse cx="405" cy="520" rx="290" ry="125" />
        <ellipse cx="405" cy="520" rx="250" ry="100" />
      </g>
      <ellipse
        cx="400"
        cy="571"
        rx="293"
        ry="105"
        fill="#51724c"
        opacity=".15"
      />
      <path
        d="M80 537Q145 405 345 432Q548 409 694 528L680 559Q446 700 98 574Z"
        fill={`url(#${id}ground)`}
      />
      <path
        d="M98 556Q405 660 685 540L675 568Q415 705 103 582Z"
        fill="#688b54"
      />
      <g fill={`url(#${id}pot)`} filter={`url(#${id}shadow)`}>
        <path d="M316 451L330 552Q383 585 439 548L454 449Z" />
        <ellipse cx="385" cy="451" rx="69" ry="24" />
      </g>
      <ellipse cx="385" cy="450" rx="57" ry="17" fill="#52623d" />
      <g className="garden-leaves">
        <path
          d="M384 460C397 361 371 260 419 146M383 410C340 341 291 332 264 293M390 368C452 323 484 298 509 256"
          fill="none"
          stroke="#4a6b3b"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M394 328C306 304 278 193 307 154C403 159 433 259 394 328Z"
          fill={`url(#${id}dark)`}
        />
        <path
          d="M398 299Q345 237 307 154"
          fill="none"
          stroke="#c8d994"
          strokeOpacity=".55"
        />
        <path
          d="M402 244C366 155 424 75 483 72C508 161 464 224 402 244Z"
          fill={`url(#${id}leaf)`}
        />
        <path
          d="M405 239Q451 153 483 72"
          fill="none"
          stroke="#f0fac1"
          strokeOpacity=".6"
        />
        <path
          d="M389 373C412 274 515 237 565 260C553 357 464 393 389 373Z"
          fill={`url(#${id}leaf)`}
        />
        <path
          d="M398 367Q488 297 565 260"
          fill="none"
          stroke="#e4eeb0"
          strokeOpacity=".7"
        />
        <path
          d="M362 383C269 399 208 334 211 280C292 267 350 307 362 383Z"
          fill={`url(#${id}leaf)`}
        />
        <path
          d="M359 379Q281 328 211 280"
          stroke="#e1ecb3"
          strokeOpacity=".6"
          fill="none"
        />
        <path
          d="M385 433C397 373 445 350 482 365C482 423 437 448 385 433Z"
          fill={`url(#${id}dark)`}
        />
      </g>
      <g filter={`url(#${id}shadow)`}>
        <ellipse cx="232" cy="571" rx="59" ry="20" fill="#eff0dc" />
        <path d="M173 565v10q59 36 118-1v-10" fill="#aeb697" />
        <ellipse cx="232" cy="564" rx="59" ry="20" fill="#f4f2e0" />
        <ellipse cx="153" cy="604" rx="44" ry="15" fill="#bcc4a8" />
        <ellipse cx="153" cy="598" rx="44" ry="15" fill="#f4f2e0" />
      </g>
      <g transform="translate(565 462)">
        <path
          d="M0 62V0M1 30Q-44 37-39-4Q-5-5 1 30M1 18Q-6-20 33-30Q50 4 1 18"
          stroke="#66834a"
          strokeWidth="4"
          fill={`url(#${id}leaf)`}
        />
        <ellipse cy="64" rx="36" ry="10" fill="#789250" opacity=".3" />
      </g>
      <g transform="translate(150 435)">
        <path
          d="M0 50V9M0 27Q-34 25-28-5Q0-6 0 27M0 18Q0-16 29-14Q36 12 0 18"
          fill={`url(#${id}dark)`}
          stroke="#66834a"
          strokeWidth="3"
        />
      </g>
      <g className="garden-orb" filter={`url(#${id}shadow)`}>
        <circle cx="583" cy="174" r="33" fill={`url(#${id}leaf)`} />
        <path
          d="M563 157q17-12 28 3"
          stroke="#fff8cf"
          strokeWidth="4"
          opacity=".7"
          fill="none"
        />
      </g>
      <g fill="#d6dfac">
        <ellipse cx="525" cy="585" rx="17" ry="10" />
        <ellipse cx="548" cy="577" rx="11" ry="7" />
        <ellipse cx="120" cy="523" rx="15" ry="8" />
      </g>
    </svg>
  );
}
export function ProjectArt({ type = "flora" }) {
  const art = {
    flora: {
      file: "flora-living",
      title: "flora.",
      caption: "Considered living, naturally.",
    },
    forma: {
      file: "forma-studio",
      title: "forma",
      caption: "Spaces for life.",
    },
    ritual: {
      file: "daily-ritual",
      title: "daily ritual.",
      caption: "A little good, every day.",
    },
  }[type] || {
    file: "flora-living",
    title: "flora.",
    caption: "Considered living, naturally.",
  };
  return (
    <div className={`project-art project-photo ${type}`}>
      <img
        src={`/images/${art.file}.webp`}
        srcSet={`/images/${art.file}-800.webp 800w, /images/${art.file}.webp 1536w`}
        sizes="(max-width:700px) 100vw, 50vw"
        width="1536"
        height="1024"
        alt={`${art.title} — original ${type === "ritual" ? "wellness product" : type === "forma" ? "architectural interior" : "botanical lifestyle"} concept visual`}
        loading="lazy"
      />
      <div className="project-art-brand" aria-hidden="true">
        <b>{art.title}</b>
        <span>{art.caption}</span>
      </div>
    </div>
  );
}
