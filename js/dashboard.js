// Load the JSON and print results to HTML with a Promise

//const { sub } = require("server/router");

//const { response } = require("express");

/* 
    resources used to solve this:
    https://www.youtube.com/watch?v=C3dfjyft_m4&ab_channel=JonathanSoma
    
    How to start a python server for testing purposes:
    https://blog.anvileight.com/posts/simple-python-http-server/
    The JSON was fetched using a JAVASCRIPT promise.
    The JSON file was then parsed using response.json()
    Then parse JSON data was passed to HTML using getElementByID and innerHTML
    INSTRUCTIONS TO ACCESS THE LOCAL HOST SERVER:
    $ python3 -m http.server 8000 --bind 127.0.0.1 
    Server address: http://127.0.0.1:8000/
 */

//const fileImport = import('require');

// import JSON file into Javascript
const studentJSON = "json/sfldData.json";
const performanceJSON = "json/final_student_ds.json";
console.log(studentJSON);
console.log(performanceJSON);

// asyn  load json data
async function getData() {
  const response = await fetch(studentJSON);
  const performanceResponse = await fetch(performanceJSON);
  const data = await response.json();
  const performanceData = await performanceResponse.json();
  //console.log(JSON.stringify(data)); // Confirm JSON file loaded correctly
  //console.log(JSON.stringify(performanceData)) // Confirm JSON file loaded correctly
  console.log("Success");

  // Detecting student who's loggedin
  // passing the loggedin students name to HTML
  let loggedInUser = data.rows[1].student_id;
  console.log(loggedInUser);
  let userNameDiv = document.querySelector("#user_name");
  userNameDiv.innerHTML = `Welcome ${loggedInUser}`;

  // store student JSON data in an array
  const dataPoints = [];

  for (let i in data) {
    let arr = [];
    for (key in data[i]) {
      arr.push(data[i][key]);
    }
    dataPoints.push(arr);
  }

  console.log(dataPoints[3][0]);

  // pass JSON data to an array
  let studentData = [];

  // loop through JSON data and pass information to array
  // reference: https://stckoverflow.com/questions/45902098/how-to-pass-json-data-into-javascript-array
  for (let prop in data) {
    let arr = [];
    for (key in data[prop]) {
      arr.push(data[prop][key]);
    }
    studentData.push(arr);
  }

  // filter the studetData and save result to array
  const studentArr = [];
  const dateArr = [];

  studentData[3].filter((studentData) => {
    if (studentData.student_id.includes("student000000")) {
      studentArr.push(parseFloat(studentData.sentiment));
    }
  });
  console.log("Sentiment: " + studentArr);

  studentData[3].filter((studentData) => {
    if (studentData.student_id.includes("student000000")) {
      dateArr.push(studentData.created_at);
    }
  });

  console.log("Date: " + dateArr.sort());

  // iterate over the dateArr
  for (let i = 0; i < dateArr.length; i++) {
    // convert this timestamp string to the format MMM DD
    const formattedDate = formatDateToMMMDD(dateArr[i]);

    // replace the dateArr timestamp at this location with this MMM DD date
    dateArr[i] = formattedDate;
  }

  //calculate average sentiment score
  const sum = studentArr.reduce((a, b) => a + b, 0);
  console.log(sum);
  const avg = sum / studentArr.length || 0;
  console.log(avg);

  //determin overall sentiment based on average
  const negative = "Negative";
  const neutral = "Netural";
  const positive = "Positive";

  if (avg < 3) {
    const sentimentDiv = document.querySelector("#student_sentiment");
    sentimentDiv.innerHTML = `Overall your posts are: <span class="text-size">${negative}</span>`;
  } else if (avg >= 3 && avg < 4) {
    const sentimentDiv = document.querySelector("#student_sentiment");
    sentimentDiv.innerHTML = `Overall your posts are: <span class="text-size">${positive}</span>`;
  } else if (avg <= 3) {
    const sentimentDiv = document.querySelector("#student_sentiment");
    sentimentDiv.innerHTML = `Overall your posts are: <span class="text-size">${neutral}</span>`;
  }

  // STUDENT SENTIMENT KPI VISUALIZATION CODE
  // Draw a student's sentiment Chart
  let ctx = document.getElementById("sentiment-chart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dateArr,
      datasets: [
        {
          label: "Sentiment",
          data: studentArr,
          fill: false,
          borderColor: "rgb(241, 92, 25)",
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        // the key here should be x not xAxes
        // also there was a syntax error here using xAxes: [{}] when it should be x: {}
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Discussion Board Post Date"
          },
        },],
        // this should be yAxes and use the syntax yAxes: [{}] instead of y: {}
        // if not the y-axis will not start at 0
        // https://stackoverflow.com/questions/67849315/chart-js-line-graph-y-axis-not-starting-from-0
        yAxes: [
          {
            // set the min, max, and make sure y starts at 0
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 6,
            },
            // to set the label for y-axies use the following stack overflow post
            // https://stackoverflow.com/questions/27910719/in-chart-js-set-chart-title-name-of-x-axis-and-y-axis
            scaleLabel: {
              display: true,
              labelString: "Sentiment Score (1-Negative, 3-Netural, 4 & Above-Postivie)",
            },
          },
        ],
      },
    },
  });

  // show students categorization based on who's logged in
  const categoryDiv = document.querySelector("#student_category");
  categoryDiv.innerHTML = `You are a: <span class="text-size">${dataPoints[3][0].cluster_assignments}</span>`;

  // store performance data in an array
  let performData = [];
  //let avgData = [];

  for (let i in performanceData) {
    let arr = [];
    for (key in performanceData[i]) {
      arr.push(performanceData[i][key]);
    }
    performData.push(arr);
  }

  /*for (let i in performanceData) {
    let arr = [];
    for (key in performanceData[i]) {
      arr.push(performanceData[i][key]);
    }
    avgData.push(arr);
  }*/

  //console.log(performData[3]);

  // calculating the AVG for grades
  /*let assessmentAVG = Array.from(
    avgData[3].reduce(
      (acc, obj) =>
        Object.keys(obj).reduce(
          (acc, key) =>
            typeof obj[key] == "number"
              ? acc.set(key, (acc.get(key) || []).concat(obj[key]))
              : acc,
          acc
        ),
      new Map()
    ),
    ([name, values]) => ({
      name,
      average: values.reduce((a, b) => a + b) / values.length,
    })
  );

  console.log(assessmentAVG)*/

  //filter performanceData to student000000
  let studentPerformArr = [];

  performData[3].filter((performData) => {
    if (performData.student_id.includes("student000000")) {
      studentPerformArr.push(performData.assignment_01);
      studentPerformArr.push(performData.assignment_02);
      studentPerformArr.push(performData.assignment_03);
      studentPerformArr.push(performData.quiz_01);
      studentPerformArr.push(performData.midterm_exam);
      studentPerformArr.push(performData.final_exam);
    }
  });

  console.log(studentPerformArr);

  // STUDENT PERFORMANCE VISUALIZATION CODE
  let pctx = document.getElementById("performance-chart").getContext("2d");
  const performanceChart = new Chart(pctx, {
    type: "bar", // I think it is required to specify chart type in chartjs otherwise it won't load
    data: {
      labels: [
        "Assignment 01",
        "Assignment 02",
        "Assignment 03",
        "Quiz 01",
        "Midterm Exam",
        "Final Exam",
      ],
      datasets: [
        {
          label: "Assessements",
          data: studentPerformArr,
          backgroundColor: "rgba(75, 192, 192, 0.4)", // specify the color for the bars
        },
        {
          type: "line",
          label: "Class Avg",
          data: [76.6, 76.43, 80.43, 76.56, 75.49, 59.62],
          tension: 0.2,
          fill: false, // do not color the area under the line graph
          backgroundColor: "rgba(255, 99, 132, 1)", // specify the color for the dot of the line
          borderColor: "rgba(255, 99, 132, 1)", // specify the color for the line connecting the dots
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Assessments"
          }
        }],
        // need to use yAxes: [{}] instead of y: {} otherwise the scale will not start at 0
        yAxes: [
          {
            ticks: {
              Min: 0,
              Max: 100,
            },
            // to set the label for y-axies use the following stack overflow post
            // https://stackoverflow.com/questions/27910719/in-chart-js-set-chart-title-name-of-x-axis-and-y-axis
            scaleLabel: {
              display: true,
              labelString: "Assessment Scores",
            },
          },
        ],
      },
    },
  });

  //student time managment score
  let latenessIndicatorAVG = [];
  //let timeScore = [];

  // filter lateness indicator for student000000
  performData[3].filter((performData) => {
    if (performData.student_id.includes("student000000")) {
      latenessIndicatorAVG.push(performData.assignment_1_lateness_indicator);
      latenessIndicatorAVG.push(performData.assignment_2_lateness_indicator);
      latenessIndicatorAVG.push(performData.assignment_3_lateness_indicator);
    }
  });

  console.log(latenessIndicatorAVG);

  //

  //calculating the AVG for lateness indicator
  const latenessIndicatorSum = latenessIndicatorAVG.reduce((a, b) => a + b, 0);
  console.log(latenessIndicatorSum);
  const timeScore = latenessIndicatorSum / latenessIndicatorAVG.length || 0;
  console.log(timeScore);

  //show students categorization based on who's logged in
  const timeScoreDiv = document.querySelector("#time-score");
  timeScoreDiv.innerHTML = `Overall time management score: <span class="text-size">${timeScore}</span>`;

  //doughnut chart data
  let timeData = [];
  let timeLabels = [
    "assignment 1  duration to submit in hours",
    "assignment 2  duration to submit in hours",
    "assignment 3  duration to submit in hours",
  ];

  performData[3].filter((performData) => {
    if (performData.student_id.includes("student000000")) {
      timeData.push(performData.assignment_1_duration_to_submit_in_hours);
      timeData.push(performData.assignment_2_duration_to_submit_in_hours);
      timeData.push(performData.assignment_3_duration_to_submit_in_hours);
    }
  });

  console.log(timeData);

  // STUDENT TIME MANAGEMENT VISUALIZATION CODE
  let tctx = document.getElementById("time-chart").getContext("2d");
  const timeChart = new Chart(tctx, {
    type: "doughnut", // added chart type to ensure that chart is rendered
    data: {
      labels: timeLabels,
      datasets: [
        {
          type: "doughnut",
          data: timeData,
          backgroundColor: ["red", "blue", "green"],
        },
      ],
    },
    options: {
      // can just specify legend. no need to add plugins: {}
      legend: {
        position: "right",
      },
    },
  });
}

/**
 * Convert a timestamp string to a month date format MMM DD
 *
 * @param {String} dateString String of a timestamp
 * @returns the month and day of the timestamp in the format MMM DD
 */
function formatDateToMMMDD(dateString) {
  // create a date using the timestamp string
  const inputDate = new Date(dateString);

  // all the 3 letter abbrevs for months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // find the month from our date which will be between 0 to 11
  // use this number to index into our arr of 3 letter abbrevs to find the correct month
  const month = months[inputDate.getMonth()];

  // get the date as a number from our date
  const day = inputDate.getDate();

  // return the month and day in the format MMM DD
  return `${month} ${day}`;
}

getData();
