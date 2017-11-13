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

    $('#connectedUserCount').text("Currently " + connect.numChildren() + " customers are viewing")
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



  var timeKeeper = []
  var isFirstTime = true
  var childNum = 0

  database.ref('/Train_Time_Schedule').orderByChild('timeStamp').on('child_added', function(data){
    var tFirstTime = data.val().first_train_time
    var tFrequency = data.val().frequency

    var tFirstTimeConverted = moment(tFirstTime, 'hh:mm').subtract(1, "years")
    var currentTime = moment().format('hh:mm')

    var differentTime = moment().diff(tFirstTimeConverted, "minutes")

    var tRemainder = differentTime % tFrequency
    var tMinutesUntilTrain = tFrequency - tRemainder
    var tSecondsLeft = tMinutesUntilTrain * 60

    console.log(tSecondsLeft)
    timeKeeper.push(tSecondsLeft)
    if (isFirstTime === true){
      console.log("Goes in here!11111")
      database.ref('Train_Time_Schedule').on('value', function(value){
        childNum = value.numChildren()
      })
      
      childNum -= 1
      console.log(childNum)
      isFirstTime = false
      if(childNum === 0) {
        console.log("Goes in here!2222")
        countDown()
      }
    } else {
      console.log("Goes in here!4444")

      childNum -= 1
      console.log(childNum)
      if(childNum === 0){
        console.log("Goes in here!3333")
        isFirstTime = true
        
        countDown()
      }

    }
    
    var nextTrain = moment().add(tMinutesUntilTrain, "minutes").format('hh:mm a')


    $('#trainSchedule').append($('<tr>').append($('<td>').text(data.val().train_name))
      .append($('<td>').text(data.val().destination))
      .append($('<td>').text(data.val().frequency))
      .append($('<td>').text(nextTrain))
      .append($('<td>').text(tMinutesUntilTrain).addClass('minuteLeft')))


  }, function(error){
  	console.log('Could not read: ' + error)

  })


  function countDown(){
    console.log("come here!")
    //timeKeeper = []
    var shortestTime

    for(var i = 0; i < timeKeeper.length - 1; i++){
      if(timeKeeper[i] < timeKeeper[i+1]){
        shortestTime = timeKeeper[i]
      } else {
        shortestTime = timeKeeper[i+1]
      }

    }
    console.log("The shortest time is: " + shortestTime)

    if (shortestTime === 60){

      alert("You have 1 minute to catch the train!! Run!!")
      setTimeout(refresh, shortestTime*1000)

    } else if (shortestTime == 180 || shortestTime == 120) {

      alert("You have 2-3 minute to catch the train!! Run!!")
      setTimeout(refresh, shortestTime*1000)

    } else if (shortestTime < 300 && shortestTime > 180) {

      setTimeout(refresh, shortestTime*1000)

    } else {

      setTimeout(refresh, 180000)
    }
    

  }


  function refresh() {
    location.reload()
  }