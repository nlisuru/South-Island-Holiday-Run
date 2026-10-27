"use strict";

/* 
   ================================SOUTH ISLAND HOLIDAY RUN =========================
   Read in order: data → DOM selections → functions → events.
   */

// REQUIREMENT: declare variables with const and let.

// const is used when the reference should not be reassigned.

const destinations = [
  {
    id: "aoraki",
    name: "Aoraki / Mount Cook",
    region: "Canterbury",
    category: "alpine",
    categoryLabel: "Alpine",
    stay: "Suggested stay · 1–2 days",
    description:
      "Alpine trails, glacier-fed lakes and big night skies around New Zealand’s highest peak.",
    image: "aoraki-hooker-valley.webp",
    imageAlt:
      "Walkers cross a suspension bridge below snowy mountains on the Hooker Valley Track",
  },
  {
    id: "queenstown",
    name: "Queenstown",
    region: "Otago",
    category: "adventure",
    categoryLabel: "Adventure",
    stay: "Suggested stay · 2–3 days",
    description:
      "A lively base on Lake Whakatipu for lake cruises, walks, biking and adventure activities.",
    image: "queenstown-lake-wakatipu.webp",
    imageAlt: "Queenstown lights reflect on Lake Wakatipu at dusk",
  },
  {
    id: "wanaka",
    name: "Wānaka",
    region: "Otago",
    category: "alpine",
    categoryLabel: "Alpine",
    stay: "Suggested stay · 1–2 days",
    description:
      "Slow down beside the lake, then choose from viewpoints, cycle trails and nearby national-park walks.",
    image: "wanaka.webp",
    imageAlt:
      "A walker looks across Lake Wānaka towards snow-covered mountains",
  },
  {
    id: "milford",
    name: "Milford Sound / Piopiotahi",
    region: "Fiordland",
    category: "coast",
    categoryLabel: "Fiord",
    stay: "Suggested stay · Te Anau base",
    description:
      "Sheer cliffs, dark water and waterfalls in Fiordland. Stay in Te Anau and check conditions before the drive.",
    image: "milford-sound.webp",
    imageAlt: "Steep mountains rise above the calm blue water of Milford Sound",
  },
  {
    id: "kaikoura",
    name: "Kaikōura",
    region: "Canterbury",
    category: "coast",
    categoryLabel: "Coast",
    stay: "Suggested stay · 1–2 days",
    description:
      "A dramatic meeting of mountains and ocean, known for marine wildlife and coastal walks.",
    image: "kaikoura.webp",
    imageAlt:
      "The Kaikōura peninsula and blue sea sit below a snowy mountain range",
  },
  {
    id: "abel-tasman",
    name: "Abel Tasman",
    region: "Nelson Tasman",
    category: "coast",
    categoryLabel: "Coast",
    stay: "Suggested stay · 2–3 days",
    description:
      "Golden beaches, clear bays and coastal track sections at the top of the South Island.",
    image: "abel-tasman.webp",
    imageAlt:
      "Golden sand and clear blue water curve around a forested headland in Abel Tasman",
  },
];

// let is used because these values change when the user interacts.

let currentFilter = "all";
let shortlist = [];
let scrollTicking = false;

// select HTML elements with getElementById/querySelector.

const destinationGrid = document.getElementById("destination-grid");
const filterSummary = document.getElementById("filter-summary");
const filterButtons = document.querySelectorAll(".filter-button");
const shortlistCount = document.getElementById("shortlist-count");
const shortlistLabel = document.getElementById("shortlist-label");
const shortlistMessage = document.getElementById("shortlist-message");
const shortlistList = document.getElementById("shortlist-list");
const clearRouteButton = document.getElementById("clear-route");
const heroImage = document.getElementById("hero-image");

//  use functions to organise reusable actions.

function findDestinationById(destinationId) {
  // Loop checks each item in the array.

  for (let index = 0; index < destinations.length; index++) {
    if (destinations[index].id === destinationId) {
      return destinations[index];
    }
  }
  return null;
}

function isShortlisted(destinationId) {
  return shortlist.includes(destinationId);
}

function updateShortlistButton(button, destinationId) {
  const destination = findDestinationById(destinationId);
  const added = isShortlisted(destinationId);

  // DOM methods change the button's text, style state and ARIA attribute.

  button.setAttribute("aria-pressed", String(added));
  button.textContent = added ? "Added to route · Remove" : "+ Add to route";

  if (destination !== null) {
    const action = added ? "Remove" : "Add";
    button.setAttribute(
      "aria-label",
      `${action} ${destination.name} ${added ? "from" : "to"} your route`,
    );
  }
}

function createDestinationCard(destination) {
  const card = document.createElement("article");
  card.className = "destination-card";
  card.setAttribute("aria-labelledby", `title-${destination.id}`);

  card.innerHTML = `
    <div class="destination-image-wrap">
      <img class="destination-image" src="${destination.image}" alt="${destination.imageAlt}" loading="lazy">
    </div>
    <p class="destination-region">${destination.region} · ${destination.categoryLabel}</p>
    <h3 class="destination-title" id="title-${destination.id}">${destination.name}</h3>
    <p class="destination-description">${destination.description}</p>
    <p class="destination-meta">${destination.stay}</p>
    <button class="add-stop-button" type="button" data-id="${destination.id}" aria-pressed="false"></button>
  `;

  const addButton = card.querySelector(".add-stop-button");
  updateShortlistButton(addButton, destination.id);

  //  an event runs a function when this button is clicked.

  addButton.addEventListener("click", handleShortlistClick);
  return card;
}

function renderDestinations(filter) {
  destinationGrid.innerHTML = "";
  let visibleCount = 0;

  //  Loop through data and use comparative operators.

  for (let index = 0; index < destinations.length; index++) {
    const destination = destinations[index];

    if (filter === "all" || destination.category === filter) {
      const card = createDestinationCard(destination);
      destinationGrid.appendChild(card);
      visibleCount++; // Arithmetic operator: add 1 to the visible total.
    }
  }

  filterSummary.textContent = `Showing ${visibleCount} of ${destinations.length} places.`;
}

function handleShortlistClick(event) {
  const clickedButton = event.currentTarget;
  const destinationId = clickedButton.dataset.id;
  const existingIndex = shortlist.indexOf(destinationId);

  if (existingIndex === -1) {
    shortlist.push(destinationId);
  } else {
    shortlist.splice(existingIndex, 1);
  }

  updateShortlistButton(clickedButton, destinationId);
  renderShortlist();
}

function renderShortlist() {
  shortlistCount.textContent = shortlist.length;
  shortlistLabel.textContent =
    shortlist.length === 1 ? "stop selected" : "stops selected";
  shortlistList.innerHTML = "";
  clearRouteButton.disabled = shortlist.length === 0;

  if (shortlist.length === 0) {
    shortlistMessage.textContent =
      "No places saved yet. Add a stop above to begin.";
  } else {
    shortlistMessage.textContent = "Your stops, in the order you added them:";
  }

  // This loop rebuilds the visible shortlist after every change.

  for (let index = 0; index < shortlist.length; index++) {
    const destination = findDestinationById(shortlist[index]);

    if (destination !== null) {
      const stopNumber = index + 1; // Arithmetic operator: make a 1-based stop number.
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span>${String(stopNumber).padStart(2, "0")}</span>
        <div><strong>${destination.name}</strong><small>${destination.stay}</small></div>
      `;
      shortlistList.appendChild(listItem);
    }
  }
}

function setActiveFilterButton(selectedButton) {
  for (let index = 0; index < filterButtons.length; index++) {
    const isSelected = filterButtons[index] === selectedButton;
    filterButtons[index].classList.toggle("is-active", isSelected);
    filterButtons[index].setAttribute("aria-pressed", String(isSelected));
  }
}

// A small, requestAnimationFrame-based parallax effect for the hero photo.

function updateHeroParallax() {
  const movement = window.scrollY * 0.08; // Arithmetic operator: control movement speed.
  heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.08)`;
  scrollTicking = false;
}

function requestHeroUpdate() {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeroParallax);
    scrollTicking = true;
  }
}

// addEventListener responds to user and browser events.

for (let index = 0; index < filterButtons.length; index++) {
  filterButtons[index].addEventListener("click", function (event) {
    currentFilter = event.currentTarget.dataset.filter;
    setActiveFilterButton(event.currentTarget);
    renderDestinations(currentFilter);
  });
}

clearRouteButton.addEventListener("click", function () {
  shortlist = [];
  renderShortlist();
  renderDestinations(currentFilter);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches) {
  window.addEventListener("scroll", requestHeroUpdate, { passive: true });
}

// Initial page setup: display content and the current year.

renderDestinations(currentFilter);
renderShortlist();
document.getElementById("current-year").textContent = new Date().getFullYear();
