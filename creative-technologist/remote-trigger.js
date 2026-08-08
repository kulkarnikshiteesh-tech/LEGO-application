// remote-trigger.js
// Cross-device signal: the phone (AR pop-out) fires, the laptop
// (joystick arrows) listens. Uses a public MQTT-over-WebSocket broker
// (broker.emqx.io) so there's no account/signup, both pages just need
// to load this file. Topic string is unique enough to not collide with
// other public traffic on that broker.
//
// Requires mqtt.js loaded first: unpkg.com/mqtt/dist/mqtt.min.js
//
// Dispatches window 'remote-trigger-status' events with detail one of:
// 'connecting' | 'connected' | 'error' | 'sent' | 'send-failed'
// so pages can show real connection state instead of guessing.

const RemoteTrigger = (() => {
  const TOPIC = 'kshiteesh-creative-technologist-2026/joystick-open';
  const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
  let client = null;

  function report(status) {
    window.dispatchEvent(new CustomEvent('remote-trigger-status', { detail: status }));
  }

  function connect() {
    if (client) return client;
    report('connecting');
    client = mqtt.connect(BROKER_URL, {
      clientId: 'ct-' + Math.random().toString(16).slice(2),
      reconnectPeriod: 2000,
    });
    client.on('connect', () => report('connected'));
    client.on('reconnect', () => report('connecting'));
    client.on('error', (err) => {
      console.error('RemoteTrigger error', err);
      report('error');
    });
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
    const doPublish = () => {
      c.publish(TOPIC, 'open', {}, (err) => {
        if (err) {
          console.error('RemoteTrigger publish failed', err);
          report('send-failed');
        } else {
          report('sent');
        }
      });
    };
    if (c.connected) doPublish();
    else c.once('connect', doPublish);
  }

  return { onTrigger, fire, preconnect: connect };
})();
