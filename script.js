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
circle.setPositionPixels(window.innerWidth / 2, window.innerHeight / 2);

const title = createShape("tit", "title");
title.setPositionPixels(250, 360);

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down
const gravity = 0.2;

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  pointerOnHtmlElement: false, // if pointer is held down on the HTML element
};
let followingCursor = false;
let moveTitle = false;


// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
let elem = document.querySelector(".shape");
let shapeStyleCSS = getComputedStyle(elem); // needed for width and height

let directionX = 0,
  oldX = 0,
  mouseDirectionXAxis = (e) => {
    // find out in which direction does the mouse move
    [directionX, oldX] = e.pageX > oldX ? [1, e.pageX] : [-1, e.pageX];
  };

// ---------- Update ----------
// Update the state. This is called every 100ms.
const update = (event) => {
  setTimeout(update, 100); // call update() again in 100 milliseconds
  circle.dx *= 0.99;
};

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
const use = () => {
  setTimeout(use, 10); // call use() again in 100 milliseconds

  if (moveTitle === true) {
    title.setPositionPixels(title.x, title.y - 2);
  }

  if (mouse.pointerOnHtmlElement) {
    return;
  }

  if (followingCursor) {
    Tone.Transport.bpm.value =
      700 -
      Math.min(
        700,
        Math.sqrt(
          Math.abs(
            Math.pow(mouse.x - circle.x, 2) + Math.pow(mouse.y - circle.y, 2),
          ),
        ),
      );
    circle.setPositionPixels(
      circle.x + (mouse.x - circle.x) * 0.001,
      circle.y + (mouse.y - circle.y) * 0.001,
    );
    return;
  }

  if (
    circle.y + parseInt(shapeStyleCSS.height, 10) + circle.dy >
      window.innerHeight ||
    circle.y + circle.dy <= 0
  ) {
    circle.dy *= -0.9;
    circle.dy = circle.dy < 0 ? Math.min(-7, circle.dy) : circle.dy;
    synth.triggerAttackRelease("G#1", "8n");
  }
  circle.dy += gravity;

  if (
    circle.x + parseInt(shapeStyleCSS.width, 10) + circle.dx >
      window.innerWidth ||
    circle.x + circle.dx <= 0
  ) {
    circle.dx *= -0.8;
    synth.triggerAttackRelease("E1", "16n");
  }
  circle.setPositionPixels(circle.x + circle.dx, circle.y + circle.dy);

  // circle.setColour(++circle.hue % 360);
};

let timestamp = null;
let lastMouseX = null;
let lastMouseY = null;
let speedX = 0;
let speedY = 0;

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
const pointerMove = (e) => {
  mouseDirectionXAxis(e);

  if (timestamp === null) {
    timestamp = Date.now();
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
    return;
  }

  let now = Date.now();
  let dt = now - timestamp;
  let dx = e.screenX - lastMouseX;
  let dy = e.screenY - lastMouseY;
  speedX = Math.round((dx / dt) * 0.2);
  speedY = Math.round((dy / dt) * 0.7);

  timestamp = now;
  lastMouseX = e.screenX;
  lastMouseY = e.screenY;
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (mouse.pointerOnHtmlElement === true) {
    circle.setPositionPixels(e.clientX, e.clientY);
    [circle.dx, circle.dy] = [
      Math.abs(Math.max(12, circle.dx)),
      Math.abs(Math.max(12, circle.dy)),
    ];
  }
};
const pointerDown = (event) => {
  // check the html element bounding
  mouse.pointerOnHtmlElement =
    event.clientX >= circle.x &&
    event.clientX <= circle.x + parseInt(shapeStyleCSS.width, 10) &&
    event.clientY >= circle.y &&
    event.clientY <= circle.y + parseInt(shapeStyleCSS.height, 10)
      ? true
      : mouse.pointerOnHtmlElement;
};

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
const synthhh = new Tone.PolySynth(Tone.MembraneSynth).toDestination();
const synthA = new Tone.PolySynth().toDestination();
const synthB = new Tone.MetalSynth().toDestination();
const synthC = new Tone.MembraneSynth().toDestination();

const now = Tone.now();
synthhh.triggerAttack("D4", now);
synthhh.triggerAttack("F4", now + 0.25);
synthhh.triggerAttack("A4", now + 0.75);
synthhh.triggerAttack("C5", now + 1);
synthhh.triggerAttack("E5", now + 1.25);
synthhh.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 2.7);

//play a note every sixteenth-note
const loopA = new Tone.Loop((time) => {
  synthhh.triggerAttackRelease("A2", "4n", time);
}, "2n").start(0);

const loopB = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C2", "2n", time);
}, "1n").start(0);

// Tone.Transport.bpm.rampTo(300, 10);
//
//play another note every off half-note,by starting it "2n"
const loopC = new Tone.Loop((time) => {
  synthhh.triggerAttackRelease("G4", "8n", time);
}, "4n").start(0);

const loopD = new Tone.Loop((time) => {
  synthhh.triggerAttackRelease("G4", "8n", time);
}, "2n").start(0);

const setup = () => {
  update(); // start the update loop
  use(); // start the use loop

  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerup", () => {
    if (mouse.pointerOnHtmlElement === true) {
      circle.dx *= speedX;
      circle.dy *= speedY;

      if (speedX === 0) {
        circle.dx += directionX;
      }
    }
    mouse.pointerOnHtmlElement = false;
  });
  window.addEventListener("keypress",  (event) => {
    if (event.key === " ") {
      moveTitle = true;
      Tone.start();
    }

    if (event.key === "a") {
      followingCursor = !followingCursor;
    }

    if (followingCursor) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  });
};

setup(); // Always remember to call setup()!
