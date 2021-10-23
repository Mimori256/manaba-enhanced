"use strict"

import { getStorage, setStorage } from "./network/storage"

chrome.runtime.onInstalled.addListener((details) => {
  if (["install", "update"].includes(details.reason)) {
    const query = new URLSearchParams({
      event: details.reason,
    })

    chrome.tabs.create({
      url: `${chrome.runtime.getURL("options.html")}?${query.toString()}`,
    })
  }

  getStorage({
    kind: "sync",
    keys: null,
    callback: (storage) => {
      setStorage({
        kind: "sync",
        items: {
          "features-assignments-coloring":
            storage["features-assignments-coloring"] ?? true,
          featuresAssignmentsColoring:
            storage["features-assignments-coloring"] ?? true,
          "features-deadline-highlighting":
            storage["features-deadline-highlighting"] ?? true,
          featuresDeadlineHighlighting:
            storage["features-deadline-highlighting"] ?? true,
          "features-autosave-reports":
            storage["features-autosave-reports"] ?? true,
          featuresAutoSaveReports: storage["features-autosave-reports"] ?? true,
          "features-remove-confirmation":
            storage["features-remove-confirmation"] ?? true,
          featuresRemoveConfirmation:
            storage["features-remove-confirmation"] ?? true,
          "features-filter-courses": storage["features-filter-courses"] ?? true,
          featuresFilterCourses: storage["features-filter-courses"] ?? true,
          featuresDragAndDrop: storage.featuresDragAndDrop ?? true,
          featuresDisableForceFileSaving:
            storage.featuresDisableForceFileSaving ?? true,
        },
      })
    },
  })

  chrome.contextMenus.create({
    id: "respon",
    type: "normal",
    contexts: ["selection"],
    title: "Open this code in Respon",
  })
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage()
  }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === "respon" &&
    tab &&
    tab.url &&
    tab.url.includes("manaba.tsukuba.ac.jp")
  ) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { kind: "open-in-respon" })
    }
  }
})

chrome.commands.onCommand.addListener((cmd: string, tab: chrome.tabs.Tab) => {
  switch (cmd) {
    case "manaba-enhanced:open-in-respon": {
      if (tab.id) chrome.tabs.sendMessage(tab.id, { kind: "open-in-respon" })
      break
    }
  }
})
