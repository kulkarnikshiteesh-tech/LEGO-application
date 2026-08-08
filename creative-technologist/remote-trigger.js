// remote-trigger.js
// Cross-device signal: the phone (AR pop-out) fires, the laptop
// (joystick arrows) listens. Uses a public MQTT-over-WebSocket broker
// (broker.emqx.io) so there's no account/signup, both pages just need
// to load this file. Topic string is unique enough to not collide with
// other public traffic on that broker.
//
// Requires mqtt.js loaded first: unpkg.com/mqtt/dist/mqtt.min.js

const RemoteTrigger = (() => {
  const TOPIC = 'kshiteesh-creative-technologist-2026/joystick-open';
  const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
  let client = null;

  function connect() {
    if (client) return client;
    client = mqtt.connect(BROKER_URL, {
      clientId: 'ct-' + Math.random().toString(16).slice(2),
      reconnectPeriod: 2000,
    });
    client.on('error', (err) => console.error('RemoteTrigger error', err));
    return client;
  }

  // Laptop side: call once on load, callback fires whenever the phone drops.
  function onTrigger(callback) {
    const c = connect();
    c.on('connect', () => c.subscribe(TOPIC));
    c.on('message', (topic) => {
      if (topic === TOPIC) callback();
    });
  }

  // Phone side: call the moment the model is dropped.
  function fire() {
    const c = connect();
    if (c.connected) {
      c.publish(TOPIC, 'open');
    } else {
      c.once('connect', () => c.publish(TOPIC, 'open'));
    }
  }

  return { onTrigger, fire };
})();
