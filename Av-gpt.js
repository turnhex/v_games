// Refactored & safer version of your script

(() => {
  // ---- config / state ----
  const setting = {
    winPatternSize: 3,    // renamed from winnPatternSize
    failedPatternSize: 3, // renamed from faildPatternSize
  };

  let globalList = []; // holds parsed numeric odds, newest first

  // ---- small helpers ----
  const safeQuery = (sel) => document.querySelector(sel);
  const safeQueryAll = (sel) => Array.from(document.querySelectorAll(sel));

  const to12Format = (arr) => arr.map(n => (n < 2 ? 1 : 2));

  const roundToFirstDecimal = (n) => {
    const s = String(n).split('.');
    const decimal = (s[1] && s[1][0]) ? s[1][0] : '0';
    return parseFloat(`${s[0]}.${decimal}0`);
  };

  // ---- pattern extraction ----
  function extractWinFailPatterns(data) {
    const winPattern = [];
    const failPattern = [];
    let winCounter = 0;
    let failCounter = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      if (v < 2) {
        failCounter++;
      } else if (failCounter > 0) {
        failPattern.push(failCounter);
        failCounter = 0;
      }

      if (v > 1.99) {
        winCounter++;
      } else if (winCounter > 0) {
        winPattern.push(winCounter);
        winCounter = 0;
      }
    }

    // push trailing counters if any
    if (failCounter > 0) failPattern.push(failCounter);
    if (winCounter > 0) winPattern.push(winCounter);

    return { winPattern, failPattern };
  }

  // ---- UI helpers (create, append safely) ----
  function createElementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  function clearAndAppend(parent, el) {
    parent.innerHTML = '';
    parent.appendChild(el);
  }

  // ---- Menu (uses event delegation) ----
  function renderMenu(container) {
    const menu = document.createElement('div');
    menu.className = 'menu_customized';
    menu.innerHTML = `
      <div style="font-size:14px; text-align:center;">
        <div><strong>Failed and Win Size</strong></div>
        <div style="margin:6px 0;">
          <button data-action="dec-failed">-</button>
          <span data-bind="failed">${setting.failedPatternSize}</span>
          <button data-action="inc-failed">+</button>
        </div>
        <div style="margin:6px 0;">
          <button data-action="dec-win">-</button>
          <span data-bind="win">${setting.winPatternSize}</span>
          <button data-action="inc-win">+</button>
        </div>
      </div>
    `;

    menu.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'inc-failed': setting.failedPatternSize++; break;
        case 'dec-failed': if (setting.failedPatternSize > 0) setting.failedPatternSize--; break;
        case 'inc-win': setting.winPatternSize++; break;
        case 'dec-win': if (setting.winPatternSize > 0) setting.winPatternSize--; break;
      }
      // update UI bindings
      menu.querySelector('[data-bind="failed"]').textContent = setting.failedPatternSize;
      menu.querySelector('[data-bind="win"]').textContent = setting.winPatternSize;

      // run lastProcess to re-evaluate immediately
      lastProcess();
    });

    // replace (or append) into container
    container.appendChild(menu);
  }

  // ---- visual displays: previous patterns / predictions ----
  function renderPreviousPatterns(parent) {
    const smallOdds = [];
    const largeOdds = [];
    let countSmall = 0, countLarge = 0;

    for (let i = 0; i < globalList.length && countSmall < 10; i++) {
      if (globalList[i] < 2) {
        smallOdds.push(`<span style="color:red">${globalList[i]}</span>`);
        countSmall++;
      }
    }
    for (let i = 0; i < globalList.length && countLarge < 10; i++) {
      if (globalList[i] > 1.99) {
        let style = 'color:rgba(0,0,0,0.6)';
        if (globalList[i] < 3) style = 'color:rgba(180,163,171,1)';
        if (globalList[i] > 9.99) style = 'color:rgb(192,23,180)';
        largeOdds.push(`<span style="${style}">${globalList[i]}</span>`);
        countLarge++;
      }
    }

    const { winPattern, failPattern } = extractWinFailPatterns(globalList);

    let failStr = '';
    let k = 0;
    for (let v of failPattern.slice(0, 15)) {
      failStr += v + ',';
      k++;
      if (k >= setting.failedPatternSize) {
        failStr += ' - ';
        k = 0;
      }
    }

    let winStr = '';
    k = 0;
    for (let v of winPattern.slice(0, 15)) {
      winStr += v + ',';
      k++;
      if (k >= setting.winPatternSize) {
        winStr += ' - ';
        k = 0;
      }
    }

    const el = document.createElement('div');
    el.style.fontSize = '14px';
    el.innerHTML = `
      <div><div>${smallOdds.join(', ') || '—'}</div><div>${largeOdds.join(', ') || '—'}</div></div>
      <div style="margin-top:6px"><strong>Failed P</strong> ${failStr}</div>
      <div style="margin-top:4px"><strong>Win P</strong> ${winStr}</div>
    `;
    clearAndAppend(parent, el);
  }

  function renderPrediction(parent) {
    const { winPattern, failPattern } = extractWinFailPatterns(globalList);

    // build naive prediction similar to your original logic (kept simple & safe)
    const currentFail = failPattern.slice(1, 3);
    const currentWin = winPattern.slice(1, 3);

    const findNexts = (patternArr, currentPat) => {
      const results = [];
      for (let i = 2; i < patternArr.length; i++) {
        const prevPair = [patternArr[i - 2], patternArr[i - 1]];
        if (prevPair.toString() === currentPat.toString()) results.push(patternArr[i]);
      }
      return results.length ? results : ['not Found'];
    };

    const failNext = findNexts(failPattern, currentFail);
    const winNext = findNexts(winPattern, currentWin);

    const el = document.createElement('div');
    el.style.fontSize = '15px';
    el.innerHTML = `
      <div>Predict F : <span style="color:red">[${failPattern.slice(0, 3)}]</span> : ${failNext.slice(0, 13)}</div>
      <div>Predict W : <span style="color:green">[${winPattern.slice(0, 3)}]</span> : ${winNext.slice(0, 13)}</div>
      <div style="margin-top:6px">Next F: <b style="color:red">${failNext}</b></div>
      <div>Next W: <b style="color:green">${winNext}</b></div>
    `;
    clearAndAppend(parent, el);
  }

  // ---- main processing function ----
  function lastProcess() {
    const container = safeQuery('.data-list.ng-star-inserted') || safeQuery('.data-list.ng-star-inserted');
    if (!container) return;

    // create or reuse dedicated holders
    let prevHolder = container.querySelector('._previous_patterns');
    if (!prevHolder) {
      prevHolder = document.createElement('div');
      prevHolder.className = '_previous_patterns';
      container.appendChild(prevHolder);
    }

    let predictionHolder = container.querySelector('._prediction');
    if (!predictionHolder) {
      predictionHolder = document.createElement('div');
      predictionHolder.className = '_prediction';
      container.appendChild(predictionHolder);
    }

    // render
    renderPreviousPatterns(prevHolder);
    renderPrediction(predictionHolder);

    // ensure menu exists
    let menuContainer = container.querySelector('._menu_container');
    if (!menuContainer) {
      menuContainer = document.createElement('div');
      menuContainer.className = '_menu_container';
      container.appendChild(menuContainer);
      renderMenu(menuContainer);
    }
  }

  // ---- read DOM odds and update globalList safely ----
  function getGlobalListFromDOM() {
    const payouts = safeQueryAll('.payout.ng-star-inserted, .payout.ng-star-inserted .payout'); // try a couple selectors
    if (!payouts.length) return;

    const tmp = [];
    for (let el of payouts) {
      const text = (el.innerText || '').replace(/x/g, '').trim();
      const num = parseFloat(text);
      if (!Number.isNaN(num)) tmp.push(num);
    }

    if (!tmp.length) return;

    // first-time
    if (globalList.length === 0) {
      globalList = tmp.slice();
      lastProcess();
      return;
    }

    // find where current known sequence is inside tmp
    const positionSize = 4;
    const globalSlice = globalList.slice(0, positionSize);
    let positionIndex = 0;
    for (let i = 0; i <= tmp.length - positionSize; i++) {
      const s = tmp.slice(i, i + positionSize);
      if (s.toString() === globalSlice.toString()) {
        positionIndex = i;
        break;
      }
    }

    const newEntries = tmp.slice(0, positionIndex);
    // newEntries might be [] meaning nothing new
    if (newEntries.length) {
      globalList = newEntries.concat(globalList);
      // limit to reasonable length (avoid runaway growth)
      globalList = globalList.slice(0, 200);
    }
    lastProcess();
  }

  // ---- Mutation observer with debounce ----
  let observer = null;
  let observeTimer = 0;
  function startObserver() {
    if (observer) return;
    const target = safeQuery('div.payouts-block');
    if (!target) {
      console.warn('payouts-block not found');
      return;
    }
    observer = new MutationObserver((mutations) => {
      clearTimeout(observeTimer);
      observeTimer = setTimeout(getGlobalListFromDOM, 150); // debounce 150ms
    });
    observer.observe(target, { attributes: true, childList: true, subtree: true, characterData: true });
    console.log('Observer started on payouts-block');
  }
  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
    clearTimeout(observeTimer);
    console.log('Observer stopped');
  }

  // ---- init adjustments (non-destructive) ----
  (function safeInit() {
    // only set a non-breaking attribute if element exists
    const betsContainer = safeQuery('div.bets-widget-container');
    if (betsContainer) {
      // do not blindly remove all attributes; instead set a safe attr if needed
      if (!betsContainer.hasAttribute('_ngcontent-rni-c200')) {
        betsContainer.setAttribute('_ngcontent-rni-c200', '');
        console.log('Added attribute _ngcontent-rni-c200');
      }
    }

    // create gameInformation element if missing
    const dataList = safeQuery('.data-list.ng-star-inserted');
    if (dataList && !dataList.querySelector('.gameInformation')) {
      const gi = document.createElement('div');
      gi.className = 'gameInformation';
      dataList.insertBefore(gi, dataList.firstChild);
    }
  })();

  // ---- exported API ----
  window.myOddsAnalyzer = {
    start: () => { startObserver(); getGlobalListFromDOM(); },
    stop: () => stopObserver(),
    updatePattern: (incW, decW, incF, decF) => {
      if (incW) setting.winPatternSize++;
      if (decW && setting.winPatternSize > 0) setting.winPatternSize--;
      if (incF) setting.failedPatternSize++;
      if (decF && setting.failedPatternSize > 0) setting.failedPatternSize--;
      lastProcess();
    },
    getState: () => ({ setting: { ...setting }, globalList: [...globalList] })
  };

  // auto start
  window.myOddsAnalyzer.start();

})();
