let quotes = [];

const defaultQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Dreams",
  },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  {
    text: "Some Quote was said by the sayer of quotes - Quote Sayer",
    category: "anime",
  },
  {
    text: "There's no shame in falling down! True shame is to not stand up again! - Shintaro Midorima in Kuroko's Basketball",
    category: "anime",
  },
  {
    text: "Fear is not evil. It tells you what weakness is. And once you know your weakness, you can become stronger as well as kinder. - Gildarts Clive in Fairy Tail",
    category: "anime",
  },
  {
    text: "“If you don’t take risks, you can’t create a future.”—Monkey D. Luffy, One Piece",
    category: "anime",
  },
  {
    text: "“The strong should aid and protect the weak. Then, the weak will become strong, and they in turn will aid and protect those weaker than them. That is the law of nature.”—Tanjiro Kamado, Demon Slayer",
    category: "anime",
  },
  {
    text: "“Hard work is worthless for those that don’t believe in themselves.”—Naruto Uzumaki, Naruto",
    category: "anime",
  },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    // Task 1: Use JSON.parse to convert string back to array
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = defaultQuotes;
    // Save defaults to storage immediately
    saveQuotes();
  }
  // Load last filter setting from session storage (Task 1: Optional)
  const lastFilter = sessionStorage.getItem("lastFilterCategory");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  // Determine which quotes to pick from based on the current filter
  const filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML =
      "<p>No quotes available for the selected category.</p>";
    return;
  }

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // Task 0: Advanced DOM Manipulation
  // Clear previous content
  quoteDisplay.innerHTML = "";

  // Create and append elements
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontSize = "1.2em";

  const quoteCategory = document.createElement("footer");
  quoteCategory.textContent = `Category: ${quote.category}`;
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.marginTop = "10px";

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Task 1: Demonstrate Session Storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory,
  };

  quotes.push(newQuote); // Update array
  saveQuotes(); // Task 1: Save to local storage

  // Update UI elements
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function addQuote() {
  populateCategories();
  showRandomQuote();
  alert("Quote added successfully!");
}

function populateCategories() {
  // Get unique categories
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  // Clear existing options, but keep the 'All Categories' option
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new category options dynamically
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected value
  const lastFilter = sessionStorage.getItem("lastFilterCategory") || "all";
  categoryFilter.value = lastFilter;
}

function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "all") {
    return quotes;
  } else {
    return quotes.filter((quote) => quote.category === selectedCategory);
  }
}

function filterQuotes() {
  // Task 2: Remember the Last Selected Filter
  const selectedCategory = categoryFilter.value;
  sessionStorage.setItem("lastFilterCategory", selectedCategory);

  // Show a random quote from the filtered list
  showRandomQuote();
}

function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for nice formatting
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  // Task 1: Use URL.createObjectURL to create a download link
  const url = URL.createObjectURL(dataBlob);

  // Create a temporary link element for downloading
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes_export.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL object
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      // Task 1: Parse the JSON string from the file
      const importedQuotes = JSON.parse(event.target.result);

      // Basic validation (optional but good practice)
      if (
        !Array.isArray(importedQuotes) ||
        importedQuotes.some((q) => !q.text || !q.category)
      ) {
        throw new Error(
          "Invalid JSON format. Expected an array of quote objects."
        );
      }

      // Add imported quotes to the existing array
      quotes.push(...importedQuotes);

      saveQuotes(); // Task 1: Save updated list to local storage
      populateCategories(); // Update category filter
      showRandomQuote(); // Refresh display

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing file: " + error.message);
    }
  };

  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]);
}

const MOCK_SERVER_DATA = [
  {
    text: "Server: Success is not final, failure is not fatal.",
    category: "Motivation",
  },
  {
    text: "Server: The only limit to our realization of tomorrow will be our doubts of today.",
    category: "Motivation",
  },
];

function fetchQuotesFromServer() {
  return MOCK_SERVER_DATA;
}

function syncWithServer() {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = "Syncing...";

  // --- Step 1: Simulate Server Interaction (a simple delay) ---
  setTimeout(() => {
    // --- Step 2 & 3: Conflict Resolution & Data Syncing ---

    // Use a Set to track all existing quote texts for easy comparison
    const localQuoteTexts = new Set(quotes.map((q) => q.text));
    let newQuotesAdded = 0;

    fetchQuotesFromServer().forEach((serverQuote) => {
      // Simple Conflict Resolution Strategy: If the server has a quote we don't, add it.
      // (Assuming identical text means the same quote, ignoring minor category changes)
      if (!localQuoteTexts.has(serverQuote.text)) {
        quotes.push(serverQuote);
        newQuotesAdded++;
      }
      // A more complex resolution (Task 3: Step 3) would involve checking timestamps/IDs
      // and asking the user which version to keep, but we use the simple server-precedence.
    });

    // Finalize sync
    saveQuotes(); // Save the merged data
    populateCategories(); // Update UI
    showRandomQuote(); // Refresh display

    if (newQuotesAdded > 0) {
      syncStatus.textContent = `Sync Complete: ${newQuotesAdded} new quote(s) merged from server.`;
    } else {
      syncStatus.textContent =
        "Sync Complete: Local data was already up to date with the server.";
    }
  }, 1500); // Simulate network latency of 1.5 seconds
}

newQuoteButton.addEventListener("click", showRandomQuote);

function initializeApp() {
  loadQuotes();
  populateCategories();
  filterQuotes();
}

initializeApp();
