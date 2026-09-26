// ============================================================
// LOGIN PROTECTION
// ============================================================

const farmId = sessionStorage.getItem("farmId");

if (!farmId) {
    window.location.href = "login.html";
}


// ============================================================
// LIVE DATE & TIME
// ============================================================

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

    document.getElementById("currentDate").innerHTML =
        "📅 " + date;

    document.getElementById("currentTime").innerHTML =
        "🕒 " + time;
}

updateDateTime();

setInterval(updateDateTime, 1000);


// ============================================================
// FIREBASE
// ============================================================

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const database = window.firebaseDatabase;


// ============================================================
// LIVE FARM DATA
// ============================================================

const farmDataRef = ref(database, "farmData");


// ============================================================
// RECEIVE REALTIME FARM DATA
// ============================================================

onValue(farmDataRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) {
        console.log("No data found in Firebase.");
        return;
    }

    console.log("Firebase Live Data:", data);


    // ========================================================
    // FARM INFORMATION
    // ========================================================

    if (data.farmInfo) {

        document.getElementById("farmerName").innerHTML =
            data.farmInfo.farmerName || "--";

        document.getElementById("farmId").innerHTML =
            data.farmInfo.farmId || "--";

        document.getElementById("address").innerHTML =
            data.farmInfo.address || "--";

        document.getElementById("deviceId").innerHTML =
            data.farmInfo.deviceId || "--";

        document.getElementById("lastUpdated").innerHTML =
            data.farmInfo.lastUpdated || "--";
    }


    // ========================================================
    // LIVE WATER QUALITY
    // ========================================================

    if (data.waterQuality) {

        const water = data.waterQuality;


        // -------------------------
        // Temperature
        // -------------------------

        if (water.temperature !== undefined) {

            document.getElementById("temperature").innerHTML =
                Number(water.temperature).toFixed(1) + " °C";
        }


        // -------------------------
        // pH
        // -------------------------

        if (water.ph !== undefined) {

            document.getElementById("ph").innerHTML =
                Number(water.ph).toFixed(1);
        }


        // -------------------------
        // Dissolved Oxygen
        // -------------------------

        if (water.do !== undefined) {

            document.getElementById("do").innerHTML =
                Number(water.do).toFixed(1) + " mg/L";
        }


        // -------------------------
        // Electrical Conductivity
        // -------------------------

        if (water.ec !== undefined) {

            const ecElement =
                document.getElementById("EC");

            if (ecElement) {

                ecElement.innerHTML =
                    Math.round(Number(water.ec)) +
                    " µS/cm";
            }
        }


        // Generate alerts
        generateAlerts(water);
    }


    // ========================================================
    // DEVICE STATUS
    // ========================================================

    if (data.deviceStatus) {

        const device = data.deviceStatus;


        if (device.battery !== undefined) {

            document.getElementById("battery").innerHTML =
                device.battery + "%";
        }


        if (device.esp32 !== undefined) {

            document.getElementById("espStatus").innerHTML =
                device.esp32;
        }


        if (device.cloud !== undefined) {

            document.getElementById("cloudStatus").innerHTML =
                device.cloud;
        }


        if (device.solar !== undefined) {

            document.getElementById("solarStatus").innerHTML =
                device.solar;
        }
    }

});


// ============================================================
// FIREBASE CONNECTION TEST
// ============================================================

console.log("Firebase Realtime Database connected.");


// ============================================================
// ALERT SYSTEM
// ============================================================

function generateAlerts(data) {

    let alerts = "";


    // ========================================================
    // pH
    // ========================================================

    if (data.ph !== undefined) {

        if (data.ph < 7.0) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        pH Low (${Number(data.ph).toFixed(2)})
                    </strong>

                    <p>
                        Action: Apply agricultural lime (CaCO₃),
                        dolomite and reduce organic load.
                    </p>

                </div>

            </div>`;
        }

        else if (data.ph > 8.5) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        pH High (${Number(data.ph).toFixed(2)})
                    </strong>

                    <p>
                        Action: Apply gypsum, add organic manure
                        and perform partial water exchange.
                    </p>

                </div>

            </div>`;
        }
    }


    // ========================================================
    // DISSOLVED OXYGEN
    // ========================================================

    if (data.do !== undefined) {

        if (data.do < 5) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        Dissolved Oxygen Low
                        (${Number(data.do).toFixed(1)} mg/L)
                    </strong>

                    <p>
                        Action: Start aeration, reduce feeding
                        & stocking density and exchange water.
                    </p>

                </div>

            </div>`;
        }

        else if (data.do > 8) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        Dissolved Oxygen High
                        (${Number(data.do).toFixed(1)} mg/L)
                    </strong>

                    <p>
                        Action: Monitor for gas supersaturation.
                    </p>

                </div>

            </div>`;
        }
    }


    // ========================================================
    // TEMPERATURE
    // ========================================================

    if (data.temperature !== undefined) {

        if (data.temperature < 24) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        Temperature Low
                        (${Number(data.temperature).toFixed(1)}°C)
                    </strong>

                    <p>
                        Action: Reduce feeding and maintain
                        deeper water.
                    </p>

                </div>

            </div>`;
        }

        else if (data.temperature > 32) {

            alerts += `
            <div class="alert-item">

                <i class="fa-solid fa-circle-exclamation"></i>

                <div>

                    <strong>
                        Temperature High
                        (${Number(data.temperature).toFixed(1)}°C)
                    </strong>

                    <p>
                        Action: Increase aeration, maintain water
                        depth, provide shading and exchange water.
                    </p>

                </div>

            </div>`;
        }
    }


    // ========================================================
    // ALL NORMAL
    // ========================================================

    if (alerts === "") {

        alerts = `
        <div class="alert-item">

            <i class="fa-solid fa-circle-check"></i>

            <div>

                <strong>
                    Water Quality Normal
                </strong>

                <p>
                    All parameters are within the optimum range.
                </p>

            </div>

        </div>`;
    }


    document.getElementById("alertsContainer").innerHTML =
        alerts;
}


// ============================================================
// ============================================================
// WATER QUALITY ANALYTICS
// ============================================================
// ============================================================


// Firebase history reference

const historyRef = ref(database, "waterHistory");


// ============================================================
// CHART VARIABLES
// ============================================================

let temperatureChart = null;
let phChart = null;
let ecChart = null;
let doChart = null;


// ============================================================
// HOURS
// ============================================================

const hours = [

    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
];


// Display labels

const displayHours = [

    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM"
];


// ============================================================
// GET LAST 7 DATES
// ============================================================

function getPreviousSevenDates() {

    const dates = [];

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // Previous 7 completed days

    for (let i = 7; i >= 1; i--) {

        const date = new Date(today);

        date.setDate(today.getDate() - i);

        dates.push(
            formatDate(date)
        );
    }

    return dates;
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ============================================================
// LINEAR REGRESSION
// ============================================================

function linearRegression(values) {

    if (!values || values.length === 0) {
        return null;
    }

    if (values.length === 1) {
        return values[0];
    }


    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < values.length; i++) {

        const x = i;
        const y = Number(values[i]);

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }


    const n = values.length;


    const denominator =
        (n * sumXX) -
        (sumX * sumX);


    if (denominator === 0) {

        return values[values.length - 1];
    }


    const slope =
        ((n * sumXY) -
        (sumX * sumY)) /
        denominator;


    const intercept =
        (sumY - slope * sumX) /
        n;


    // Predict next value

    const prediction =
        intercept +
        slope * n;


    return prediction;
}


// ============================================================
// GET PREDICTION FOR EACH HOUR
// ============================================================

function calculatePredictions(history, parameter) {

    const dates =
        getPreviousSevenDates();

    const predictions = [];


    for (let hourIndex = 0;
         hourIndex < hours.length;
         hourIndex++) {


        const hour =
            hours[hourIndex];


        const values = [];


        // Collect same-hour readings
        // from previous 7 days

        dates.forEach(date => {

            if (
                history[date] &&
                history[date][hour] &&
                history[date][hour][parameter] !== undefined
            ) {

                const value =
                    Number(
                        history[date][hour][parameter]
                    );

                if (!isNaN(value)) {

                    values.push(value);
                }
            }

        });


        if (values.length >= 2) {

            predictions.push(
                linearRegression(values)
            );

        } else {

            predictions.push(null);
        }
    }


    return predictions;
}


// ============================================================
// GET TODAY ACTUAL READINGS
// ============================================================

function getTodayActual(history, parameter) {

    const today =
        formatDate(new Date());


    const actual = [];


    for (let i = 0; i < hours.length; i++) {

        const hour =
            hours[i];


        if (
            history[today] &&
            history[today][hour] &&
            history[today][hour][parameter] !== undefined
        ) {

            const value =
                Number(
                    history[today][hour][parameter]
                );


            actual.push(
                isNaN(value) ? null : value
            );

        } else {

            // No reading yet

            actual.push(null);
        }
    }


    return actual;
}


// ============================================================
// LIMIT PREDICTION TO TODAY'S TIME
// ============================================================

function limitPredictionToCurrentTime(predictions) {

    const now =
        new Date();

    const currentHour =
        now.getHours();


    return predictions.map(
        (value, index) => {

            if (index <= currentHour) {

                return value;

            }

            return null;
        }
    );
}


// ============================================================
// CREATE CHART
// ============================================================

function createChart(

    canvasId,
    title,
    unit,
    actualData,
    predictedData

) {

    const canvas =
        document.getElementById(canvasId);


    if (!canvas) {

        console.error(
            "Canvas not found:",
            canvasId
        );

        return null;
    }


    const ctx =
        canvas.getContext("2d");


    return new Chart(ctx, {

        type: "line",

        data: {

            labels: displayHours,

            datasets: [

                // =========================================
                // ACTUAL
                // =========================================

                {

                    label: "Actual",

                    data: actualData,

                    borderColor: "#2563eb",

                    backgroundColor:
                        "rgba(37,99,235,0.10)",

                    borderWidth: 3,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    tension: 0.3,

                    spanGaps: true
                },


                // =========================================
                // PREDICTED
                // =========================================

                {

                    label: "Predicted",

                    data: predictedData,

                    borderColor: "#ef4444",

                    backgroundColor:
                        "rgba(239,68,68,0.10)",

                    borderWidth: 2,

                    borderDash: [7, 5],

                    pointRadius: 3,

                    pointHoverRadius: 5,

                    tension: 0.3,

                    spanGaps: true
                }

            ]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            interaction: {

                mode: "index",

                intersect: false
            },


            plugins: {

                legend: {

                    display: true,

                    position: "top"
                },


                tooltip: {

                    callbacks: {

                        label: function(context) {

                            if (
                                context.parsed.y === null
                            ) {

                                return context.dataset.label +
                                    ": No data";
                            }


                            return context.dataset.label +
                                ": " +
                                Number(
                                    context.parsed.y
                                ).toFixed(2) +
                                " " +
                                unit;
                        }
                    }
                }
            },


            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Time"
                    }
                },


                y: {

                    title: {

                        display: true,

                        text: unit
                    },

                    beginAtZero: false
                }
            }
        }
    });
}


// ============================================================
// UPDATE CHART
// ============================================================

function updateChart(

    chart,
    actualData,
    predictedData

) {

    if (!chart) {
        return;
    }


    chart.data.datasets[0].data =
        actualData;


    chart.data.datasets[1].data =
        predictedData;


    chart.update();
}


// ============================================================
// PROCESS FIREBASE HISTORY
// ============================================================

function processHistory(history) {

    if (!history) {

        console.log(
            "No waterHistory found in Firebase."
        );

        return;
    }


    console.log(
        "Water History:",
        history
    );


    // ========================================================
    // ACTUAL DATA
    // ========================================================

    const temperatureActual =
        getTodayActual(
            history,
            "temperature"
        );


    const phActual =
        getTodayActual(
            history,
            "ph"
        );


    const doActual =
        getTodayActual(
            history,
            "do"
        );


    const ecActual =
        getTodayActual(
            history,
            "ec"
        );


    // ========================================================
    // PREDICTIONS
    // ========================================================

    const temperaturePrediction =
        calculatePredictions(
            history,
            "temperature"
        );


    const phPrediction =
        calculatePredictions(
            history,
            "ph"
        );


    const doPrediction =
        calculatePredictions(
            history,
            "do"
        );


    const ecPrediction =
        calculatePredictions(
            history,
            "ec"
        );


    // ========================================================
    // // ========================================================
// SHOW FULL-DAY PREDICTIONS
// Prediction is generated for all 24 hours
// ========================================================

const temperaturePredictedToday = temperaturePrediction;

const phPredictedToday = phPrediction;

const doPredictedToday = doPrediction;

const ecPredictedToday = ecPrediction;

    // ========================================================
    // CREATE CHARTS
    // ========================================================

    if (!temperatureChart) {

        temperatureChart =
            createChart(
                "temperatureChart",
                "Temperature",
                "°C",
                temperatureActual,
                temperaturePredictedToday
            );

    } else {

        updateChart(
            temperatureChart,
            temperatureActual,
            temperaturePredictedToday
        );
    }


    if (!phChart) {

        phChart =
            createChart(
                "phChart",
                "pH",
                "pH",
                phActual,
                phPredictedToday
            );

    } else {

        updateChart(
            phChart,
            phActual,
            phPredictedToday
        );
    }


    if (!ecChart) {

        ecChart =
            createChart(
                "ecChart",
                "Electrical Conductivity",
                "µS/cm",
                ecActual,
                ecPredictedToday
            );

    } else {

        updateChart(
            ecChart,
            ecActual,
            ecPredictedToday
        );
    }


    if (!doChart) {

        doChart =
            createChart(
                "doChart",
                "Dissolved Oxygen",
                "mg/L",
                doActual,
                doPredictedToday
            );

    } else {

        updateChart(
            doChart,
            doActual,
            doPredictedToday
        );
    }
}


// ============================================================
// LISTEN TO WATER HISTORY
// ============================================================

onValue(historyRef, (snapshot) => {

    const history =
        snapshot.val();


    processHistory(history);

});


// ============================================================
// LOGOUT
// ============================================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "farmId"
            );

            window.location.href =
                "login.html";
        }
    );
}

// ========================================================
// DOWNLOAD SENSOR DATA
// ========================================================

const downloadDataBtn =
    document.getElementById("downloadDataBtn");

const downloadModal =
    document.getElementById("downloadModal");

const closeDownloadModal =
    document.getElementById("closeDownloadModal");

const generateCSVBtn =
    document.getElementById("generateCSVBtn");

const downloadFromDate =
    document.getElementById("downloadFromDate");

const downloadToDate =
    document.getElementById("downloadToDate");

const downloadError =
    document.getElementById("downloadError");


// --------------------------------------------------------
// OPEN DOWNLOAD WINDOW
// --------------------------------------------------------

if (downloadDataBtn) {

    downloadDataBtn.addEventListener("click", function () {

        downloadError.textContent = "";

        downloadModal.style.display = "flex";

    });

}


// --------------------------------------------------------
// CLOSE DOWNLOAD WINDOW
// --------------------------------------------------------

if (closeDownloadModal) {

    closeDownloadModal.addEventListener("click", function () {

        downloadModal.style.display = "none";

    });

}


// --------------------------------------------------------
// CLOSE WHEN CLICKING OUTSIDE BOX
// --------------------------------------------------------

if (downloadModal) {

    downloadModal.addEventListener("click", function (event) {

        if (event.target === downloadModal) {

            downloadModal.style.display = "none";

        }

    });

}


// ========================================================
// GENERATE CSV
// ========================================================

if (generateCSVBtn) {

    generateCSVBtn.addEventListener("click", async function () {

        downloadError.textContent = "";

        const fromDate = downloadFromDate.value;
        const toDate = downloadToDate.value;


        // ------------------------------------------------
        // CHECK DATES
        // ------------------------------------------------

        if (!fromDate || !toDate) {

            downloadError.textContent =
                "Please select both From Date and To Date.";

            return;
        }


        if (fromDate > toDate) {

            downloadError.textContent =
                "From Date cannot be later than To Date.";

            return;
        }


        // ------------------------------------------------
        // BUTTON STATUS
        // ------------------------------------------------

        generateCSVBtn.disabled = true;

        generateCSVBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Data...';


        try {

            // ------------------------------------------------
            // READ WATER HISTORY
            // ------------------------------------------------

            const historyRef =
                ref(database, "waterHistory");

            const snapshot =
                await import(
                    "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js"
                ).then(({ get }) => get(historyRef));


            const history =
                snapshot.val();


            if (!history) {

                throw new Error(
                    "No water history found in Firebase."
                );

            }


            // ------------------------------------------------
            // CREATE CSV ROWS
            // ------------------------------------------------

            const rows = [];

            rows.push([
                "Date",
                "Time",
                "Temperature (°C)",
                "pH",
                "Dissolved Oxygen (mg/L)",
                "Electrical Conductivity (µS/cm)"
            ]);


            // ------------------------------------------------
            // LOOP THROUGH DATES
            // ------------------------------------------------

            Object.keys(history)
                .sort()
                .forEach(date => {

                    // Date filtering

                    if (date < fromDate || date > toDate) {
                        return;
                    }


                    const dayData = history[date];

                    if (!dayData) {
                        return;
                    }


                    // ------------------------------------------------
                    // LOOP THROUGH HOURLY RECORDS
                    // ------------------------------------------------

                    Object.keys(dayData)
                        .sort()
                        .forEach(time => {

                            const reading =
                                dayData[time];

                            if (!reading) {
                                return;
                            }


                            rows.push([

                                date,

                                time,

                                reading.temperature ?? "",

                                reading.ph ?? "",

                                reading.do ?? "",

                                reading.ec ?? ""

                            ]);

                        });

                });


            // ------------------------------------------------
            // CHECK WHETHER DATA EXISTS
            // ------------------------------------------------

            if (rows.length === 1) {

                throw new Error(
                    "No sensor data found for the selected date range."
                );

            }


            // ------------------------------------------------
            // CONVERT TO CSV
            // ------------------------------------------------

            const csv = rows
                .map(row =>
                    row.map(value => {

                        const text =
                            String(value);

                        // Escape quotes

                        return `"${text.replace(/"/g, '""')}"`;

                    }).join(",")
                )
                .join("\r\n");


            // ------------------------------------------------
            // CREATE DOWNLOAD FILE
            // ------------------------------------------------

            const blob =
                new Blob(
                    [csv],
                    {
                        type: "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `WaterData_${fromDate}_to_${toDate}.csv`;


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            URL.revokeObjectURL(url);


            // ------------------------------------------------
            // CLOSE MODAL
            // ------------------------------------------------

            downloadModal.style.display = "none";


        } catch (error) {

            console.error(
                "CSV Download Error:",
                error
            );

            downloadError.textContent =
                error.message ||
                "Unable to download data.";

        }


        // ------------------------------------------------
        // RESET BUTTON
        // ------------------------------------------------

        generateCSVBtn.disabled = false;

        generateCSVBtn.innerHTML =
            '<i class="fa-solid fa-download"></i> Download CSV';

    });

}