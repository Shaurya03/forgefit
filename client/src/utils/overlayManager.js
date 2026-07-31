let openOverlays = []; // stack: [{ id, onCloseRef }], last = topmost
let idCounter = 0;
let historyDepth = 0;
let programmaticPopsExpected = 0;
let flushScheduled = false;
let listenerAttached = false;

function attachListener() {
  if (listenerAttached) return;
  listenerAttached = true;
  window.addEventListener("popstate", handlePopState);
}

function handlePopState() {
  historyDepth = Math.max(0, historyDepth - 1);

  if (programmaticPopsExpected > 0) {
    // This pop was triggered by our own flush() catching history down
    // to match overlays that already closed by other means (not a
    // real back-button press) — don't call any onClose for it.
    programmaticPopsExpected -= 1;
    return;
  }

  // Real back-button press: close the topmost overlay.
  const top = openOverlays.pop();
  if (top) top.onCloseRef.current();
}

function scheduleFlush() {
  if (flushScheduled) return;
  flushScheduled = true;
  setTimeout(() => {
    flushScheduled = false;
    flush();
  }, 0);
}

function flush() {
  const desired = openOverlays.length;

  while (historyDepth < desired) {
    historyDepth += 1;
    window.history.pushState(
      { ...window.history.state, overlayDepth: historyDepth },
      ""
    );
  }

  if (historyDepth > desired) {
    const diff = historyDepth - desired;

    // Only safe to rewind browser history if we're still sitting on one
    // of our own phantom overlay entries. If the app has since navigated
    // forward to a new route (e.g. clicking a Navbar link), the current
    // history entry belongs to React Router and won't carry our
    // overlayDepth marker — calling go() here would wrongly undo that
    // navigation. In that case, just resync our counter instead.
    if (window.history.state?.overlayDepth === historyDepth) {
      programmaticPopsExpected += diff;
      window.history.go(-diff);
      // historyDepth catches down as each popstate arrives above
    } else {
      historyDepth = desired;
    }
  }
}

export function registerOverlay(onCloseRef) {
  attachListener();
  idCounter += 1;
  const id = idCounter;
  openOverlays.push({ id, onCloseRef });
  scheduleFlush();
  return id;
}

export function unregisterOverlay(id) {
  const index = openOverlays.findIndex((o) => o.id === id);
  if (index !== -1) openOverlays.splice(index, 1);
  scheduleFlush();
}