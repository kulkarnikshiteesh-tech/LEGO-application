// remote-trigger-rfid.js
// Same pattern as remote-trigger.js (public MQTT-over-WebSocket broker,
// no signup) but on its own topic, so an RFID tap never accidentally
// fires the joystick page's entrance and vice versa. The ESP32 running
// the RC522 reader publishes directly to this topic over WiFi -- no
// laptop, no USB cable in the shot.
//
// Requires mqtt.js loaded first: unpkg.com/mqtt/dist/mqtt.min.js

const RfidTrigger = (() => {
  const TOPIC = 'kshiteesh-creative-technologist-2026/rfid-tap';
  const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
  let client = null;

  function report(status) {
    window.dispatchEvent(new CustomEvent('rfid-trigger-status', { detail: status }));
  }

  function connect() {
    if (client) return client;
    report('connecting');
    client = mqtt.connect(BROKER_URL, {
      clientId: 'ct-rfid-' + Math.random().toString(16).slice(2),
      reconnectPeriod: 2000,
    });
    client.on('connect', () => report('connected'));
    client.on('reconnect', () => report('connecting'));
    client.on('error', (err) => {
      console.error('RfidTrigger error', err);
      report('error');
    });
    return client;
  }

  // Call once on load, callback fires whenever the reader picks up a tap.
  function onTrigger(callback) {
    const c = connect();
    c.on('connect', () => c.subscribe(TOPIC));
    c.on('message', (topic, payload) => {
      if (topic === TOPIC) callback(payload.toString());
    });
  }

  return { onTrigger, preconnect: connect };
})();
