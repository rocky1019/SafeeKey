// Help Modal
const helpModal = document.getElementById("helpModal");
const helpBtn = document.getElementById("helpBtn");
const closeHelpBtn = document.getElementById("closeHelpBtn");

if (helpBtn && helpModal && closeHelpBtn) {
  helpBtn.addEventListener("click", () => helpModal.classList.remove("hidden"));
  closeHelpBtn.addEventListener("click", () => helpModal.classList.add("hidden"));
}

// About Modal
const aboutModal = document.getElementById("aboutModal");
const aboutBtn = document.getElementById("aboutBtn");
const closeAboutBtn = document.getElementById("closeAboutBtn");

if (aboutBtn && aboutModal && closeAboutBtn) {
  aboutBtn.addEventListener("click", () => aboutModal.classList.remove("hidden"));
  closeAboutBtn.addEventListener("click", () => aboutModal.classList.add("hidden"));
}

// New Password Modal
const newPasswordBtn = document.querySelector(".button-group .row button:first-child");
const generateBtn = document.querySelector(".button-group .row button:nth-child(2)");
const exportBtn = document.querySelector(".button-group .row:nth-child(2) button:nth-child(1)");
const lockBtn = document.querySelector(".button-group .row:nth-child(2) button:nth-child(2)");
const searchBtn = document.querySelector(".button-group .row:nth-child(2) button:nth-child(3)");

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveBtn = document.getElementById("saveBtn");

const websiteInput = document.getElementById("websiteInput");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");

const passwordList = document.querySelector("section#passwordList");

let isLocked = false;

// Load passwords on start
window.addEventListener("DOMContentLoaded", loadPasswords);

// Show modal
if (newPasswordBtn && modal && closeModalBtn && saveBtn) {
  newPasswordBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

// Save password
saveBtn.addEventListener("click", savePassword);

function savePassword() {
  const website = websiteInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!website || !username || !password) {
    showNotification("Please fill in all fields.");
    return;
  }

  const entry = { website, username, password };
  localStorage.setItem(`safekey_${website}`, JSON.stringify(entry));

  websiteInput.value = "";
  usernameInput.value = "";
  passwordInput.value = "";

  modal.classList.add("hidden");
  loadPasswords();
  showNotification("✅ Password saved!");
}

function loadPasswords() {
  if (isLocked) return;

  passwordList.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("safekey_")) {
      const entry = JSON.parse(localStorage.getItem(key));

      const div = document.createElement("div");
      div.className = "password-card";
      div.innerHTML = `
  <div class="password-info">
    <div><strong><i class="fas fa-globe"></i> Website:</strong> ${entry.website}</div>
    <div><strong><i class="fas fa-user"></i> Username:</strong> ${entry.username}</div>
    <div><strong><i class="fas fa-lock"></i> Password:</strong> <span class="masked">••••••••</span></div>
  </div>
  <div class="password-actions">
    <button class="copyBtn"><i class="fas fa-copy"></i> Copy</button>
    <button class="showBtn"><i class="fas fa-eye"></i> Show</button>
    <button class="deleteBtn"><i class="fas fa-trash"></i> Delete</button>
  </div>
`;


      div.querySelector(".copyBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(entry.password).then(() => {
          showNotification(`Password copied for ${entry.website}.`);
        });
      });

      const maskedSpan = div.querySelector(".masked");
      div.querySelector(".showBtn").addEventListener("click", () => {
        maskedSpan.textContent =
          maskedSpan.textContent === "••••••••" ? entry.password : "••••••••";
      });

      div.querySelector(".deleteBtn").addEventListener("click", () => {
        if (confirm(`Delete password for ${entry.website}?`)) {
          localStorage.removeItem(key);
          loadPasswords();
          showNotification("Deleted successfully.");
        }
      });

      passwordList.appendChild(div);
    }
  }
}

// Export
if (exportBtn) {
  exportBtn.addEventListener("click", exportPasswords);
}

function exportPasswords() {
  const allPasswords = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("safekey_")) {
      allPasswords[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  const blob = new Blob([JSON.stringify(allPasswords, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "safekey_backup.json";
  a.click();
  URL.revokeObjectURL(url);
  showNotification("✅ Passwords exported!");
}

// Lock
if (lockBtn) {
  lockBtn.addEventListener("click", () => {
    passwordList.innerHTML = "";
    isLocked = true;
    showNotification("🔒 Passwords hidden.");
  });
}

// Unlock button
const unlockBtn = document.createElement("button");
unlockBtn.innerHTML = `<i class="fas fa-unlock"></i> Unlock`;
unlockBtn.style.marginLeft = "10px";
lockBtn.parentElement.appendChild(unlockBtn);


unlockBtn.addEventListener("click", () => {
  isLocked = false;
  loadPasswords();
  showNotification("🔓 Passwords unlocked.");
});

// Search Modal
const searchModal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const searchConfirmBtn = document.getElementById("searchConfirmBtn");
const searchCancelBtn = document.getElementById("searchCancelBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchModal.classList.remove("hidden");
  });
}

searchCancelBtn.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

searchConfirmBtn.addEventListener("click", () => {
  const term = searchInput.value.trim().toLowerCase();
  if (term) {
    const cards = passwordList.querySelectorAll(".password-card");
    let found = false;
    cards.forEach((card) => {
      const websiteText = card
        .querySelector(".password-info div")
        .textContent.toLowerCase();
      if (websiteText.includes(term)) {
        card.style.display = "block";
        found = true;
      } else {
        card.style.display = "none";
      }
    });
    if (!found) {
      showNotification("No matching passwords found.");
    }
    searchModal.classList.add("hidden");
  }
});

// Generate Password
if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    passwordInput.value = generated;
    modal.classList.remove("hidden");
    showNotification("✅ Strong password generated.");
  });
}

// Show Notification Function
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}
