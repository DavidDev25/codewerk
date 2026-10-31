// Lektion 43 – Der Event Loop
setTimeout(() => console.log("W"), 0);
Promise.resolve().then(() => console.log("X"));
console.log("Y");
queueMicrotask(() => console.log("Z"));

// 1. const vorhersage = ["?", "?", "?", "?"];


// 2. function einplanen(log) { ... }


// 3. function zerlegen(liste, fertig) { ... }
