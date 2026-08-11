# Tech summary per gag

## LEGO brick arrow interface (joystick.html + joystick-popout.html)

* Hand tracking via MediaPipe Tasks Vision (HandLandmarker), running client-side in the browser on the phone's rear camera feed.
* Uses hand-presence detection, not gesture classification, the model is picked up whenever a hand is tracked in frame and dropped when it's gone past a grace window; gesture classifiers (fist/thumbs-up) were tested and proved unreliable.
* The 3D joystick model is real-time rendered with three.js, anchored to the tracked pinch point via an orthographic camera mapped 1:1 to screen pixels.
* The drop event publishes over MQTT (WebSocket, public broker) to the laptop page, which assembles the on-screen LEGO arrow interface, wireless hand-off between two devices, no cable.

## Vase AR (vase-ar.html)

* Same MediaPipe HandLandmarker pipeline, tracking a single hand landmark (pinky PIP joint) to build height.
* The vase is a real revolved 3D mesh (three.js LatheGeometry), not a flat image, generated live from the tracked vertical motion.
* Anchor position is stored as a fraction of screen size rather than raw pixels, so a mid-track viewport resize (entering fullscreen) can't desync the model from the hand.

## Guitar words (guitar-words.html)

* Pure browser audio, no hardware. Web Audio API captures the mic, pitch is detected via autocorrelation (ACF2+) on the raw waveform.
* Detected musical notes map to individual words, forming a sentence as each note is played in sequence.

## RFID contact card (rfid-card.html + rfid\_wifi.ino)

* ESP32 + MFRC522 RFID reader over SPI.
* On a tap, the UID is published over WiFi via MQTT (PubSubClient) straight to a public broker, no wired link to the laptop or phone.
* The phone-side AR page subscribes to the same MQTT topic and reveals the contact card the instant the tap event arrives.

## LEGO logo + application text (ESP\_to\_arduino.ino + lego\_logo\_oled.ino)

* Two separate microcontrollers, cross-triggered over a single GPIO wire: one board (OLED) runs the LEGO logo + arrow sequence, then pulses a signal pin.
* That pin runs through a current-limiting resistor to bridge the 5V logic of one board down to the 3.3V-safe input of the other.
* The OLED is an SSD1306 over I2C; the receiving board drives a 16x2 character LCD over a parallel interface, cycling through the application sentence.

## Disclaimer gag (disclaimer\_gag.ino)

* Kiduino board: A servo motor.
* Push-button triggered state machine: each press sweeps the servo, alternating sweep direction on successive presses, a second button resets/re-centers for another take.

## Spoon + ball bearing circuit (spoon\_ripple.ino)

* Two spoons act as a simple digital switch: a metal ball bearing bridges them, closing the circuit.
* On contact, an SSD1306 OLED (I2C) plays a particle-based confetti animation synthesized entirely in software (no image assets), alongside a buzzer tone.

## LEGO platformer game (lego-platformer.html + adxl\_game\_controller.ino)

* ADXL345 3-axis accelerometer over I2C, streamed continuously from an Arduino Nano to the browser over the Web Serial API (USB, 115200 baud, \~50Hz).
* Tilt on one axis maps to horizontal movement; a sudden spike in total acceleration magnitude (a jerk) is detected and mapped to jump strength, bigger jerk, higher jump.
* Rendering is HTML5 Canvas 2D: the scene is drawn at low resolution to an offscreen canvas, then scaled up with image smoothing disabled, the standard technique for a crisp pixel-art look.

## "Am I a good coder?" (am-i-a-good-coder.html)

* Pure client-side JavaScript, no hardware. Cursor-proximity physics push a button away as the pointer approaches, forcing an indirect answer.

## Pottery motor (pottery\_motor.ino)

* LDR (light-dependent resistor) light-level sensing on an analog pin, driving a motor directly based on a calibrated brightness threshold.

