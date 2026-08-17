import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChevronLeft, ChevronRight, Plus, X, User, Phone, Trash2, CalendarDays, Search, AlertTriangle, Users, ChevronDown, LogOut, Wifi, WifiOff, MessageCircle } from "lucide-react";

// ============================================================
//  CONFIGURAZIONE SUPABASE
//  URL già inserito. Incolla SOLO la chiave qui sotto,
//  al posto di INCOLLA_QUI_LA_CHIAVE (tra le virgolette).
//  La chiave publishable/anon di Supabase è pensata per il browser.
// ============================================================
const SUPABASE_URL = "https://xzjwykabzxrjfwlhyhpn.supabase.co";
const SUPABASE_KEY = "sb_publishable_7erwA44JxXePWQbSe5O7Ow_5RwRmF4w";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Impianti / campi ----
const FIELDS = [
  { id: "calcio5", name: "Calcio a 5", short: "C5", color: "#2E7D32", tint: "#E6F1E7", price: 60 },
  { id: "padel1", name: "Padel 1", short: "P1", color: "#1565C0", tint: "#E4EDF8", price: 40 },
  { id: "padel2", name: "Padel 2", short: "P2", color: "#0097A7", tint: "#E0F1F3", price: 40 },
  { id: "evento", name: "Evento / Festa", short: "EV", color: "#AD1457", tint: "#F8E5EF", price: 0 },
];
const FIELD_MAP = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

const HOURS = Array.from({ length: 17 }, (_, i) => i + 8);
const GIORNI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const GIORNI_FULL = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const MESI = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

const iso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const startOfWeek = (d) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const sameMonth = (isoStr, ref) => {
  const [y, m] = isoStr.split("-").map(Number);
  return y === ref.getFullYear() && m === ref.getMonth() + 1;
};
const eur = (n) => "€ " + Number(n).toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// costruisce il link WhatsApp con messaggio di conferma precompilato
const waLink = (b) => {
  const f = FIELD_MAP[b.field];
  const d = new Date(b.date + "T00:00:00");
  const dataIt = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
  const ora = String(b.hour).padStart(2, "0") + ":00";
  const durata = (b.duration || 1) + "h";
  const msg =
    `Ciao ${b.name || ""}, ti confermo la prenotazione presso Atene Central Village:\n` +
    `🏟️ ${f.name}\n📅 ${dataIt}\n🕒 ${ora} (${durata})\n\nA presto!`;
  // pulisce e normalizza il numero con prefisso italiano se manca
  let num = (b.phone || "").replace(/[^\d]/g, "");
  if (num) {
    if (num.startsWith("39")) {
      // già con prefisso, ok
    } else if (num.startsWith("0039")) {
      num = num.slice(2);
    } else if (num.startsWith("0")) {
      num = "39" + num.slice(1);
    } else {
      num = "39" + num;
    }
  }
  const base = num ? `https://wa.me/${num}` : `https://wa.me/`;
  return `${base}?text=${encodeURIComponent(msg)}`;
};

const overlaps = (a, b) => {
  if (a.field !== b.field || a.date !== b.date) return false;
  const aEnd = a.hour + (a.duration || 1);
  const bEnd = b.hour + (b.duration || 1);
  return a.hour < bEnd && b.hour < aEnd;
};

// mappa riga DB (snake) -> oggetto app (camel)
const fromRow = (r) => ({ id: r.id, field: r.field, date: r.date, hour: r.hour, duration: Number(r.duration), name: r.name, phone: r.phone, note: r.note, price: r.price == null ? null : Number(r.price) });
const toRow = (b) => ({ id: b.id, field: b.field, date: b.date, hour: b.hour, duration: b.duration, name: b.name, phone: b.phone, note: b.note, price: b.price });

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = in caricamento

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div style={s.center}>Caricamento…</div>;
  if (!session) return <Login />;
  return <Calendar session={session} />;
}

// ---------------- LOGIN ----------------
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (error) setErr("Email o password non corretti.");
    setBusy(false);
  };

  return (
    <div style={s.loginWrap}>
      <style>{globalCss}</style>
      <div style={s.loginCard}>
        <div style={s.logo}><CalendarDays size={22} strokeWidth={2.4} /></div>
        <h1 style={s.loginTitle}>Atene Central Village</h1>
        <p style={s.loginSub}>Accesso staff</p>
        <input style={s.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={{ ...s.input, marginTop: 10 }} type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {err && <div style={s.loginErr}>{err}</div>}
        <button style={{ ...s.addBtn, width: "100%", justifyContent: "center", marginTop: 14, opacity: busy ? 0.6 : 1 }} onClick={submit} disabled={busy}>
          {busy ? "Accesso…" : "Entra"}
        </button>
        <p style={s.loginHint}>Gli account dello staff si creano dal pannello Supabase (Authentication &gt; Users).</p>
      </div>
    </div>
  );
}

// ---------------- CALENDARIO ----------------
function Calendar({ session }) {
  const [view, setView] = useState("week");
  const [current, setCurrent] = useState(() => startOfWeek(new Date()));
  const [dayDate, setDayDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null);
  const [showRubrica, setShowRubrica] = useState(false);
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState(true);

  // caricamento iniziale + realtime
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: bk, error: e1 } = await supabase.from("bookings").select("*");
      const { data: cl, error: e2 } = await supabase.from("clients").select("*");
      if (!active) return;
      if (e1 || e2) setOnline(false);
      if (bk) setBookings(bk.map(fromRow));
      if (cl) setContacts(cl);
    })();

    const ch = supabase
      .channel("realtime-atene")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (p) => {
        setBookings((prev) => {
          if (p.eventType === "DELETE") return prev.filter((x) => x.id !== p.old.id);
          const rec = fromRow(p.new);
          return [...prev.filter((x) => x.id !== rec.id), rec];
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, (p) => {
        setContacts((prev) => {
          if (p.eventType === "DELETE") return prev.filter((x) => x.id !== p.old.id);
          return [...prev.filter((x) => x.id !== p.new.id), p.new];
        });
      })
      .subscribe((status) => setOnline(status === "SUBSCRIBED"));

    return () => { active = false; supabase.removeChannel(ch); };
  }, []);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => { const d = new Date(current); d.setDate(d.getDate() + i); return d; }),
    [current]
  );

  const saveBooking = async (b) => {
    const rec = { ...b, id: b.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) };
    setBookings((prev) => [...prev.filter((x) => x.id !== rec.id), rec]); // ottimistico
    const { error } = await supabase.from("bookings").upsert(toRow(rec));
    if (error) { alert("Salvataggio non riuscito: " + error.message); }
    if (rec.name) {
      const exists = contacts.some((c) => c.name.toLowerCase() === rec.name.toLowerCase());
      if (!exists) saveContact({ name: rec.name, phone: rec.phone || "" });
    }
    setModal(null);
  };

  const deleteBooking = async (id) => {
    setBookings((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("bookings").delete().eq("id", id);
    setModal(null);
  };

  const saveManyBookings = async (list) => {
    // scarta quelle che si sovrappongono a prenotazioni esistenti
    const toInsert = [];
    let skipped = 0;
    for (const b of list) {
      const cand = { field: b.field, date: b.date, hour: b.hour, duration: b.duration };
      const clash = bookings.some((x) => overlaps(x, cand)) || toInsert.some((x) => overlaps(x, cand));
      if (clash) { skipped++; continue; }
      toInsert.push({ ...b, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random() });
    }
    if (toInsert.length) {
      setBookings((prev) => [...prev, ...toInsert]);
      const { error } = await supabase.from("bookings").upsert(toInsert.map(toRow));
      if (error) alert("Errore nel salvataggio: " + error.message);
    }
    // rubrica automatica dal primo nome
    const nm = list[0]?.name;
    if (nm) {
      const exists = contacts.some((c) => c.name.toLowerCase() === nm.toLowerCase());
      if (!exists) saveContact({ name: nm, phone: list[0].phone || "" });
    }
    setModal(null);
    alert(`Create ${toInsert.length} prenotazioni.` + (skipped ? ` ${skipped} saltate per sovrapposizione.` : ""));
  };

  const saveContact = async (c) => {
    const rec = { ...c, id: c.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) };
    setContacts((prev) => [...prev.filter((x) => x.id !== rec.id), rec]);
    const { error } = await supabase.from("clients").upsert(rec);
    if (error) alert("Salvataggio cliente non riuscito: " + error.message);
    return rec;
  };

  const deleteContact = async (id) => {
    setContacts((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("clients").delete().eq("id", id);
  };

  const shiftWeek = (n) => { const d = new Date(current); d.setDate(d.getDate() + n * 7); setCurrent(startOfWeek(d)); };
  const shiftDay = (n) => { const d = new Date(dayDate); d.setDate(d.getDate() + n); setDayDate(d); };
  const today = iso(new Date());

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return bookings
      .filter((b) => (b.name || "").toLowerCase().includes(q) || (b.phone || "").includes(q))
      .sort((a, b) => (a.date + String(a.hour).padStart(2,"0")).localeCompare(b.date + String(b.hour).padStart(2,"0")));
  }, [query, bookings]);

  const revenue = useMemo(() => {
    const valueOf = (b) => {
      const f = FIELD_MAP[b.field];
      return b.price != null ? Number(b.price) : f.price * (b.duration || 1);
    };
    const refDay = view === "day" ? dayDate : new Date();
    const dayStr = iso(refDay);
    const weekSet = new Set((view === "week" ? weekDays : Array.from({ length: 7 }, (_, i) => { const d = startOfWeek(refDay); d.setDate(d.getDate() + i); return d; })).map(iso));
    let day = 0, week = 0, month = 0, dayCount = 0;
    const byField = {};
    const cat = { calcio: { day: 0, week: 0, month: 0 }, padel: { day: 0, week: 0, month: 0 }, evento: { day: 0, week: 0, month: 0 } };
    for (const b of bookings) {
      const v = valueOf(b);
      const isDay = b.date === dayStr, isWeek = weekSet.has(b.date), isMonth = sameMonth(b.date, refDay);
      if (isDay) { day += v; dayCount++; }
      if (isWeek) week += v;
      if (isMonth) month += v;
      const key = b.field === "calcio5" ? "calcio" : (b.field === "padel1" || b.field === "padel2") ? "padel" : b.field === "evento" ? "evento" : null;
      if (key) { if (isDay) cat[key].day += v; if (isWeek) cat[key].week += v; if (isMonth) cat[key].month += v; }
      const inScope = view === "day" ? isDay : isWeek;
      if (inScope) byField[b.field] = (byField[b.field] || 0) + v;
    }
    return { day, week, month, byField, dayCount, refDay, cat };
  }, [bookings, view, weekDays, dayDate]);

  return (
    <div style={s.app}>
      <style>{globalCss}</style>

      <header style={s.header}>
        <div style={s.brand}>
          <div style={s.logo}><CalendarDays size={20} strokeWidth={2.4} /></div>
          <div>
            <div style={s.brandTitle}>Atene Central Village</div>
            <div style={s.brandSub}>
              {online ? <><Wifi size={12} style={{ verticalAlign: "-1px" }} /> Sincronizzato</> : <><WifiOff size={12} style={{ verticalAlign: "-1px" }} /> Non connesso</>}
              {" · "}{session.user.email}
            </div>
          </div>
        </div>
        <div style={s.searchWrap}>
          <Search size={15} style={s.searchIcon} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca cliente o telefono…" style={s.searchInput} />
          {query && <button style={s.searchClear} onClick={() => setQuery("")}><X size={14} /></button>}
        </div>
        <button style={s.rubricaBtn} onClick={() => setShowRubrica(true)}>
          <Users size={16} /> Rubrica <span style={s.rubricaCount}>{contacts.length}</span>
        </button>
        <button style={s.iconBtn} title="Esci" onClick={() => supabase.auth.signOut()}><LogOut size={16} /></button>
      </header>

      {query ? (
        <SearchResults results={results} onOpen={(b) => setModal(b)} onClose={() => setQuery("")} />
      ) : (
        <>
          <div style={s.toolbar}>
            <div style={s.viewToggle}>
              <button style={{ ...s.toggleBtn, ...(view === "week" ? s.toggleActive : {}) }} onClick={() => setView("week")}>Settimana</button>
              <button style={{ ...s.toggleBtn, ...(view === "day" ? s.toggleActive : {}) }} onClick={() => setView("day")}>Giorno</button>
            </div>
            <div style={s.centerNav}>
              {view === "week" ? (
                <>
                  <button style={s.iconBtn} onClick={() => shiftWeek(-1)}><ChevronLeft size={18} /></button>
                  <button style={s.todayBtn} onClick={() => setCurrent(startOfWeek(new Date()))}>Oggi</button>
                  <button style={s.iconBtn} onClick={() => shiftWeek(1)}><ChevronRight size={18} /></button>
                  <span style={s.weekLabel}>{weekDays[0].getDate()} {MESI[weekDays[0].getMonth()].slice(0,3)} – {weekDays[6].getDate()} {MESI[weekDays[6].getMonth()].slice(0,3)}</span>
                </>
              ) : (
                <>
                  <button style={s.iconBtn} onClick={() => shiftDay(-1)}><ChevronLeft size={18} /></button>
                  <button style={s.todayBtn} onClick={() => { const d = new Date(); d.setHours(0,0,0,0); setDayDate(d); }}>Oggi</button>
                  <button style={s.iconBtn} onClick={() => shiftDay(1)}><ChevronRight size={18} /></button>
                  <span style={s.weekLabel}>{GIORNI_FULL[(dayDate.getDay()+6)%7]} {dayDate.getDate()} {MESI[dayDate.getMonth()]}</span>
                </>
              )}
            </div>
            <button style={s.addBtn} onClick={() => setModal({ date: view === "day" ? iso(dayDate) : today, hour: 18 })}>
              <Plus size={16} strokeWidth={2.6} /> Prenota
            </button>
          </div>

          <div style={s.revBar}>
            <div style={s.revTotals}>
              <div style={s.revCard}><span style={s.revLbl}>Oggi</span><span style={s.revNum}>{eur(revenue.day)}</span></div>
              <div style={s.revCard}><span style={s.revLbl}>Settimana</span><span style={s.revNum}>{eur(revenue.week)}</span></div>
              <div style={{ ...s.revCard, ...s.revCardMonth }}><span style={s.revLbl}>{MESI[revenue.refDay.getMonth()]}</span><span style={s.revNum}>{eur(revenue.month)}</span></div>
            </div>
            <div style={s.catPanels}>
              <CatPanel label="Calcio a 5" color="#2E7D32" data={revenue.cat.calcio} monthName={MESI[revenue.refDay.getMonth()]} />
              <CatPanel label="Padel" color="#1565C0" data={revenue.cat.padel} monthName={MESI[revenue.refDay.getMonth()]} />
              <CatPanel label="Eventi" color="#AD1457" data={revenue.cat.evento} monthName={MESI[revenue.refDay.getMonth()]} />
            </div>
          </div>

          {view === "week"
            ? <WeekGrid weekDays={weekDays} bookings={bookings} today={today} onSlot={setModal} onEvent={setModal} />
            : <DayGrid date={dayDate} bookings={bookings} onSlot={setModal} onEvent={setModal} />}
        </>
      )}

      {modal && <BookingModal data={modal} bookings={bookings} contacts={contacts} onClose={() => setModal(null)} onSave={saveBooking} onSaveMany={saveManyBookings} onDelete={deleteBooking} />}
      {showRubrica && <RubricaModal contacts={contacts} onClose={() => setShowRubrica(false)} onSave={saveContact} onDelete={deleteContact} />}
    </div>
  );
}

function CatPanel({ label, color, data, monthName }) {
  return (
    <div style={s.catPanel}>
      <div style={s.catHead}><span style={{ ...s.dot, background: color }} />{label}</div>
      <div style={s.catRows}>
        <div style={s.catRow}><span style={s.catRowLbl}>Oggi</span><span style={s.catRowVal}>{eur(data.day)}</span></div>
        <div style={s.catRow}><span style={s.catRowLbl}>Sett.</span><span style={s.catRowVal}>{eur(data.week)}</span></div>
        <div style={s.catRow}><span style={s.catRowLbl}>{monthName.slice(0,3)}</span><span style={{ ...s.catRowVal, fontWeight: 800 }}>{eur(data.month)}</span></div>
      </div>
    </div>
  );
}

function WeekGrid({ weekDays, bookings, today, onSlot, onEvent }) {
  return (
    <div style={s.gridWrap}>
      <div style={s.grid}>
        <div style={s.corner}>Ora</div>
        {weekDays.map((d, i) => {
          const isToday = iso(d) === today;
          return (
            <div key={i} style={{ ...s.dayHead, ...(isToday ? s.dayHeadToday : {}) }}>
              <span style={s.dayName}>{GIORNI[i]}</span>
              <span style={{ ...s.dayNum, ...(isToday ? s.dayNumToday : {}) }}>{d.getDate()}</span>
            </div>
          );
        })}
        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div style={s.hourCell}>{String(h).padStart(2, "0")}:00</div>
            {weekDays.map((d, di) => {
              const dateStr = iso(d);
              const cell = bookings.filter((b) => b.date === dateStr && b.hour === h);
              return (
                <button key={di} style={s.slot} onClick={() => onSlot({ date: dateStr, hour: h })}>
                  {cell.map((b) => {
                    const f = FIELD_MAP[b.field];
                    return (
                      <div key={b.id} onClick={(e) => { e.stopPropagation(); onEvent(b); }} style={{ ...s.event, background: f.tint, borderLeft: `3px solid ${f.color}` }}>
                        <span style={{ ...s.evTag, color: f.color }}>{f.short}</span>
                        <span style={s.evName}>{b.name || f.name}</span>
                      </div>
                    );
                  })}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DayGrid({ date, bookings, onSlot, onEvent }) {
  const dateStr = iso(date);
  return (
    <div style={s.gridWrap}>
      <div style={s.dayGrid}>
        <div style={s.corner}>Ora</div>
        {FIELDS.map((f) => (
          <div key={f.id} style={{ ...s.dayHead, borderBottom: `3px solid ${f.color}` }}>
            <span style={s.dayColName}>{f.name}</span>
          </div>
        ))}
        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div style={s.hourCell}>{String(h).padStart(2, "0")}:00</div>
            {FIELDS.map((f) => {
              const cell = bookings.filter((b) => b.date === dateStr && b.field === f.id && b.hour === h);
              return (
                <button key={f.id} style={s.slot} onClick={() => onSlot({ date: dateStr, hour: h, field: f.id })}>
                  {cell.map((b) => (
                    <div key={b.id} onClick={(e) => { e.stopPropagation(); onEvent(b); }} style={{ ...s.event, background: f.tint, borderLeft: `3px solid ${f.color}` }}>
                      <span style={s.evName}>{b.name || f.name}</span>
                      <span style={s.evMeta}>{String(h).padStart(2,"0")}:00 · {b.duration || 1}h</span>
                    </div>
                  ))}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SearchResults({ results, onOpen, onClose }) {
  return (
    <div style={s.searchPage}>
      <div style={s.searchHead}>
        <span>{results.length} risultat{results.length === 1 ? "o" : "i"}</span>
        <button style={s.todayBtn} onClick={onClose}>Torna al calendario</button>
      </div>
      {results.length === 0 ? (
        <div style={s.empty}>Nessuna prenotazione trovata.</div>
      ) : (
        <div style={s.resList}>
          {results.map((b) => {
            const f = FIELD_MAP[b.field];
            return (
              <button key={b.id} style={s.resItem} onClick={() => onOpen(b)}>
                <span style={{ ...s.resTag, background: f.tint, color: f.color }}>{f.short}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={s.resName}>{b.name || f.name}</div>
                  <div style={s.resMeta}>
                    {new Date(b.date + "T00:00:00").toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}
                    {" · "}{String(b.hour).padStart(2,"0")}:00 · {b.duration || 1}h{b.phone ? ` · ${b.phone}` : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BookingModal({ data, bookings, contacts = [], onClose, onSave, onSaveMany, onDelete }) {
  const editing = !!data.id;
  const [field, setField] = useState(data.field || "calcio5");
  const [date, setDate] = useState(data.date);
  const [hour, setHour] = useState(data.hour ?? 18);
  const [duration, setDuration] = useState(data.duration || 1);
  const [name, setName] = useState(data.name || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [note, setNote] = useState(data.note || "");
  const [price, setPrice] = useState(data.price != null ? data.price : "");
  const [showList, setShowList] = useState(false);
  // ricorrenza
  const [repeat, setRepeat] = useState("none"); // none | weekly | days | daily
  const [repeatDays, setRepeatDays] = useState([]); // 0=Lun..6=Dom, per "days"
  const [repeatUntil, setRepeatUntil] = useState("");

  const matches = useMemo(() => {
    const q = name.trim().toLowerCase();
    const list = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q) || (c.phone || "").includes(q));
  }, [name, contacts]);

  const pickContact = (c) => { setName(c.name); setPhone(c.phone || ""); setShowList(false); };

  const candidate = { id: data.id, field, date, hour: Number(hour), duration: Number(duration) };
  const conflict = bookings.find((b) => b.id !== data.id && overlaps(b, candidate));

  const submit = () => {
    if (!name.trim() || conflict) return;
    const f = FIELD_MAP[field];
    const finalPrice = price === "" ? f.price * Number(duration) : Number(price);
    const base = { field, hour: Number(hour), duration: Number(duration), name: name.trim(), phone: phone.trim(), note: note.trim(), price: finalPrice };

    // se non è ripetuta o siamo in modifica, comportamento normale (una sola)
    if (editing || repeat === "none" || !repeatUntil) {
      onSave({ id: data.id, date, ...base });
      return;
    }

    // genera l'elenco di date dalla data iniziale fino a repeatUntil
    const dates = [];
    const start = new Date(date + "T00:00:00");
    const end = new Date(repeatUntil + "T00:00:00");
    if (end < start) { onSave({ id: data.id, date, ...base }); return; }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = (d.getDay() + 6) % 7; // 0=Lun
      let ok = false;
      if (repeat === "daily") ok = true;
      else if (repeat === "weekly") ok = dow === (start.getDay() + 6) % 7;
      else if (repeat === "days") ok = repeatDays.includes(dow);
      if (ok) dates.push(iso(new Date(d)));
    }
    onSaveMany(dates.map((dt) => ({ date: dt, ...base })));
  };

  const f = FIELD_MAP[field];
  const suggested = f.price * Number(duration);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.modalTitle}>{editing ? "Modifica prenotazione" : "Nuova prenotazione"}</h2>
          <button style={s.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <label style={s.label}>Campo</label>
        <div style={s.fieldPicker}>
          {FIELDS.map((ff) => (
            <button key={ff.id} onClick={() => setField(ff.id)}
              style={{ ...s.fieldChip, borderColor: field === ff.id ? ff.color : "#E2E0DB", background: field === ff.id ? ff.tint : "#fff", color: field === ff.id ? ff.color : "#5A574F" }}>
              {ff.name}
            </button>
          ))}
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.input} />
          </div>
          <div style={{ width: 92 }}>
            <label style={s.label}>Ora</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)} style={s.input}>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>)}
            </select>
          </div>
          <div style={{ width: 92 }}>
            <label style={s.label}>Durata</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={s.input}>
              {[1,1.5,2,3,4,5,6].map((d) => <option key={d} value={d}>{d}h</option>)}
            </select>
          </div>
        </div>

        {conflict && (
          <div style={s.conflict}>
            <AlertTriangle size={16} />
            <span>Sovrapposizione con <b>{conflict.name || FIELD_MAP[conflict.field].name}</b> ({String(conflict.hour).padStart(2,"0")}:00 · {conflict.duration || 1}h). Scegli un altro orario o campo.</span>
          </div>
        )}

        {!editing && (
          <>
            <label style={s.label}>Ripetizione</label>
            <div style={s.repeatRow}>
              {[["none","Nessuna"],["weekly","Settimanale"],["days","Giorni scelti"],["daily","Ogni giorno"]].map(([val,lbl]) => (
                <button key={val} type="button" onClick={() => setRepeat(val)}
                  style={{ ...s.repeatChip, borderColor: repeat === val ? "#26241F" : "#E2E0DB", background: repeat === val ? "#26241F" : "#fff", color: repeat === val ? "#fff" : "#5A574F" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {repeat === "days" && (
              <div style={s.dowRow}>
                {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map((g, i) => (
                  <button key={i} type="button"
                    onClick={() => setRepeatDays((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                    style={{ ...s.dowChip, borderColor: repeatDays.includes(i) ? "#1565C0" : "#E2E0DB", background: repeatDays.includes(i) ? "#E4EDF8" : "#fff", color: repeatDays.includes(i) ? "#1565C0" : "#5A574F" }}>
                    {g}
                  </button>
                ))}
              </div>
            )}

            {repeat !== "none" && (
              <>
                <label style={s.label}>Ripeti fino al</label>
                <input type="date" value={repeatUntil} min={date} onChange={(e) => setRepeatUntil(e.target.value)} style={s.input} />
                {repeat !== "none" && !repeatUntil && <div style={s.repeatHint}>Scegli una data di fine per creare le prenotazioni ripetute.</div>}
              </>
            )}
          </>
        )}

        <label style={s.label}>Nome / Cliente</label>
        <div style={s.inputIcon}>
          <User size={15} style={s.inputIconSvg} />
          <input value={name} onChange={(e) => { setName(e.target.value); setShowList(true); }} onFocus={() => setShowList(true)} placeholder="Es. Rossi / Festa compleanno" style={{ ...s.input, paddingLeft: 34, paddingRight: 34 }} />
          {contacts.length > 0 && <button type="button" style={s.pickerToggle} onClick={() => setShowList((v) => !v)}><ChevronDown size={16} /></button>}
          {showList && matches.length > 0 && (
            <div style={s.dropdown}>
              <div style={s.dropdownHead}>Rubrica</div>
              {matches.slice(0, 8).map((c) => (
                <button key={c.id} type="button" style={s.dropdownItem} onClick={() => pickContact(c)}>
                  <span style={s.dropAvatar}>{c.name.charAt(0).toUpperCase()}</span>
                  <span style={s.dropName}>{c.name}</span>
                  {c.phone && <span style={s.dropPhone}>{c.phone}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Telefono</label>
            <div style={s.inputIcon}>
              <Phone size={15} style={s.inputIconSvg} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Facoltativo" style={{ ...s.input, paddingLeft: 34 }} />
            </div>
          </div>
          <div style={{ width: 130 }}>
            <label style={s.label}>Prezzo (€)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={String(suggested)} style={s.input} />
          </div>
        </div>

        <label style={s.label}>Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Facoltativo" rows={2} style={{ ...s.input, height: "auto", padding: "10px 12px", resize: "vertical" }} />

        <div style={s.modalFoot}>
          {editing ? <button style={s.delBtn} onClick={() => onDelete(data.id)}><Trash2 size={15} /> Elimina</button> : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            {editing && (
              <a href={waLink({ field, date, hour: Number(hour), duration: Number(duration), name: name.trim(), phone: phone.trim() })}
                target="_blank" rel="noopener noreferrer" style={s.waBtn}>
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            <button style={{ ...s.addBtn, opacity: name.trim() && !conflict ? 1 : 0.45, cursor: name.trim() && !conflict ? "pointer" : "not-allowed" }} onClick={submit}>
              {editing ? "Salva" : (repeat !== "none" && repeatUntil ? "Crea ripetute" : "Prenota")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RubricaModal({ contacts, onClose, onSave, onDelete }) {
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const list = useMemo(() => {
    const s2 = q.trim().toLowerCase();
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name)).filter((c) => !s2 || c.name.toLowerCase().includes(s2) || (c.phone || "").includes(s2));
  }, [contacts, q]);

  const startEdit = (c) => { setEditId(c.id); setName(c.name); setPhone(c.phone || ""); };
  const reset = () => { setEditId(null); setName(""); setPhone(""); };
  const submit = async () => { if (!name.trim()) return; await onSave({ id: editId, name: name.trim(), phone: phone.trim() }); reset(); };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.modalTitle}>Rubrica clienti</h2>
          <button style={s.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={s.rubForm}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome cliente" style={{ ...s.input, flex: 1 }} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefono" style={{ ...s.input, width: 130 }} />
          <button style={{ ...s.addBtn, opacity: name.trim() ? 1 : 0.45 }} onClick={submit}>{editId ? "Salva" : <><Plus size={15} /> Aggiungi</>}</button>
          {editId && <button style={s.todayBtn} onClick={reset}>Annulla</button>}
        </div>
        <div style={{ ...s.inputIcon, marginTop: 14 }}>
          <Search size={15} style={s.inputIconSvg} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca in rubrica…" style={{ ...s.input, paddingLeft: 34 }} />
        </div>
        <div style={s.rubList}>
          {list.length === 0 ? (
            <div style={s.empty}>{contacts.length === 0 ? "Nessun cliente ancora. Aggiungine uno o si salveranno da soli quando prenoti." : "Nessun risultato."}</div>
          ) : (
            list.map((c) => (
              <div key={c.id} style={s.rubItem}>
                <span style={s.dropAvatar}>{c.name.charAt(0).toUpperCase()}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.resName}>{c.name}</div>
                  {c.phone && <div style={s.resMeta}>{c.phone}</div>}
                </div>
                <button style={s.rubEdit} onClick={() => startEdit(c)}>Modifica</button>
                <button style={s.rubDel} onClick={() => onDelete(c.id)}><Trash2 size={15} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const globalCss = `
* { box-sizing: border-box; }
body { margin: 0; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }
::-webkit-scrollbar { height: 8px; width: 8px; }
::-webkit-scrollbar-thumb { background: #D6D3CC; border-radius: 8px; }
`;

const s = {
  app: { fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F5F0", minHeight: "100vh", color: "#26241F" },
  center: { minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui", color: "#8A867C" },
  loginWrap: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#F7F5F0", fontFamily: "'Inter', system-ui, sans-serif", padding: 16 },
  loginCard: { background: "#fff", padding: 32, borderRadius: 18, width: "min(380px, 100%)", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", textAlign: "center" },
  loginTitle: { fontSize: 22, fontWeight: 800, margin: "16px 0 2px", letterSpacing: "-0.02em" },
  loginSub: { fontSize: 13.5, color: "#8A867C", margin: "0 0 20px" },
  loginErr: { marginTop: 10, padding: "8px 12px", borderRadius: 9, background: "#FCF1F1", color: "#B4292A", fontSize: 13, fontWeight: 500 },
  loginHint: { fontSize: 11.5, color: "#A8A399", marginTop: 16, lineHeight: 1.5 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "16px 22px", background: "#fff", borderBottom: "1px solid #EAE7E0" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 12, background: "#26241F", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto" },
  brandTitle: { fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" },
  brandSub: { fontSize: 12, color: "#8A867C", display: "flex", alignItems: "center", gap: 5 },
  searchWrap: { position: "relative", display: "flex", alignItems: "center", flex: "1 1 220px", maxWidth: 340 },
  searchIcon: { position: "absolute", left: 12, color: "#A8A399" },
  searchInput: { width: "100%", height: 40, padding: "0 34px", borderRadius: 10, border: "1px solid #E2E0DB", fontSize: 14, background: "#FAF9F6" },
  searchClear: { position: "absolute", right: 8, width: 26, height: 26, borderRadius: 7, border: "none", background: "transparent", color: "#8A867C", display: "grid", placeItems: "center" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 22px 8px" },
  viewToggle: { display: "flex", background: "#EEEBE4", borderRadius: 10, padding: 3 },
  toggleBtn: { border: "none", background: "transparent", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13.5, color: "#8A867C" },
  toggleActive: { background: "#fff", color: "#26241F", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  centerNav: { display: "flex", alignItems: "center", gap: 6 },
  iconBtn: { width: 34, height: 34, borderRadius: 9, border: "1px solid #E2E0DB", background: "#fff", display: "grid", placeItems: "center", color: "#5A574F" },
  todayBtn: { height: 34, padding: "0 14px", borderRadius: 9, border: "1px solid #E2E0DB", background: "#fff", fontWeight: 600, fontSize: 13.5, color: "#26241F" },
  weekLabel: { fontWeight: 600, fontSize: 14.5, letterSpacing: "-0.01em", marginLeft: 8 },
  addBtn: { display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", borderRadius: 10, border: "none", background: "#26241F", color: "#fff", fontWeight: 600, fontSize: 14 },
  revBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "6px 22px 14px", padding: "12px 16px", background: "#fff", border: "1px solid #EAE7E0", borderRadius: 12 },
  revTotals: { display: "flex", gap: 10, flexWrap: "wrap" },
  revCard: { display: "flex", flexDirection: "column", gap: 2, padding: "8px 16px", borderRadius: 10, background: "#F7F5F0", minWidth: 96 },
  revCardMonth: { background: "#26241F", color: "#fff" },
  revLbl: { fontSize: 11.5, fontWeight: 600, color: "inherit", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.03em" },
  revNum: { fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" },
  catPanels: { display: "flex", gap: 10, flexWrap: "wrap" },
  catPanel: { border: "1px solid #EAE7E0", borderRadius: 11, padding: "8px 12px", minWidth: 150, background: "#FDFCFA" },
  catHead: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#3A3830", marginBottom: 6 },
  catRows: { display: "flex", gap: 12 },
  catRow: { display: "flex", flexDirection: "column", gap: 1 },
  catRowLbl: { fontSize: 10.5, fontWeight: 600, color: "#A8A399", textTransform: "uppercase", letterSpacing: "0.03em" },
  catRowVal: { fontSize: 13.5, fontWeight: 700, color: "#26241F", whiteSpace: "nowrap" },
  dot: { width: 10, height: 10, borderRadius: 3 },
  gridWrap: { padding: "0 22px 30px", overflowX: "auto" },
  grid: { display: "grid", gridTemplateColumns: "56px repeat(7, minmax(120px, 1fr))", background: "#EAE7E0", border: "1px solid #EAE7E0", borderRadius: 14, overflow: "hidden", minWidth: 900 },
  dayGrid: { display: "grid", gridTemplateColumns: "56px repeat(4, minmax(150px, 1fr))", background: "#EAE7E0", border: "1px solid #EAE7E0", borderRadius: 14, overflow: "hidden", minWidth: 720 },
  corner: { background: "#fff", padding: "10px 8px", fontSize: 11, color: "#A8A399", fontWeight: 600, display: "grid", placeItems: "center" },
  dayHead: { background: "#fff", padding: "10px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  dayHeadToday: { background: "#FBF3EC" },
  dayName: { fontSize: 11.5, color: "#8A867C", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  dayNum: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" },
  dayNumToday: { background: "#26241F", color: "#fff", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 15 },
  dayColName: { fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em" },
  hourCell: { background: "#fff", padding: "6px 6px", fontSize: 11, color: "#A8A399", fontWeight: 600, textAlign: "right", borderTop: "1px solid #F0EDE7" },
  slot: { background: "#fff", border: "none", borderTop: "1px solid #F0EDE7", borderLeft: "1px solid #F0EDE7", minHeight: 52, padding: 3, display: "flex", flexDirection: "column", gap: 3, alignItems: "stretch", textAlign: "left" },
  event: { borderRadius: 6, padding: "4px 7px", display: "flex", flexDirection: "column", gap: 1, cursor: "pointer" },
  evTag: { fontSize: 10, fontWeight: 800, letterSpacing: "0.03em" },
  evName: { fontSize: 11.5, fontWeight: 600, color: "#3A3830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  evMeta: { fontSize: 10.5, color: "#8A867C", fontWeight: 500 },
  overlay: { position: "fixed", inset: 0, background: "rgba(30,28,24,0.45)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 },
  modal: { background: "#fff", borderRadius: 16, padding: 22, width: "min(480px, 100%)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" },
  label: { display: "block", fontSize: 12.5, fontWeight: 600, color: "#6B675E", margin: "12px 0 6px" },
  fieldPicker: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  fieldChip: { padding: "9px 10px", borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 13, transition: "all .12s" },
  row: { display: "flex", gap: 10 },
  input: { width: "100%", height: 40, padding: "0 12px", borderRadius: 9, border: "1px solid #E2E0DB", fontSize: 14, background: "#fff", color: "#26241F" },
  inputIcon: { position: "relative" },
  inputIconSvg: { position: "absolute", left: 11, top: 12, color: "#A8A399" },
  conflict: { display: "flex", alignItems: "flex-start", gap: 8, marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#FCF1E8", border: "1px solid #F0D4B8", color: "#9A5A18", fontSize: 12.5, lineHeight: 1.4 },
  repeatRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  repeatChip: { padding: "8px 12px", borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 13, transition: "all .12s" },
  dowRow: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 },
  dowChip: { width: 42, height: 36, borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 12.5 },
  repeatHint: { fontSize: 12, color: "#9A5A18", marginTop: 6 },
  modalFoot: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  delBtn: { display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 10, border: "1px solid #E7C9C9", background: "#FCF1F1", color: "#B4292A", fontWeight: 600, fontSize: 13.5 },
  waBtn: { display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 10, border: "none", background: "#25D366", color: "#fff", fontWeight: 600, fontSize: 13.5, textDecoration: "none" },
  searchPage: { padding: "18px 22px 40px" },
  searchHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, fontSize: 14, fontWeight: 600, color: "#6B675E" },
  empty: { padding: "40px 0", textAlign: "center", color: "#A8A399", fontSize: 14 },
  resList: { display: "flex", flexDirection: "column", gap: 8 },
  resItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "1px solid #EAE7E0", background: "#fff", width: "100%" },
  resTag: { width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 },
  resName: { fontSize: 14.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  resMeta: { fontSize: 12.5, color: "#8A867C", marginTop: 2 },
  rubricaBtn: { display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 14px", borderRadius: 10, border: "1px solid #E2E0DB", background: "#fff", fontWeight: 600, fontSize: 13.5, color: "#26241F" },
  rubricaCount: { display: "inline-grid", placeItems: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10, background: "#26241F", color: "#fff", fontSize: 11.5, fontWeight: 700 },
  pickerToggle: { position: "absolute", right: 6, top: 6, width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#8A867C", display: "grid", placeItems: "center" },
  dropdown: { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #E2E0DB", borderRadius: 11, boxShadow: "0 12px 30px rgba(0,0,0,0.14)", zIndex: 20, overflow: "hidden", maxHeight: 240, overflowY: "auto" },
  dropdownHead: { padding: "8px 12px 4px", fontSize: 11, fontWeight: 700, color: "#A8A399", textTransform: "uppercase", letterSpacing: "0.04em" },
  dropdownItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", border: "none", background: "transparent", textAlign: "left" },
  dropAvatar: { width: 30, height: 30, borderRadius: "50%", background: "#EEEBE4", color: "#6B675E", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  dropName: { fontSize: 14, fontWeight: 600, flex: 1 },
  dropPhone: { fontSize: 12.5, color: "#8A867C" },
  rubForm: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  rubList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 14, maxHeight: 340, overflowY: "auto" },
  rubItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, border: "1px solid #EAE7E0", background: "#fff" },
  rubEdit: { height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #E2E0DB", background: "#fff", fontWeight: 600, fontSize: 12.5, color: "#26241F" },
  rubDel: { width: 32, height: 32, borderRadius: 8, border: "1px solid #E7C9C9", background: "#FCF1F1", color: "#B4292A", display: "grid", placeItems: "center" },
};
