"use client";
import { useEffect, useState } from "react";

let listeners = [];
let counter = 0;

function push(type, text) {
  const t = { id: ++counter, type, text };
  listeners.forEach((l) => l(t));
}

export const toast = {
  success: (m) => push("success", m),
  error: (m) => push("error", m),
  info: (m) => push("info", m),
};

export default function Toaster() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const l = (t) => {
      setList((x) => [...x, t]);
      setTimeout(() => setList((x) => x.filter((i) => i.id !== t.id)), 3500);
    };
    listeners.push(l);
    return () => { listeners = listeners.filter((i) => i !== l); };
  }, []);

  return (
    <div className="toaster">
      {list.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>{t.text}</div>
      ))}
    </div>
  );
}