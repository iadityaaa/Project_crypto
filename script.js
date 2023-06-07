document.addEventListener('DOMContentLoaded', () => {
  const tickersContainer = document.getElementById('tickers-container');

  fetch('http://localhost:3000/api/tickers')
    .then(response => response.text()) // Fetch the response as plain text
    .then(data => {
      // Split the data by new line to get each ticker as a separate string
      const tickers = data.split('\n');

      // Loop through the tickers and create HTML elements to display the data
      tickers.forEach((tickerString, index) => {
        // Split each ticker string by comma to get individual values
        const tickerValues = tickerString.split(',');
        //tickerValues = tickerValues.slice(10);

        const tickerElement = document.createElement('div');
        tickerElement.classList.add('ticker-card');
        tickerElement.innerHTML = `
          <p>${index+1}</p>
          <p>${tickerValues[0]}</p>
          <p>₹${tickerValues[1].slice(0,11)}</p>
          <p>₹${tickerValues[2].slice(0,11)}</p>
          <p>₹${tickerValues[3].slice(0,11)}</p>
          <p>₹${tickerValues[4].slice(0,11)}</p>
          <p>₹${tickerValues[5].slice(0,11)}</p>
        `;
        tickersContainer.appendChild(tickerElement);
      });
    })
    .catch(error => {
      console.error('Error fetching tickers:', error);
    });
});

//dark/light mode toggler
document.addEventListener('DOMContentLoaded', () => {
  const modeToggle = document.getElementById('mode-toggle');
  const body = document.querySelector('body');

  modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
  });
});
