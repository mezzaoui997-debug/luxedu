export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function sendLocalNotification(title, body, url = '/') {
  if (Notification.permission !== 'granted') return;
  const notif = new Notification(title, {
    body, icon: '/icon-192.png', badge: '/icon-192.png',
  });
  notif.onclick = () => { window.focus(); window.location.href = url; };
}

export function notifyAbsence(studentName) {
  sendLocalNotification(' Absence signalée — LuxEdu', `${studentName} est absent(e) aujourd'hui.`);
}

export function notifyPayment(studentName, amount) {
  sendLocalNotification(' Paiement reçu — LuxEdu', `${amount} MAD reçu pour ${studentName}.`);
}

export function notifyPaymentDue(studentName, amount) {
  sendLocalNotification('!️ Impayé urgent — LuxEdu', `${studentName} — ${amount} MAD en attente.`);
}
