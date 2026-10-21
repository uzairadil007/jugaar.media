// Sends vibe. check-in reminders to the VAs' phones/computers through Firebase Cloud Messaging.
// Run every few minutes by .github/workflows/vibe-checkin-push.yml. Check-in times and the open/grace window
// come from vibe.html's defaults, overridden by whatever the Supreme Leader saved in Firestore (vibe_settings/main).
//
// env: FIREBASE_SERVICE_ACCOUNT  service-account JSON (GitHub secret)
//      TZ                        the team's time zone, e.g. Asia/Karachi
//      TEST_VA                   optional: rimsha | amna | all — send a test push now and exit
import { readFileSync } from 'node:fs';
import admin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log('FIREBASE_SERVICE_ACCOUNT secret is not set yet — nothing to do.');
  process.exit(0);
}

const html = readFileSync(new URL('../vibe.html', import.meta.url), 'utf8');
const VAS = Function('return ' + html.match(/const VAS = (\[[\s\S]*?\n\]);/)[1])();
const num = name => Number(html.match(new RegExp(`(?:const|let) ${name} = (\\d+)`))[1]);
let EARLY = num('CHECKIN_EARLY'), GRACE = num('CHECKIN_GRACE');
const SITE = 'https://' + readFileSync(new URL('../CNAME', import.meta.url), 'utf8').trim();

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = admin.firestore();

const settings = (await db.collection('vibe_settings').doc('main').get()).data() || {};
VAS.forEach(v => { const p = (settings.people || {})[v.id]; if (v.checkins && p && Array.isArray(p.checkins) && p.checkins.length) v.checkins = [...p.checkins].sort(); });
if (Number.isFinite(settings.early)) EARLY = settings.early;
if (Number.isFinite(settings.grace)) GRACE = settings.grace;

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const dk = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
const nowMin = now.getHours()*60 + now.getMinutes();
const hmMin = t => { const [h, m] = t.split(':').map(Number); return h*60 + m; };
const fmtMin = m => { const h = Math.floor(m/60) % 24; return (h%12 || 12) + ':' + pad(m%60) + ' ' + (h < 12 ? 'AM' : 'PM'); };

async function send(va, title, body, tag, n) {
  const docs = (await db.collection('pushTokens').where('vaId', '==', va.id).get()).docs;
  if (!docs.length) return { devices: 0, ok: 0 };
  const link = `${SITE}/vibe.html?tab=${va.id}`;
  const res = await admin.messaging().sendEachForMulticast({
    tokens: docs.map(d => d.get('token')),
    data: { tag, vaId: va.id, n: String(n || ''), link },
    webpush: {
      notification: { title, body, tag, renotify: true, requireInteraction: true, icon: `${SITE}/vibe-icon-192.png`, badge: `${SITE}/vibe-icon-192.png` },
      fcmOptions: { link },
    },
  });
  // forget devices that uninstalled / revoked permission
  await Promise.all(res.responses.map((r, i) =>
    !r.success && /registration-token-not-registered|invalid-registration-token/.test(r.error?.code || '') ? docs[i].ref.delete() : null));
  res.responses.forEach((r, i) => { if (!r.success) console.log(`  device ${i}: ${r.error?.code}`); });
  return { devices: docs.length, ok: res.successCount };
}

const testVa = (process.env.TEST_VA || '').trim().toLowerCase();
if (testVa) {
  for (const va of VAS.filter(v => v.checkins && (testVa === 'all' || v.id === testVa))) {
    const r = await send(va, `vibe test for ${va.name}`, 'Phone notifications are working. Check-in reminders will arrive like this.', `vibe-test-${va.id}`);
    console.log(`test → ${va.name}: ${r.ok}/${r.devices} devices`);
  }
  process.exit(0);
}

console.log(`${dk} ${fmtMin(nowMin)} (${process.env.TZ || 'UTC'})`);
for (const va of VAS.filter(v => v.checkins)) {
  const e = (await db.collection('entries').doc(`${va.id}_${dk}`).get()).data() || {};
  if (!e.signIn || e.signOut) { console.log(`${va.name}: not on shift`); continue; }   // same rule as the in-page reminders
  for (const [i, t] of va.checkins.entries()) {
    const n = i + 1, due = hmMin(t);
    if ((e.checkins || {})[n] || nowMin < due - EARLY) continue;
    const state = nowMin <= due + GRACE ? 'due' : 'overdue';
    const mark = db.collection('pushSent').doc(`${va.id}_${dk}_${n}_${state}`);
    if ((await mark.get()).exists) continue;
    const r = await send(va,
      `Check-in ${n} ${state === 'due' ? 'is due' : 'is overdue'}`,
      `${va.name}, reply to every DM and to the comments on each account's latest post, then tick them off in vibe. (Due ${fmtMin(due)})`,
      `vibe-ck-${va.id}-${n}`, n);
    console.log(`${va.name}: check-in ${n} ${state} → ${r.ok}/${r.devices} devices`);
    if (r.devices) await mark.set({ at: new Date().toISOString(), ...r });
  }
}
process.exit(0);
