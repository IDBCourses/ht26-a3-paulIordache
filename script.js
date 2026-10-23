/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape, Shape } from "./shape.js";

const circle = createShape("example", "shape");
circle.setPositionPixels(window.screen.width / 2, window.screen.height / 2);

//
// init();
// animate();

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down
const gravity = 0.2;

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
let elem = document.querySelector(".shape");
let style = getComputedStyle(elem);
let pointerInAction = false;

let directionX = "",
  directionY = "",
  oldx = 0,
  oldY = 0,
  mousemovemethod = (e) => {
    if (e.pageX < oldx) {
      directionX = "left";
    } else if (e.pageX > oldx) {
      directionX = "right";
    }

    if (e.pageY < oldY) {
      directionY = "up";
    } else if (e.pageY > oldY) {
      directionY = "down";
    }

    oldx = e.pageX;
    oldY = e.pageY;
  };

// ---------- Update ----------
// Update the state. This is called every 100ms.
const update = (event) => {
  setTimeout(update, 10); // call update() again in 100 milliseconds

  if (pointerInAction === false) {
    if (circle.y + parseInt(style.height, 10) + 50 > window.screen.height) {
      circle.dy = -circle.dy;
      synth.triggerAttackRelease("G#1", "8n");
    } else {
      circle.dy += gravity;
    }

    if (
      circle.x + parseInt(style.width, 10) > window.screen.width ||
      circle.x <= 0
    ) {
      synth.triggerAttackRelease("E1", "16n");
      circle.dx = -circle.dx;
    }
    circle.setPositionPixels(circle.x + circle.dx, circle.y + circle.dy);
  }
  window.addEventListener("pointermove", (e) => {
    mousemovemethod(e);

    if (pointerInAction === true) {
      circle.setPositionPixels(e.clientX, e.clientY);

      if (directionX == "left") {
        if (Math.sign(circle.dx) == 1) {
          circle.dx = -circle.dx;
        }
      } else if (directionX == "right") {
        if (Math.sign(circle.dx) == -1) {
          circle.dx = -circle.dx;
        }
      }

      if (directionY == "up") {
        if (Math.sign(circle.dy) == 1) {
          circle.dy = -circle.dy;
        }
      } else if (directionY == "down") {
        if (Math.sign(circle.dy) == -1) {
          circle.dy = -circle.dy;
        }
      }
    }
  });

  circle.setColour(++circle.hue % 360);
};

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
const use = () => {
  setTimeout(use, 100); // call use() again in 100 milliseconds
};

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
// const pointerDown = (event) => {
//   console.log("SADASDD: ", parseInt(style.height, 10));
//   console.log("Pointer down at", event.clientX, event.clientY);
//
// //
// //   if (
// //     event.clientX >= circle.x &&
// //     event.clientX <= circle.x + parseInt(style.width, 10) &&
// //     event.clientY >= circle.y &&
// //     event.clientY <= circle.y + parseInt(style.height, 10)
// //   ) {
// //     pointerInAction = true;
// //
// //     if (direction == "left") {
// //       if (Math.sign(circle.dx) == 1) {
// //         circle.dx = -circle.dx;
// //       }
// //     }
// //   }
//
//   // synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
// };

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
//

function setup() {
  Tone.start();

  update(); // start the update loop
  use(); // start the use loop

  // Put your event listener code here
  // window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerdown", (event) => {
    if (
      event.clientX >= circle.x &&
      event.clientX <= circle.x + parseInt(style.width, 10) &&
      event.clientY >= circle.y &&
      event.clientY <= circle.y + parseInt(style.height, 10)
    ) {
      pointerInAction = true;
    }
  });
  window.addEventListener("pointerup", () => {
    pointerInAction = false;
  });
}

setup(); // Always remember to call setup()!
