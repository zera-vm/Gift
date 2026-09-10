(() => {

const canvas =
  document.getElementById('canvas');

const ctx =
  canvas.getContext('2d');


/* ================= GAMBAR KARTU ================= */

const w = canvas.width;
const h = canvas.height;

const img = new image();
img.src = "gift.jpg";
img.onload = () => {
  ctx.drawImage(img, 0, 0, w, h);
  ctx.strokeStyle = 'rgba (251,254,231,.8)';
  ctx.limeWidth = 9;
ctx.strokeRect(4, 4, w - 9, h - 8);
};

/* ================= SALJU ================= */

const snow =
  document.createElement('div');

snow.className =
  'snow-container';

document.body.appendChild(snow);

for(let i = 0; i < 55; i++){

  const flake =
    document.createElement('div');

  flake.className =
    'snowflake';

  const size =
    Math.random() * 4 + 2;

  const fall =
    Math.random() * 8 + 9;

  const sway =
    Math.random() * 3 + 2.5;

  flake.style.left =
    Math.random() * 100 + 'vw';

  flake.style.width =
    size + 'px';

  flake.style.height =
    size + 'px';

  flake.style.opacity =
    Math.random() * .5 + .4;

  flake.style.animationDuration =
    fall + 's,' +
    sway + 's';

  flake.style.animationDelay =
    (-Math.random() * fall) + 's,' +
    (-Math.random() * sway) + 's';

  snow.appendChild(flake);

}


/* ================= ROTASI 3D ================= */

function rotate3D(
  viewport,
  target,
  opt = {}
){

  let x =
    opt.x || 0;

  let y =
    opt.y || 0;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let moved = false;
  let idle;

  const clamp =
    opt.clamp || [-60, 60];

  const sensitivity =
    opt.sensitivity || .4;

  const apply = () => {

    target.style.transform =
      `rotateX(${x}deg) rotateY(${y}deg)`;

  };

  const stopIdle = () => {

    if(idle){

      cancelAnimationFrame(idle);

      idle = null;

    }

  };

  const startIdle = () => {

    stopIdle();

    let t = 0;

    const loop = () => {

      t += .006;

      y += Math.sin(t) * .05;

      apply();

      idle =
        requestAnimationFrame(loop);

    };

    idle =
      requestAnimationFrame(loop);

  };

  viewport.addEventListener(
    'pointerdown',
    e => {

      dragging = true;
      moved = false;

      lastX = e.clientX;
      lastY = e.clientY;

      stopIdle();

      if(viewport.setPointerCapture){

        try{

          viewport.setPointerCapture(
            e.pointerId
          );

        }catch{}

      }

    }
  );

  window.addEventListener(
    'pointermove',
    e => {

      if(!dragging) return;

      const dx =
        e.clientX - lastX;

      const dy =
        e.clientY - lastY;

      if(
        Math.abs(dx) +
        Math.abs(dy) > 4
      ){

        moved = true;

      }

      y +=
        dx * sensitivity;

      x -=
        dy * sensitivity;

      x = Math.max(
        clamp[0],
        Math.min(
          clamp[1],
          x
        )
      );

      lastX = e.clientX;
      lastY = e.clientY;

      apply();

      e.preventDefault();

    },
    {
      passive: false
    }
  );

  window.addEventListener(
    'pointerup',
    () => {

      if(!dragging) return;

      dragging = false;

      if(
        !moved &&
        opt.tap
      ){

        opt.tap();

      }

      if(opt.idle){

        setTimeout(
          () => {

            if(!dragging)
              startIdle();

          },
          3000
        );

      }

    }
  );

  apply();

  if(opt.idle)
    startIdle();

}


/* ================= BUKA KADO ================= */

const boxViewport =
  document.getElementById(
    'boxViewport'
  );

const box =
  document.getElementById(
    'box3d'
  );

const giftScene =
  document.getElementById(
    'giftScene'
  );

const cardScene =
  document.getElementById(
    'cardScene'
  );

const card =
  document.getElementById(
    'card3d'
  );

let opened = false;


function sparks(){

  const rect =
    boxViewport.getBoundingClientRect();

  const colors = [
    '#fff',
    '#f1f1f1',
    '#ffeaa7',
    '#ff3333'
  ];

  for(let i = 0; i < 16; i++){

    const s =
      document.createElement('div');

    s.className = 'spark';

    const size =
      5 + Math.random() * 6;

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      60 + Math.random() * 90;

    s.style.width =
      size + 'px';

    s.style.height =
      size + 'px';

    s.style.background =
      colors[
        i % colors.length
      ];

    s.style.left =
      rect.left +
      rect.width / 2 +
      'px';

    s.style.top =
      rect.top +
      rect.height * .3 +
      'px';

    s.style.setProperty(
      '--dx',
      Math.cos(angle) *
      distance +
      'px'
    );

    s.style.setProperty(
      '--dy',
      Math.sin(angle) *
      distance +
      'px'
    );

    document.body.appendChild(s);

    setTimeout(
      () => s.remove(),
      950
    );

  }

}


rotate3D(
  boxViewport,
  box,
  {

    x: -16,
    y: -28,

    clamp: [
      -45,
      45
    ],

    sensitivity: .4,

    idle: true,

    tap(){

      if(opened) return;

      opened = true;

      box.classList.add(
        'open'
      );

      sparks();

      setTimeout(
        () => {

          giftScene.classList.remove(
            'active'
          );

          cardScene.classList.add(
            'active'
          );

          card.classList.add(
            'entering'
          );

        },
        600
      );

    }

  }
);


/* ================= KARTU ================= */

const cardViewport =
  document.getElementById(
    'cardViewport'
  );

card.addEventListener(
  'animationend',
  () => {

    card.classList.remove(
      'entering'
    );

  }
);

rotate3D(
  cardViewport,
  card,
  {

    x: -8,
    y: -16,

    clamp: [
      -50,
      50
    ],

    sensitivity: .5,

    idle: true

  }
);


/* ================= DOWNLOAD GAMBAR ================= */

canvas.addEventListener(
  'click',
  () => {

    canvas.toBlob(
      blob => {

        if(!blob) return;

        const url =
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            'a'
          );

        a.href = url;

        a.download =
          'foto-kado.png';

        document.body.appendChild(a);

        a.click();

        a.remove();

        setTimeout(
          () => {

            URL.revokeObjectURL(
              url
            );

          },
          100
        );

      },
      'image/png'
    );

  }
);

})();