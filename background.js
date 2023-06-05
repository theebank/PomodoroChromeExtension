chrome.alarms.create("pomodoro", {
  periodInMinutes: 1 / 60,
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (ret) => {
  chrome.storage.local.set({
    timer: "timer" in ret ? ret.timer : 0,
    isRunning: "isRunning" in ret ? ret.isRunning : false,
    timeOption: "timeOption" in ret ? ret.timeOption : 25,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoro") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (ret) => {
      if (ret.isRunning) {
        let timer = ret.timer + 1;
        let isRunning = true;
        if (timer === 60 * ret.timeOption) {
          this.registration.showNotification("Pomodoro Timer", {
            body: `${res.timeOption} minutes has passed!`,
            icon: "icon.png",
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});
