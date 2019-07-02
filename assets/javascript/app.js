
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

function calculateMinutesAway(trainFreq, trainStart) {
    // Current Time
    let currentTime = moment();

    let trainStartTime = moment(trainStart, "HH:mm");
    
    if (currentTime.isBefore(trainStartTime)){
        return trainStartTime.diff(currentTime, "minutes");
    }

    // First Time (pushed back 1 year to make sure it comes before current time)
    let startTimeConverted = trainStartTime.subtract(1, "years");

    // Difference between the times
    let diffTime = currentTime.diff(startTimeConverted, "minutes");

    // Time apart (remainder)
    let tRemainder = diffTime % trainFreq;

    // Minute Until Train
    let tMinutesTillTrain = trainFreq - tRemainder;

    return tMinutesTillTrain;
}

// Button for adding train

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    const trainName = $("#train-name-input").val().trim();
    const trainDest = $("#destination-input").val().trim();
    const trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
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

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    // Store everything into a variable.
    const trainName = childSnapshot.val().name;
    const trainDest = childSnapshot.val().destination;
    const trainStart = childSnapshot.val().start;
    const trainFreq = childSnapshot.val().frequency;

    // Create the new row
    let newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainStart),
        $("<td>").text(trainFreq),
        $("<td>").text(calculateMinutesAway(trainFreq, trainStart))
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});