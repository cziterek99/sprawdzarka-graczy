let searchCount = 0;
let onlineUsers = Math.floor(Math.random() * 11) + 5;
let foundIP = ""; // zapamiętuje IP do kopiowania
let cooldownKey = "searchCooldownUntil"; // klucz do localStorage

// Sprawdzenie cooldownu przy ładowaniu strony
let cooldownUntil = localStorage.getItem(cooldownKey);
let searchCooldown = false;

if (cooldownUntil && Date.now() < cooldownUntil) {
  searchCooldown = true;
  let remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
  updateCooldownMessage(remaining);
  let interval = setInterval(() => {
    remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
    if (remaining <= 0) {
      clearInterval(interval);
      searchCooldown = false;
      document.getElementById("result").textContent = "Możesz ponownie wyszukać gracza.";
      localStorage.removeItem(cooldownKey);
    } else {
      updateCooldownMessage(remaining);
    }
  }, 1000);
}

function updateCooldownMessage(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  document.getElementById("result").innerHTML = `<span class="cooldown-message">Odczekaj ${min} min ${sec} sek przed kolejnym wyszukiwaniem!</span>`;
}

document.getElementById("searchBtn").addEventListener("click", () => {
  if (searchCooldown) {
    return;
  }

  const nick = document.getElementById("searchInput").value.trim();
  const result = document.getElementById("result");
  const copyBtn = document.getElementById("copyBtn");

  searchCount++;
  document.getElementById("searchCount").textContent = searchCount;

  if (ignoredPlayers.includes(nick)) {
    result.textContent = "Gracz został zignorowany.";
    copyBtn.style.display = "none";
  } else if (playerData[nick]) {
    foundIP = playerData[nick];
    result.textContent = `IP gracza ${nick}: ${foundIP}`;
    copyBtn.style.display = "inline-block";

    // Pokaż modal z IP
    document.getElementById("ipContent").textContent = foundIP;
    document.getElementById("ipModal").style.display = "block";
  } else {
    result.textContent = "Gracz nie został znaleziony.";
    copyBtn.style.display = "none";
  }

  // Ustaw cooldown na 5 minut (300000 ms)
  searchCooldown = true;
  let until = Date.now() + 300000;
  localStorage.setItem(cooldownKey, until);
  updateCooldownMessage(300);

  let interval = setInterval(() => {
    let remaining = Math.ceil((until - Date.now()) / 1000);
    if (remaining <= 0) {
      clearInterval(interval);
      searchCooldown = false;
      document.getElementById("result").textContent = "Możesz ponownie wyszukać gracza.";
      localStorage.removeItem(cooldownKey);
    } else {
      updateCooldownMessage(remaining);
    }
  }, 1000);
});

// Kopiuj z przycisku pod okienkiem i przy głównym
document.getElementById("copyBtn").addEventListener("click", () => {
  if (foundIP) {
    navigator.clipboard.writeText(foundIP).then(() => {
      alert("Skopiowano IP do schowka!");
    });
  }
});

document.getElementById("copyIpBtn").addEventListener("click", () => {
  if (foundIP) {
    navigator.clipboard.writeText(foundIP).then(() => {
      alert("Skopiowano IP do schowka!");
    });
  }
});

// Zamknięcie modala z IP
document.getElementById("ipClose").onclick = () => {
  document.getElementById("ipModal").style.display = "none";
  document.getElementById("copyBtn").textContent = `Skopiuj IP: ${foundIP}`;
};

// Liczba online (symulowana)
function updateOnlineUsers() {
  onlineUsers = Math.floor(Math.random() * 11) + 5;
  document.getElementById("onlineUsers").textContent = onlineUsers;
}
updateOnlineUsers();
setInterval(updateOnlineUsers, 5000);

// Admin + Kontakt
const adminBtn = document.getElementById("adminBtn");
const contactBtn = document.getElementById("contactBtn");
const adminModal = document.getElementById("adminModal");
const contactModal = document.getElementById("contactModal");
const adminClose = document.getElementById("adminClose");
const contactClose = document.getElementById("contactClose");

adminBtn.onclick = () => adminModal.style.display = "block";
contactBtn.onclick = () => contactModal.style.display = "block";
adminClose.onclick = () => adminModal.style.display = "none";
contactClose.onclick = () => contactModal.style.display = "none";
window.onclick = e => {
  if (e.target == adminModal) adminModal.style.display = "none";
  if (e.target == contactModal) contactModal.style.display = "none";
};

// Logowanie do admina
document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;
  if (user === "admin" && pass === "admin123") {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    updatePlayerList();
  } else {
    alert("Błędne dane logowania.");
  }
};

function updatePlayerList() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  for (let nick in playerData) {
    if (!ignoredPlayers.includes(nick)) {
      const li = document.createElement("li");
      li.textContent = `${nick}: ${playerData[nick]} `;
      const delBtn = document.createElement("button");
      delBtn.textContent = "Ignoruj";
      delBtn.onclick = () => {
        ignoredPlayers.push(nick);
        updatePlayerList();
        alert(`Dodano ${nick} do listy ignorowanych. Pamiętaj, aby zaktualizować ignoredPlayers.js!`);
      };
      li.appendChild(delBtn);
      list.appendChild(li);
    }
  }
}

function updateCooldownMessage(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  const result = document.getElementById("result");
  result.innerHTML = `<span style="color: #ff6ec4; font-weight: bold; text-shadow: 0 0 10px #7873f5;">Odczekaj ${min} min ${sec} sek przed kolejnym wyszukiwaniem!</span>`;
}
