const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9270;
  const tempDir = path.join(process.env.TEMP, 'chrome_cdp_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1440,900'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const wsUrl = listRes[0].webSocketDebuggerUrl;
    console.log('Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://localhost:3000/work...');
    await send('Page.navigate', { url: 'http://localhost:3000/work' });
    await new Promise(r => setTimeout(r, 3000));

    // Evaluate initial positions
    const initialCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.getElementById('cinematic');
        const f = document.getElementById('fashion-jewellery');
        return {
          title: document.title,
          cinematicRect: c ? c.getBoundingClientRect() : null,
          fashionRect: f ? f.getBoundingClientRect() : null,
          bodyOverflow: window.getComputedStyle(document.body).overflow,
          htmlOverflow: window.getComputedStyle(document.documentElement).overflow
        };
      })()`,
      returnByValue: true
    });
    console.log('Initial Check:', JSON.stringify(initialCheck.result.result.value, null, 2));

    // Scroll to 450px: Cinematic stays at top: 0, Fashion slides up over it
    console.log('Scrolling to 450px...');
    const scrollRes = await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo({ top: 450, behavior: 'instant' });
        const c = document.getElementById('cinematic');
        const f = document.getElementById('fashion-jewellery');
        const cRect = c.getBoundingClientRect();
        const fRect = f.getBoundingClientRect();
        return {
          scrollY: window.scrollY,
          viewportHeight: window.innerHeight,
          cinematic: {
            top: cRect.top,
            bottom: cRect.bottom,
            height: cRect.height,
            isPinned: cRect.top === 0
          },
          fashionJewellery: {
            top: fRect.top,
            bottom: fRect.bottom,
            height: fRect.height,
            isSlidingUpOverCinematic: fRect.top < cRect.bottom && fRect.top > 0
          }
        };
      })()`,
      returnByValue: true
    });
    console.log('Scroll at 450px:', JSON.stringify(scrollRes.result.result.value, null, 2));

    // Capture screenshot mid-transition
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotBuffer = Buffer.from(shot.result.data, 'base64');
    const outPath = path.join(__dirname, '..', 'screenshots', 'work_mid_transition_verified.png');
    fs.writeFileSync(outPath, shotBuffer);
    console.log('Saved screenshot to:', outPath);

    // Scroll to 1350px: Fashion & Jewellery pinned at top: 0, Commercial slides up over it
    console.log('Scrolling to 1350px...');
    const scrollRes2 = await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo({ top: 1350, behavior: 'instant' });
        const f = document.getElementById('fashion-jewellery');
        const comm = document.getElementById('commercial');
        const fRect = f.getBoundingClientRect();
        const commRect = comm.getBoundingClientRect();
        return {
          scrollY: window.scrollY,
          fashion: {
            top: fRect.top,
            bottom: fRect.bottom,
            isPinned: fRect.top === 0
          },
          commercial: {
            top: commRect.top,
            bottom: commRect.bottom,
            isSlidingUpOverFashion: commRect.top < fRect.bottom && commRect.top > 0
          }
        };
      })()`,
      returnByValue: true
    });
    console.log('Scroll at 1350px:', JSON.stringify(scrollRes2.result.result.value, null, 2));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    const shotBuffer2 = Buffer.from(shot2.result.data, 'base64');
    const outPath2 = path.join(__dirname, '..', 'screenshots', 'work_fashion_commercial_transition.png');
    fs.writeFileSync(outPath2, shotBuffer2);
    console.log('Saved screenshot to:', outPath2);

    ws.close();
  } finally {
    chromeProc.kill();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
