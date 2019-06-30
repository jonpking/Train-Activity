
// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDqfQKweo_zzigcPmpAnNSigI2k4vXBB8o",
    authDomain: "train-scheduler-ff3ee.firebaseapp.com",
    databaseURL: "https://train-scheduler-ff3ee.firebaseio.com",
    projectId: "train-scheduler-ff3ee",
    storageBucket: "",
    messagingSenderId: "464761733629",
    appId: "1:464761733629:web:ad60a212bcd0d6e2"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// Button for adding train

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    const trainName = $("#train-name-input").val().trim();
    const trainDest = $("#destination-input").val().trim();
    const trainStart = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
    const trainFreq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    const newTrain = {
        name: trainName,
        destination: trainDest,
        start: trainStart,
        frequency: trainFreq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    const trainName = childSnapshot.val().name;
    const trainDest = childSnapshot.val().destination;
    const trainStart = childSnapshot.val().start;
    const trainFreq = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainStart);
    console.log(trainFreq);

    // Prettify the employee start
    // let empStartPretty = moment.unix(trainStart).format("MM/DD/YYYY");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    // let empMonths = moment().diff(moment(empStart, "X"), "months");
    // console.log(empMonths);

    // Calculate the total billed rate
    // let empBilled = empMonths * empRate;
    // console.log(empBilled);

    // Create the new row
    let newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainStart),
        $("<td>").text(trainFreq),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});