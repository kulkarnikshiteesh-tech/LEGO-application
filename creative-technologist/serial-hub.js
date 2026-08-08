// serial-hub.js
// Shared Web Serial link. Any gag page includes this + calls SerialHub.connect().
// Protocol: firmware prints ONE token per line, newline-terminated, e.g.
//   BUZZ
//   RFID:4A1F2B09
//   JOY:UP
// This module reads lines and re-broadcasts them as a "serial-msg" event
// on window, with detail = the raw line (string). Gag pages just listen:
//   window.addEventListener('serial-msg', e => { ... e.detail ... })

const SerialHub = (() => {
  let port = null;
  let reader = null;
  let keepReading = false;

  async function connect(baudRate = 115200) {
    if (!('serial' in navigator)) {
      window.dispatchEvent(new CustomEvent('serial-status', { detail: 'unsupported' }));
      throw new Error('Web Serial not supported in this browser. Use Chrome or Edge on desktop.');
    }
    port = await navigator.serial.requestPort();
    await port.open({ baudRate });
    keepReading = true;
    window.dispatchEvent(new CustomEvent('serial-status', { detail: 'connected' }));
    readLoop();
    return port;
  }

  async function readLoop() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    let buffer = '';
    try {
      while (keepReading) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        let idx;
        while ((idx = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (line.length) {
            window.dispatchEvent(new CustomEvent('serial-msg', { detail: line }));
          }
        }
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('serial-status', { detail: 'error' }));
    } finally {
      reader.releaseLock();
    }
  }

  async function disconnect() {
    keepReading = false;
    if (reader) { try { await reader.cancel(); } catch (e) {} }
    if (port) { try { await port.close(); } catch (e) {} }
    window.dispatchEvent(new CustomEvent('serial-status', { detail: 'disconnected' }));
  }

  return { connect, disconnect };
})();
