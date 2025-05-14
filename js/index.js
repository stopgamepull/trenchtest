const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Функция печатания текста
async function typeText(element, text, speed = 50) {
  for (let i = 0; i <= text.length; i++) {
    element.textContent = text.slice(0, i);
    await delay(speed);
  }
}

// Функция для обработки двух <pre> одновременно
async function typeWriterSimultaneously(speed = 50) {
  const pre1 = document.getElementById("pre1");
  const pre2 = document.getElementById("pre2");

  // Сохраняем текст и очищаем перед печатью
  const text1 = pre1.textContent.trim();
  const text2 = pre2.textContent.trim();

  pre1.textContent = "";
  pre2.textContent = "";

  // Запускаем печать текста в обоих <pre> одновременно
  await Promise.all([
    typeText(pre1, text1, speed),
    typeText(pre2, text2, speed),
  ]);
}

// Запуск
(async function () {
  const speed = 50; // Скорость печати в мс
  await typeWriterSimultaneously(speed); // Печатаем одновременно
})();

var D = {
  radius: {},
  angle: {},
  worms: [],

  Random: function (min, max) {
    return Math.random() * (max - min) + min;
  },

  Position: function (center, angle, radius) {
    var x = center.x + Math.cos(angle) * radius;
    var y = center.y + Math.sin(angle) * radius;

    if (x > D.canvas.width) x = x - D.canvas.width;
    if (x < 0) x = D.canvas.width + x;
    if (y > D.canvas.height) y = y - D.canvas.height;
    if (y < 0) y = D.canvas.height + y;

    return { x: x, y: y };
  },

  Change: function (P) {
    var radius = D.Random(D.radius.min, D.radius.max);
    var sign = P.speed < 0 ? 1 : -1;

    P.center = D.Position(P.center, P.angle.a, P.radius + radius);
    P.radius = radius;
    P.speed = 2 * Math.asin(D.speed / P.radius) * sign;
    P.angle.a = P.angle.a + Math.PI;
    P.angle.b = P.angle.a + D.Random(D.angle.min, D.angle.max) * sign;
  },

  Move: function (P) {
    var position = D.Position(P.center, P.angle.a, P.radius);
    P.x = position.x;
    P.y = position.y;
    P.points.push({ x: P.x, y: P.y });

    if (P.points.length > D.tail) {
      P.points.shift();
    }

    for (var i = 0; i < P.points.length; i++) {
      var size = (i * D.size) / P.points.length;
      D.ctx.fillStyle = "rgba(66,222,123,0.5)";
      D.ctx.fillRect(P.points[i].x, P.points[i].y, size, size);
    }
  },

  Update: function () {
    for (var i = 0; i < D.worms.length; i++) {
      var P = D.worms[i];
      var a = (P.angle.a += P.speed);
      var p = P.speed > 0 && P.angle.a > P.angle.b;
      var n = P.speed <= 0 && P.angle.a <= P.angle.b;

      D.Move(P);
      if (p || n) D.Change(P);
    }
  },

  Clear: function () {
    D.ctx.clearRect(0, 0, D.canvas.width, D.canvas.height);
  },

  Draw: function () {
    D.Clear();
    D.Update();
    requestAnimationFrame(D.Draw, D.canvas);
  },

  Point: function () {
    this.points = [];
    this.radius = D.Random(D.radius.min, D.radius.max);
    this.speed = 2 * Math.asin(D.speed / this.radius);
    this.center = {
      x: Math.random() * D.canvas.width,
      y: Math.random() * D.canvas.height,
    };
  },

  Angle: function () {
    this.a = Math.random() * Math.PI * 2;
    this.b = this.a + D.Random(D.angle.min, D.angle.max);
  },

  Create: function () {
    for (var i = 0; i < D.worms.length; i++) {
      D.worms[i] = new D.Point();
      D.worms[i].angle = new D.Angle();
    }
  },

  Params: function () {
    var radius = D.Random(10, 100);
    var worms = D.Random(1, 200);
    var angle = D.Random(0.1, 0.9);

    D.worms = new Array(Math.round(worms));
    D.tail = Math.round((5000 / D.worms.length) * D.Random(0.1, 1));
    D.radius.min = D.Random(1, radius / 2);
    D.radius.max = D.Random(D.radius.min + 1, radius);
    D.size = D.Random(1, 5);
    D.angle.min = Math.PI * angle;
    D.angle.max = Math.PI * (2 - angle);
    D.speed = D.Random(0.5, 1.5);
  },

  Randomize: function () {
    D.Params();
    D.Create();
  },

  Size: function () {
    D.canvas.width = window.innerWidth;
    D.canvas.height = window.innerHeight;
  },

  Init: function () {
    D.canvas = document.querySelector("canvas");
    D.ctx = D.canvas.getContext("2d");
    D.canvas.addEventListener("click", D.Randomize, false);
    window.addEventListener("resize", D.Size, false);
  },

  Run: function () {
    D.Init();
    D.Size();
    D.Randomize();
    D.Draw();
  },
};

D.Run();

const infoButton = document.getElementById("infoButton");
const exitButton = document.getElementById("exitButton");
const infoModal = document.getElementById("infoModal");
const overlay = document.getElementById("overlay");
const closeInfoModal = document.getElementById("closeInfoModal");
const closeExitModal = document.getElementById("closeExitModal");

const openModal = (modal) => {
  modal.classList.add("active");
  overlay.classList.add("active");
};

const closeModal = (modal) => {
  modal.classList.remove("active");
  overlay.classList.remove("active");
};

infoButton.addEventListener("click", () => openModal(infoModal));

closeInfoModal.addEventListener("click", () => closeModal(infoModal));
overlay.addEventListener("click", () => {
  closeModal(infoModal);
});

// Constants
const TOTAL_BLOCKS = 1300;
const TOTALCLUSTERS = 12600 + ~~(Math.random() * 4250);
const CLUSTERSPERBLOCK = ~~(TOTALCLUSTERS / TOTAL_BLOCKS);

// DOM
const modals = document.querySelectorAll(
  ".testing.dialog, .reading.dialog, .analyzing.dialog, .finished.dialog"
);
const screens = document.querySelectorAll(".surface, .info");
const surface = document.querySelector(".surface");
const currentCluster = document.querySelector(".currentcluster");
const percent = document.querySelector(".percent");
const fill = document.querySelector(".fill");
const elapsedTime = document.querySelector(".elapsedtime");

// Block generator
const genBlock = () => {
  const num = ~~(Math.random() * 500);

  if (num < 1) return "bad";
  if (num < 2) return "unmovable";
  if (num < 175) return "used frag";
  else return "unused";
};

// Generate surface
for (let i = 0; i < TOTAL_BLOCKS; i++) {
  const span = document.createElement("span");
  span.className = `block ${genBlock()}`;
  surface.appendChild(span);
}

document.querySelector(".clustersperblock").textContent =
  CLUSTERSPERBLOCK.toLocaleString("en");

// Time Counter
let time = 0;
const updateTime = () => {
  elapsedTime.textContent = new Date(time * 1000).toISOString().substr(11, 8);
  time++;
};

// Ending phase
const endDefrag = () => {
  modals[3].hidden = false;
  clearInterval(timer);
};

// Reading phase
const readBlock = () => {
  currentCluster.textContent = CLUSTERSPERBLOCK * currentBlock;
  if (blocks[currentBlock].classList.contains("frag")) {
    console.log(currentBlock, "fragment detected");
    blocks[currentBlock].classList.remove("frag");
  } else if (blocks[currentBlock].classList.contains("unused")) {
    const fragments = document.querySelectorAll(".used.frag");
    const p = ~~((currentBlock * 100) / totalBlocks);
    percent.textContent = p;
    fill.style.setProperty("width", `${p}%`);
    if (fragments.length == 0) {
      endDefrag();
      return;
    }
    const num = ~~(Math.random() * fragments.length);
    fragments[num].classList.remove("used", "frag");
    fragments[num].classList.add("unused", "reading");
    setTimeout(
      () => fragments[num].classList.remove("reading"),
      200 + ~~(Math.random() * 800)
    );
    blocks[currentBlock].classList.remove("unused");
    blocks[currentBlock].classList.add("used");
  } else currentBlock++;

  // setTimeout(readBlock, 50 + ~~(Math.random() * 50) + [0, 0, 0, 50, 200][~~(Math.random() * 5)]);
  setTimeout(readBlock, 5);
};

let currentBlock = 0;
const totalBlocks = document.querySelectorAll(".used.frag").length;
const blocks = document.querySelectorAll(".block");
const folders = document.querySelector(".folders");

const startDefrag = () => {
  timer = setInterval(updateTime, 1000);
  setTimeout(readBlock, 500);
};

const TAGS = [
  "GAMES",
  "DOS",
  "WINDOWS",
  "AUTODESK",
  "EMM386",
  "PCSHELL",
  "ZIP",
  "RAR",
  "PORN",
  "COREL",
  "WOLF3D",
  "TRACKERS",
  "WORM",
  "NORTON",
  "DOSHELL",
  "INDY",
  "MONKEY",
  "SIMON",
  "WORKS",
  "2DISK",
];

const startDialogs = () => {
  setTimeout(() => {
    modals[0].hidden = true;
    modals[1].hidden = false;
  }, 3000);

  setTimeout(() => {
    modals[1].hidden = true;
    modals[2].hidden = false;
    extractTags(TAGS);
  }, 5000);

  setTimeout(() => {
    modals[2].hidden = true;
    screens[0].classList.remove("off");
    screens[1].classList.remove("off");
    startDefrag();
  }, 7000);
};

const extractTags = (tags) => {
  if (tags.length > 0)
    setTimeout(() => {
      folders.textContent = tags.shift();
      extractTags(tags);
    }, 100);
};

startDialogs();

// document.addEventListener("keydown", function (event) {
//   if (event.altKey || event.code == "F10")
//     location.href = "https://twitter.com/Manz";
// });
