import { Bar, Button, Card, Divider, Popover, Segmented, Stage, Text, Window, type Act } from '../../kit'
import { Check, ChevronLeft, ChevronRight, Clock, MessageCircle, Search, Wifi } from 'lucide-react'
import logo from './logo.png'
import './atene.css'

// Still for Atene Central Village: the week view of the booking calendar,
// pinned top-left and running off the right (Friday) and the bottom (late
// evening). One booking is picked out, Padel 1 on Wednesday at 19:00, and its
// detail card straddles the window's left edge over Monday's filler, the way
// the app's booking sheet opens over the grid. Real words on the picked
// booking, its two neighbours and the card; tags and bars everywhere else.

type FieldId = 'C5' | 'P1' | 'P2' | 'EV'
const FIELD: Record<FieldId, { color: string; tint: string; name: string }> = {
  C5: { color: '#2E7D32', tint: '#E6F1E7', name: 'Calcio a 5' },
  P1: { color: '#1565C0', tint: '#E4EDF8', name: 'Padel 1' },
  P2: { color: '#0097A7', tint: '#E0F1F3', name: 'Padel 2' },
  EV: { color: '#AD1457', tint: '#F8E5EF', name: 'Evento / Festa' },
}

const DAYS = [
  ['Lun', 9],
  ['Mar', 10],
  ['Mer', 11],
  ['Gio', 12],
  ['Ven', 13],
  ['Sab', 14],
] as const
const HOURS = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

// [day, hour row, field, name (string = real, number = bar width), meta]
type Ev = [number, number, FieldId, string | number, string?]
const EVENTS: Ev[] = [
  [0, 0, 'C5', 58],
  [0, 2, 'P2', 46],
  [0, 3, 'C5', 62],
  [1, 1, 'P1', 52],
  [1, 2, 'C5', 56],
  [1, 4, 'P2', 40],
  [2, 0, 'P2', 54],
  [2, 2, 'P1', 'Marco Rossi', '1h · € 40'],
  [2, 3, 'C5', 60],
  [3, 1, 'EV', 64],
  [3, 2, 'P2', 'Giulia Neri', '1h · € 40'],
  [3, 4, 'C5', 48],
  [4, 0, 'C5', 56],
  [4, 2, 'P1', 44],
  [4, 3, 'P2', 50],
]
const PICKED = { day: 2, row: 2 }

// The story: the booking is clicked and its sheet opens beside the grid, the
// WhatsApp reminder is sent from the sheet's own button, and Esc closes the
// sheet, taking the selection with it, so the loop starts on the same frame.
type S = { open: boolean; sent: boolean }

const script = async (a: Act<S>) => {
  await a.wait(800)
  a.mark('open')
  await a.click({ at: 'picked', x: 0.82, y: 0.3 })
  await a.set({ open: true })
  await a.wait(900)
  // The cursor rests over the sheet's empty surface, then sends
  a.mark('send')
  await a.click({ at: 'wa', x: 0.82, y: 0.62 })
  await a.set({ sent: true })
  await a.wait(2200)
  await a.move('rest')
  a.mark('close')
  await a.key('esc')
  // One set: the popover freezes its contents while it fades, so the label
  // never rolls back in view
  await a.set({ open: false, sent: false })
  await a.wait(900)
}

function Event({ ev, picked, on }: { ev: Ev; picked: boolean; on: boolean }) {
  const [day, row, id, name, meta] = ev
  const f = FIELD[id]
  // Tags only where they read whole: Monday and Tuesday sit under the sheet,
  // and the 20:00 row runs off the stage
  const tag = day >= 2 && row < 3
  return (
    <div
      className="at-event"
      data-target={picked ? 'picked' : undefined}
      data-cursor={picked ? 'pointer' : undefined}
      data-picked={on || undefined}
      style={{ background: f.tint, borderLeftColor: f.color }}
    >
      <span className="at-event__line">
        {tag ? (
          <span className="at-event__tag" style={{ color: f.color }}>
            {id}
          </span>
        ) : (
          <Bar w={14} h={5} tone={3} />
        )}
        {typeof name === 'string' ? <Text className="at-event__name">{name}</Text> : <Bar w={name} h={5} tone={3} />}
      </span>
      {meta && <Text className="at-event__meta">{meta}</Text>}
    </div>
  )
}

export default function Atene() {
  return (
    <Stage<S>
      width={760}
      height={420}
      compact={{ below: 760, width: 358, height: 358 }}
      initial={{ open: false, sent: false }}
      poster={{ open: true, sent: true }}
      script={script}
      cursor={{ at: 'rest' }}
      keys={{ wide: 'bottom-right', compact: 'top' }}
      className="at"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        // Compact starts the week at Tuesday and the evening at 18:00, so the
        // picked booking sits whole in the phone column with no card over it
        const o = compact ? 1 : 0
        const r0 = compact ? 2 : 0
        const days = DAYS.slice(o)
        const hours = HOURS.slice(r0)
        return (
          <>
            <Window className="at-window" data-layout={layout}>
              <header className="at-header">
                <img src={logo} alt="" className="at-logo" />
                <div className="at-brand">
                  <div className="at-brand__title">Atene Central Village</div>
                  <div className="at-brand__sub">
                    <Wifi size={12} strokeWidth={2.2} /> Sincronizzato
                  </div>
                </div>
                <div className="at-search">
                  <Search size={14} />
                  <span>Cerca cliente o telefono…</span>
                </div>
              </header>

              <div className="at-toolbar">
                <Segmented items={['Settimana', 'Giorno']} value={0} className="at-seg" />
                <span className="at-nav">
                  <span className="at-icon-btn">
                    <ChevronLeft size={16} />
                  </span>
                  <span className="at-today">Oggi</span>
                  <span className="at-icon-btn">
                    <ChevronRight size={16} />
                  </span>
                </span>
                <span className="at-week">9 – 15 Nov</span>
              </div>

              <div className="at-grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, ${compact ? 120 : 128}px)` }}>
                <div className="at-corner" />
                {days.map(([d, n], i) => (
                  <div key={d} className="at-dayhead" data-today={i + o === 0 || undefined}>
                    <span className="at-dayname">{d}</span>
                    <span className="at-daynum">{n}</span>
                  </div>
                ))}
                {hours.map((h, i) => {
                  const row = i + r0
                  return (
                  <div key={h} className="at-row">
                    <div className="at-hour">
                      <span>{h}</span>
                    </div>
                    {days.map((_, i) => {
                      const day = i + o
                      const ev = EVENTS.find((e) => e[0] === day && e[1] === row)
                      return (
                        <div key={day} className="at-slot">
                          {ev && !(compact && day > 2) && <Event ev={ev} picked={day === PICKED.day && row === PICKED.row} on={s.open} />}
                        </div>
                      )
                    })}
                  </div>
                  )
                })}
              </div>
            </Window>

            <span data-target="rest" className="at-rest" data-layout={layout} />
            <Popover show={s.open} origin={compact ? 'bottom' : 'right center'} className="at-pop" data-layout={layout}>
            <Card pad="medium" lift className="at-card">
              <div className="at-card__head">
                <span className="at-chip" style={{ background: FIELD.P1.tint, color: FIELD.P1.color }}>
                  P1
                </span>
                <div className="at-card__who">
                  <Text className="at-card__name">Marco Rossi</Text>
                  <Text className="at-card__field">{compact ? 'Mer 11 nov · 19:00 – 20:00' : 'Padel 1'}</Text>
                </div>
              </div>
              {!compact && (
                <div className="at-card__when">
                  <Clock size={14} />
                  <Text>Mer 11 nov · 19:00 – 20:00</Text>
                </div>
              )}
              {!compact && <Divider />}
              <div className="at-card__foot">
                <div className="at-card__price">
                  {!compact && <Text className="at-card__label">Prezzo</Text>}
                  <Text className="at-card__amount">€ 40</Text>
                </div>
              <Button
                variant="primary"
                size="large"
                icon={
                  <span className="at-wa__icon" data-sent={s.sent || undefined}>
                    <MessageCircle size={16} />
                    <Check size={16} strokeWidth={2.4} />
                  </span>
                }
                className="at-wa"
                data-target="wa"
              >
                {s.sent ? 'Inviato' : 'WhatsApp'}
              </Button>
              </div>
            </Card>
            </Popover>
          </>
        )
      }}
    </Stage>
  )
}
