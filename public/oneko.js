// oneko-colored.js - Complete version with color customization
(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  // Configuration
  const config = {
    color: '#ff6b6b', 
    size: 32,
    speed: 10,
    idleTime: 20 
  };

  const nekoEl = document.createElement("div");
  let nekoPosX = config.size;
  let nekoPosY = config.size;
  let mousePosX = 0;
  let mousePosY = 0;
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]]
  };

  function hexToHue(hexColor) {
    // Simplified hex to hue conversion
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return Math.round(h * 360);
  }

  function applyColorFilter() {
    const hueRotation = hexToHue(config.color);
    nekoEl.style.filter = `
      brightness(1.1)
      drop-shadow(0 0 2px ${config.color})
      hue-rotate(${hueRotation}deg)
      saturate(1.5)
    `;
  }

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = `${config.size}px`;
    nekoEl.style.height = `${config.size}px`;
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - config.size/2}px`;
    nekoEl.style.top = `${nekoPosY - config.size/2}px`;
    nekoEl.style.zIndex = 2147483647;

    // Check for color parameter in script tag
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.color) {
      config.color = curScript.dataset.color;
    }
    if (curScript && curScript.dataset.cat) {
      nekoEl.style.backgroundImage = `url(${curScript.dataset.cat})`;
    } else {
      nekoEl.style.backgroundImage = "url(./oneko.gif)";
    }

    applyColorFilter();
    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", (event) => {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * config.size}px ${sprite[1] * config.size}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    if (idleTime > config.idleTime && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
      let availableIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < config.size) availableIdleAnimations.push("scratchWallW");
      if (nekoPosY < config.size) availableIdleAnimations.push("scratchWallN");
      if (nekoPosX > window.innerWidth - config.size) availableIdleAnimations.push("scratchWallE");
      if (nekoPosY > window.innerHeight - config.size) availableIdleAnimations.push("scratchWallS");
      
      idleAnimation = availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < config.speed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * config.speed;
    nekoPosY -= (diffY / distance) * config.speed;

    nekoPosX = Math.min(Math.max(config.size/2, nekoPosX), window.innerWidth - config.size/2);
    nekoPosY = Math.min(Math.max(config.size/2, nekoPosY), window.innerHeight - config.size/2);

    nekoEl.style.left = `${nekoPosX - config.size/2}px`;
    nekoEl.style.top = `${nekoPosY - config.size/2}px`;
  }

  init();
})();