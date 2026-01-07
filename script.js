const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Put your key here

// Get weather from OpenWeather
async function getWeather() {
  try {
    const res = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${WEATHER_API_KEY}&units=metric');
    const data = await res.json();
    return data.weather[0].main.toLowerCase().includes("rain");
  } catch {
    return false; // fallback if API fails
  }
}

// Traffic AI detection
function getTrafficAI() {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) return "high";
  else if (hour >= 11 && hour <= 16) return "medium";
  else return "low";
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Calculate Fare
async function calculateFare() {
  const weightInput = document.getElementById("weight");
  const resultDiv = document.getElementById("result");
  const weight = Number(weightInput.value);

  if (!weight) return alert("Enter weight");

  // 1️⃣ Show AI analyzing immediately
  resultDiv.innerHTML = "🤖 AI analyzing...";
  resultDiv.classList.remove("show");
  resultDiv.classList.add("show");

  // 2️⃣ Wait 3 seconds before showing result
  await delay(3000);

  // 3️⃣ Get weather & traffic AFTER delay
  const rain = await getWeather();
  const traffic = getTrafficAI();

  // 4️⃣ Calculate fare
  let fare = 50 + weight * 2;
  if (rain) fare += 20;
  if (traffic === "medium") fare += 15;
  if (traffic === "high") fare += 30;

  const badge =
    fare < 80 ? "🟢 Low Fare" :
    fare < 120 ? "🟡 Medium Fare" :
    "🔴 High Fare";

  // 5️⃣ Show final result
  resultDiv.innerHTML =
    `🌦 Weather: ${rain ? "Rain" : "Clear"}<br>
     🚦 Traffic: ${traffic.toUpperCase()}<br>
     💰 Fare: ₹${fare}<br>${badge}`;

  // Save values to localStorage
  localStorage.setItem("weight", weight);
  localStorage.setItem("rain", rain);
  localStorage.setItem("traffic", traffic);
  localStorage.setItem("fare", fare);

  // Draw chart
  drawChart(weight, rain, traffic, fare);
}

// Chart.js function
function drawChart(weight, rain, traffic, fare) {
  const ctx = document.getElementById("fareChart").getContext("2d");
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Base", "Weight", "Rain", "Traffic", "Total"],
      datasets: [{
        data: [
          50,
          weight*2,
          rain ? 20 : 0,
          traffic==="high" ? 30 : traffic==="medium" ? 15 : 0,
          fare
        ],
        backgroundColor: ["#3498db","#2ecc71","#95a5a6","#f39c12","#e74c3c"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

// Auto-fill weight after refresh
window.addEventListener("load", () => {
  const weight = localStorage.getItem("weight");
  if (weight) document.getElementById("weight").value = weight;
});