  var config = {
  	apiKey: "AIzaSyDi_hh8Al-BcWhprUm5Amx0f2wgxIxO_DU",
  	authDomain: "mydatabaseproj-mosh.firebaseapp.com",
  	databaseURL: "https://mydatabaseproj-mosh.firebaseio.com",
  	projectId: "mydatabaseproj-mosh",
  	storageBucket: "mydatabaseproj-mosh.appspot.com",
  	messagingSenderId: "812655889128"
  }

  firebase.initializeApp(config)

  var database = firebase.database()

  var connectionsRef = database.ref("/connections")
  var connectedRef = database.ref(".info/connected")


  connectedRef.on('value', function(connect){

    if(connect.val()){
      var connectedUser = connectionsRef.push(true)

      connectedUser.onDisconnect().remove()
    }

  })

  connectionsRef.on('value', function(connect){

    $('#connectedUserCount').text("Connected Customers are: " + connect.numChildren())
  })

  $('#addButton').on('click', function(event){
  	event.preventDefault()

  	var trainName = $('#trainName').val()
  	var destination = $('#destination').val()
  	var firstTrainTime = $('#firstTrainTime').val()
  	var frequency = $('#frequency').val()

  	database.ref('/Train_Time_Schedule').push({
  		train_name: trainName,
  		destination: destination,
  		first_train_time: firstTrainTime,
  		frequency: frequency,
  		timeStamp: firebase.database.ServerValue.TIMESTAMP
  	})

  	$('.form-group').children('input').val('')

  })

  database.ref('/Train_Time_Schedule').orderByChild('timeStamp').on('child_added', function(data){
  	

    var tFirstTime = data.val().first_train_time
    var tFrequency = data.val().frequency

    var tFirstTimeConverted = moment(tFirstTime, 'hh:mm').subtract(1, "years")
    var currentTime = moment().format('hh:mm')

    var differentTime = moment().diff(tFirstTimeConverted, "minutes")

    var tRemainder = differentTime % tFrequency
    var tMinutesUntilTrain = tFrequency - tRemainder
    var nextTrain = moment().add(tMinutesUntilTrain, "minutes").format('hh:mm a')

  	
  	$('#trainSchedule').append($('<tr>').append($('<td>').text(data.val().train_name)).append($('<td>').text(data.val().destination)).append($('<td>').text(data.val().frequency)).append($('<td>').text(nextTrain)).append($('<td>').text(tMinutesUntilTrain)))


  }, function(error){
  	console.log('Could not read: ' + error)

  })