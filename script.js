const farmId = sessionStorage.getItem("farmId");
if (!farmId) {
    window.location.href = "login.html";
}
/// iske uper jo hai vo login k liye hai///

// ===============================
// LIVE DATE & TIME
// ===============================

function updateDateTime() {

    const now = new Date();

    const dateOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    const date = now.toLocaleDateString("en-GB", dateOptions);

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("currentDate").innerHTML = "📅 " + date;
    document.getElementById("currentTime").innerHTML = "🕒 " + time;
}

updateDateTime();

setInterval(updateDateTime,1000);

// ===============================
// LOAD SENSOR DATA
// ===============================

async function loadSensorData() {

    const response = await fetch("data.json");
    const data = await response.json();

    // Farm Information
    document.getElementById("farmerName").innerHTML = data.farmInfo.farmerName;
    document.getElementById("farmId").innerHTML = data.farmInfo.farmId;
    document.getElementById("address").innerHTML = data.farmInfo.address;
    document.getElementById("deviceId").innerHTML = data.farmInfo.deviceId;
    document.getElementById("lastUpdated").innerHTML = data.farmInfo.lastUpdated;

    // Water Quality
    document.getElementById("temperature").innerHTML = data.waterQuality.temperature + " °C";
    document.getElementById("ph").innerHTML = data.waterQuality.ph;
    document.getElementById("do").innerHTML = data.waterQuality.do + " mg/L";
    document.getElementById("tds").innerHTML = data.waterQuality.tds + " mg/L";

    // Device Status
    document.getElementById("battery").innerHTML = data.deviceStatus.battery + "%";
    document.getElementById("espStatus").innerHTML = data.deviceStatus.esp32;
    document.getElementById("cloudStatus").innerHTML = data.deviceStatus.cloud;
    document.getElementById("solarStatus").innerHTML = data.deviceStatus.solar;

    generateAlerts(data.waterQuality);
}

// Load immediately
loadSensorData();

// Reload every 5 seconds
setInterval(loadSensorData, 5000);

// ===============================
// ===============================
// DEMO SENSOR SIMULATION
// ===============================

function updateDemoData() {

    fetch("data.json")
        .then(response => response.json())
        .then(data => {

            // Water Quality
            data.waterQuality.temperature += (Math.random() - 0.5) * 0.8;
            data.waterQuality.ph += (Math.random() - 0.5) * 0.5;
            data.waterQuality.do += (Math.random() - 0.5) * 0.2;
            data.waterQuality.tds += Math.floor((Math.random() - 0.5) * 10);

            document.getElementById("temperature").innerHTML =
                data.waterQuality.temperature.toFixed(1) + " °C";

            document.getElementById("ph").innerHTML =
                data.waterQuality.ph.toFixed(1);

            document.getElementById("do").innerHTML =
                data.waterQuality.do.toFixed(1) + " mg/L";

            document.getElementById("tds").innerHTML =
                Math.round(data.waterQuality.tds) + " mg/L";

            // Battery
            data.deviceStatus.battery += Math.floor((Math.random() - 0.5) * 3);
            data.deviceStatus.battery = Math.max(20, Math.min(100, data.deviceStatus.battery));

            // ESP32 Status
            const espStatus = ["Online", "Offline", "Restarting"];
            data.deviceStatus.esp32 = espStatus[Math.floor(Math.random() * espStatus.length)];

            // Cloud Status
            const cloudStatus = ["Connected", "Disconnected", "Syncing"];
            data.deviceStatus.cloud = cloudStatus[Math.floor(Math.random() * cloudStatus.length)];

            // Solar Status
            const solarStatus = ["Charging", "Idle", "Low Sunlight"];
            data.deviceStatus.solar = solarStatus[Math.floor(Math.random() * solarStatus.length)];

            // Update Dashboard
            document.getElementById("battery").innerHTML = data.deviceStatus.battery + "%";
            document.getElementById("espStatus").innerHTML = data.deviceStatus.esp32;
            document.getElementById("cloudStatus").innerHTML = data.deviceStatus.cloud;
            document.getElementById("solarStatus").innerHTML = data.deviceStatus.solar;

            generateAlerts(data.waterQuality);

        });

}

setInterval(updateDemoData, 3000);

function generateAlerts(data) {

    let alerts = "";

    // ===========================
    // pH
    // ===========================

    if (data.ph < 7.0) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>pH Low (${data.ph.toFixed(2)})</strong>
                <p>Action: Apply agricultural lime (CaCO₃), dolomite and reduce organic load.</p>
            </div>
        </div>`;
    }

    else if (data.ph > 8.5) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>pH High (${data.ph.toFixed(2)})</strong>
                <p>Action: Apply gypsum, add organic manure and perform partial water exchange.</p>
            </div>
        </div>`;
    }

    // ===========================
    // Dissolved Oxygen
    // ===========================

    if (data.do < 5) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Dissolved Oxygen Low (${data.do.toFixed(1)} mg/L)</strong>
                <p>Action: Start aeration, reduce feeding & stocking density and exchange water.</p>
            </div>
        </div>`;
    }

    else if (data.do > 8) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Dissolved Oxygen High (${data.do.toFixed(1)} mg/L)</strong>
                <p>Action: Monitor for gas supersaturation.</p>
            </div>
        </div>`;
    }

    // ===========================
    // Temperature
    // ===========================

    if (data.temperature < 24) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Temperature Low (${data.temperature.toFixed(1)}°C)</strong>
                <p>Action: Reduce feeding and maintain deeper water.</p>
            </div>
        </div>`;
    }

    else if (data.temperature > 32) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Temperature High (${data.temperature.toFixed(1)}°C)</strong>
                <p>Action: Increase aeration, maintain water depth, provide shading and exchange water.</p>
            </div>
        </div>`;
    }

    // ===========================
    // TDS
    // ===========================

    if (data.tds < 50) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>TDS Low (${Math.round(data.tds)} mg/L)</strong>
                <p>Action: Add fertilizers and check alkalinity & hardness.</p>
            </div>
        </div>`;
    }

    else if (data.tds > 400) {
        alerts += `
        <div class="alert-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>TDS High (${Math.round(data.tds)} mg/L)</strong>
                <p>Action: Dilute through water exchange, avoid runoff contamination and check alkalinity.</p>
            </div>
        </div>`;
    }

    // ===========================
    // All Normal
    // ===========================

    if (alerts === "") {

        alerts = `
        <div class="alert-item">
            <i class="fa-solid fa-circle-check"></i>
            <div>
                <strong>Water Quality Normal</strong>
                <p>All parameters are within the optimum range.</p>
            </div>
        </div>`;
    }

    document.getElementById("alertsContainer").innerHTML = alerts;

}

///Here we will be plotting the graphs for the water quality parameters using Chart.js///

/* ==========================================================
        WATER QUALITY CHART ENGINE
========================================================== */

Chart.register(ChartDataLabels);

const timeLabels = [
    "01 AM","03 AM","05 AM","07 AM",
    "09 AM","11 AM","01 PM","03 PM",
    "05 PM","07 PM","09 PM","11 PM"
];

/* -----------------------------
   Demo Data
------------------------------*/

const temperatureData=[26.2,26.5,27.1,28.0,29.1,31.0,33.2,34.0,32.4,29.5,28.6,28.4];

const phData=[7.3,7.4,7.4,7.5,7.6,7.8,8.2,8.6,8.3,7.8,7.5,7.4];

const tdsData=[260,275,290,315,350,390,430,470,420,360,310,295];

const doData=[6.3,6.2,6.1,6.0,6.2,6.5,6.8,6.9,6.8,6.7,6.6,6.5];


/* ==========================================================
        CREATE SENSOR CHART
========================================================== */

function createSensorChart(config){

    return new Chart(

        document.getElementById(config.id),

        {

            type:"line",

            data:{

                labels:timeLabels,

                datasets:[

                    {

    label: config.id,

    data: config.data,

    borderWidth: 3,

    tension: 0.4,

    fill: false,

    pointRadius: 6,

    pointHoverRadius: 8,

    pointBorderWidth: 2,

    pointBorderColor: (ctx) => {

        const value = ctx.raw;

        if (value > config.upper || value < config.lower)
            return "#ef4444";

        return "#22c55e";
    },

    pointBackgroundColor: (ctx) => {

        const value = ctx.raw;

        if (value > config.upper || value < config.lower)
            return "#ef4444";

        return "#22c55e";
    },

    segment: {

        borderColor: (ctx) => {

            const y1 = ctx.p0.parsed.y;
            const y2 = ctx.p1.parsed.y;

            if (
                y1 > config.upper ||
                y2 > config.upper ||
                y1 < config.lower ||
                y2 < config.lower
            ) {

                return "#ef4444";

            }

            return "#22c55e";

        }

    }

},

                    {

    label:"Upper Limit",

    data:new Array(12).fill(config.upper),

    borderColor:"#ef4444",

    borderDash:[8,6],

    borderWidth:2,

    pointRadius:0,

    datalabels:{

        align:"right",

        anchor:"end",

        color:"#ef4444",

        formatter:(value,ctx)=>{

            if(ctx.dataIndex===11){

                return "Upper";

            }

            return "";

        }

    }

},

                    {

    label:"Lower Limit",

    data:new Array(12).fill(config.lower),

    borderColor:"#2563eb",

    borderDash:[8,6],

    borderWidth:2,

    pointRadius:0,

    datalabels:{

        align:"right",

        anchor:"end",

        color:"#2563eb",

        formatter:(value,ctx)=>{

            if(ctx.dataIndex===11){

                return "Lower";

            }

            return "";

        }

    }

}

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

    legend:{
        display:false
    },

    tooltip:{

        backgroundColor:"#1f2937",

        titleColor:"#fff",

        bodyColor:"#fff",

        padding:12,

        cornerRadius:10,

        displayColors:false,

        callbacks:{

            title:(items)=>{

                return "Time : " + items[0].label;

            },

            label:(item)=>{

                return config.title + " : " + item.raw + " " + config.unit;

            }

        }

    },

    datalabels:{

                        color:"#444",

                        anchor:"end",

                        align:"top",

                        font:{
                            size:11,
                            weight:"bold"
                        },

                        formatter:(value,ctx)=>{

                            if(ctx.datasetIndex===0)
                                return value;

                            return "";
                        }

                    }

                },

                scales:{

    x:{

        grid:{
            color:"#eef2f7"
        },

        ticks:{
            color:"#555",
            font:{
                size:11,
                weight:"600"
            }
        }

    },

    y:{

        suggestedMin: config.lower - config.step,

        suggestedMax: config.max + config.step,

        grid:{
            color:"#eef2f7"
        },

        ticks:{
            stepSize:config.step,
            color:"#555",
            font:{
                size:11,
                weight:"600"
            }
        }

    }

},
animation:{

    duration:1500,

    easing:"easeInOutQuart"

},

            },

            plugins:[ChartDataLabels]

        }

    );

}


/// $$$$$$$$$$$$$///


createSensorChart({
    id:"temperatureChart",
    title:"Temperature",
    unit:"°C",
    data:temperatureData,
    lower:24,
    upper:32,
    max:35,
    step:1
});

createSensorChart({
    id:"phChart",
    title:"pH",
    unit:"",
    data:phData,
    lower:7,
    upper:8.5,
    max:9,
    step:0.5
});

createSensorChart({
    id:"tdsChart",
    title:"TDS",
    unit:"mg/L",
    data:tdsData,
    lower:50,
    upper:400,
    max:500,
    step:50
});

createSensorChart({
    id:"doChart",
    title:"Dissolved Oxygen",
    unit:"mg/L",
    data:doData,
    lower:5,
    upper:8,
    max:10,
    step:1
});


/// yahan se login and logout ka function hai///

function logout() {

    sessionStorage.removeItem("farmId");

    window.location.href = "login.html";

}