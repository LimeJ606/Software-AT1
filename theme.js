document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle logic
  const button1 = document.getElementById('theme-toggle');
  const button2 = document.getElementById('theme-toggle1'); // 2nd image
  console.log('Button1 element:', button1);
  console.log('Button2 element:', button2);

  if (!button1) {
    console.error('Theme toggle button not found!');
  } else {
    const themes = ['', 'strawberry', 'blueberry'];
    const images = ['image/emptyjar.png', 'image/strawjam.png', 'image/bluejam.png']; // Image filenames
    let currentIndex = 0;

    // Load saved theme and set both images
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.includes(savedTheme)) {
      currentIndex = themes.indexOf(savedTheme);
      const html = document.documentElement;
      if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
      } else {
        html.removeAttribute('data-theme');
      }
      button1.src = images[currentIndex];
      if (button2) button2.src = images[currentIndex]; // Set 2nd image too
      console.log('Loaded saved theme:', savedTheme, 'Image:', images[currentIndex]);
    }

    // Shared click handler for both buttons
    function handleClick() {
      console.log('Button clicked!');
      const html = document.documentElement;
      currentIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[currentIndex];
      const newImage = images[currentIndex];
      console.log('New theme:', newTheme, 'New image:', newImage);
      if (newTheme) {
        html.setAttribute('data-theme', newTheme);
      } else {
        html.removeAttribute('data-theme');
      }
      button1.src = newImage;
      if (button2) button2.src = newImage; // Change 2nd image too
      localStorage.setItem('theme', newTheme);
      console.log('Saved theme to localStorage:', newTheme);
    }

    button1.addEventListener('click', handleClick);
    if (button2) button2.addEventListener('click', handleClick); // Add to 2nd image too
  }

  // Fetch and display data tables (conditional by page)
  const tableContainer = document.getElementById('data-table');
  if (tableContainer) {
    const isSwedishPage = window.location.pathname.includes('SwedishMethod.html');
    const endpoint = isSwedishPage ? '/data2' : '/data';
    const dbName = isSwedishPage ? 'datasource2.db' : 'datasource.db (FAQ)';

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          tableContainer.innerHTML = `<p>Error loading data from ${dbName}: ${data.error}</p>`;
        } else {
          tableContainer.innerHTML = `<h3 class="centre">Typical JAM Session</h3>` + generateTable(data);
        }
      })
      .catch(err => {
        tableContainer.innerHTML = `<p>Error fetching data from ${dbName}: ${err.message}. Ensure the server is running with 'node node.js'.</p>`;
      });
  }

  // Helper function to generate HTML table
  function generateTable(data) {
    if (!data || data.length === 0) return '<p>No data available.</p>';
    const headers = Object.keys(data[0]);
    let table = '<table border="1"><thead><tr>';
    headers.forEach(header => {
      table += `<th>${header}</th>`;
    }); 
    table += '</tr></thead><tbody>';
    data.forEach(row => {
      table += '<tr>';
      headers.forEach(header => {
        table += `<td>${row[header] || ''}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
  }

  // Register service worker for offline caching
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
});