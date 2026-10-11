'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './DateInvite.module.scss';

const DAYS = [
  { value: 'thursday', label: 'Czwartek' },
  { value: 'friday', label: 'Piątek' },
  { value: 'saturday', label: 'Sobota' },
];

const VIBES = [
  { value: 'boring_serious', label: 'Nudno i poważnie' },
  { value: 'fun_romantic', label: 'Zabawnie i romantycznie' },
];

const PLACE_OPTION =
  'Nie powiem Ci. To Twoje zadanie zaplanować randkę i lepiej się kurwa postaraj.';

// W bazie jest zawsze jeden wiersz o stałym id - każdy zapis go nadpisuje.
const RESPONSE_ID = '00000000-0000-0000-0000-000000000001';

// 1 intro, 2 dzień, 3 godzina, 4 vibe, 5 miejsce, 6 koniec
const TOTAL_STEPS = 6;
const FIRST_QUESTION = 2;
const LAST_QUESTION = TOTAL_STEPS - 1;

function pad(value) {
  return String(value).padStart(2, '0');
}

export default function DateInvite() {
  const [step, setStep] = useState(1);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [vibe, setVibe] = useState(null);
  const [place, setPlace] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const minuteRef = useRef(null);

  const timeValue =
    hour !== '' && minute !== '' ? `${pad(hour)}:${pad(minute)}` : null;
  const dayLabel = DAYS.find((d) => d.value === day)?.label;

  function handleHourChange(e) {
    const value = e.target.value.slice(0, 2);
    setHour(value);
    // Dwie cyfry albo jedna cyfra 3-9 (druga już nie ma sensu) -> przeskok na minuty
    if (value.length === 2 || (value.length === 1 && Number(value) >= 3)) {
      minuteRef.current?.focus();
    }
  }

  async function save(completed = false) {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      // Gwarancja jednego wiersza: usuń wszystko poza stałym id, potem nadpisz.
      await supabase.from('date_responses').delete().neq('id', RESPONSE_ID);
      const { error } = await supabase.from('date_responses').upsert({
        id: RESPONSE_ID,
        day,
        time: timeValue,
        vibe,
        place,
        completed,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err) {
      setSaveError(err?.message || 'Nie udało się zapisać.');
    } finally {
      setSaving(false);
    }
  }

  async function next(completed = false) {
    await save(completed);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  const hourValid = hour !== '' && Number(hour) >= 0 && Number(hour) <= 23;
  const minuteValid =
    minute !== '' && Number(minute) >= 0 && Number(minute) <= 59;

  const canContinue = {
    2: day !== null,
    3: hourValid && minuteValid,
    4: vibe !== null,
    5: place !== null,
  }[step];

  return (
    <section className={styles.card} aria-live="polite">
      <div key={step} className={styles.slide}>
        {step === 1 && (
          <>
            <h1 className={`${styles.title} ${styles.titleSmall}`}>
              Nie rozmyśliłem się.
              <br />
              Idziesz ze mną na randkę.
              <br />
              Ale kiedy?
            </h1>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className={styles.title}>Wybierz dzień</h1>
            <div className={styles.options}>
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className={`${styles.option} ${day === d.value ? styles.selected : ''}`}
                  onClick={() => setDay(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className={styles.title}>Wybierz godzinę</h1>
            <div className={styles.time}>
              <label className={styles.timeField}>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="23"
                  placeholder="19"
                  value={hour}
                  onChange={handleHourChange}
                  aria-label="Godzina"
                />
                <span>godzina</span>
              </label>
              <span className={styles.colon}>:</span>
              <label className={styles.timeField}>
                <input
                  ref={minuteRef}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="59"
                  placeholder="30"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value.slice(0, 2))}
                  aria-label="Minuta"
                />
                <span>minuta</span>
              </label>
            </div>
            <p className={styles.hint}>
              Jak nie wiesz jeszcze o której, wybierz cokolwiek. Dogadamy.
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className={styles.title}>Wybierz vibe</h1>
            <div className={styles.options}>
              {VIBES.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className={`${styles.option} ${vibe === v.value ? styles.selected : ''}`}
                  onClick={() => setVibe(v.value)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 className={styles.title}>Gdzie chcesz iść?</h1>
            <div className={styles.options} role="radiogroup" aria-label="Miejsce">
              <button
                type="button"
                role="radio"
                aria-checked={Boolean(place)}
                className={`${styles.choice} ${place ? styles.choiceSelected : ''}`}
                onClick={() => setPlace(PLACE_OPTION)}
              >
                <span className={styles.radio} aria-hidden="true" />
                <span className={styles.choiceText}>{PLACE_OPTION}</span>
              </button>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h1 className={styles.when}>
              {dayLabel} o {timeValue}.
            </h1>
            <p className={styles.closing}>Napisz mi, skąd Cię odebrać.</p>
          </>
        )}
      </div>

      {step === 1 && (
        <div className={styles.actionsEnd}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => setStep(FIRST_QUESTION)}
          >
            Dalej <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}

      {step >= FIRST_QUESTION && step <= LAST_QUESTION && (
        <div className={styles.actionsEnd}>
          <button
            type="button"
            className={styles.primary}
            disabled={!canContinue || saving}
            onClick={() => next(step === LAST_QUESTION)}
          >
            {saving ? 'Zapisuję…' : step === LAST_QUESTION ? 'Gotowe' : 'Dalej'}
          </button>
        </div>
      )}

      {saveError && <p className={styles.error}>Nie zapisano: {saveError}</p>}
    </section>
  );
}
