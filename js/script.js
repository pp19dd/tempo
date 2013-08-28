/* Author: Mykel Nahorniak

*/

//// INIT
  var weightKg;
  var athleteName;

  var thisYear = Date.today().getYear().toString().slice(1);
  var thisMonth = Date.today().getMonth();
  var thisWeek = Date.today().getISOWeek();
  var thisDayRaw = Date.today().toString('ddd');
  var thisDay = thisDayRaw.toLowerCase();
  var thisNumDayRaw = Date.today().getDay();
  var thisNumDay = thisNumDayRaw + 3;

  // because sunday is "end of week" according to tempo, but is "beginning of week" to jquery,
  // hardcoding sunday to be the 10th column
  if (thisNumDayRaw == 0) {
    thisNumDay = 10;
  }

  console.log('today is ' + thisNumDay);

//// UTILITY FUNCTIONS
function compareNum(a,b){
  return (a < b ? this >= a && this <= b : this >= b && this <= a);
}

jQuery(function($) {
//// CALENDAR
  // getting json data
  $.getJSON('data/workouts.js', function(data) {


//// CONFIGURATION
    $.each(data.config, function(i,item){
      // getting athlete weight in lbs and converting to kg
      weightKg    = item.weight/2.2;

      // getting athlete name
      athleteName = item.name;


      $('#fitness h2 small').html(athleteName + " - " + item.weight + "lbs");
    }); // end config each


//// SCHEDULES
    // get a list of all the historical schedules and append to list
    $.each(data.schedules, function(i,item){
      // getting raw workout name from schedules data
      var scheduleNameRaw        = item.name;

      // splitting out week number
      var scheduleName           = scheduleNameRaw.split('-')[0];

      // splitting out year number
      var scheduleYear           = scheduleNameRaw.split('-')[1];

      // splitting out workout shortname
      var scheduleType           = scheduleNameRaw.split('-')[2];

      var scheduleSun = item.sun.workoutname
      var scheduleMon = item.mon.workoutname
      var scheduleTue = item.tue.workoutname
      var scheduleWed = item.wed.workoutname
      var scheduleThu = item.thu.workoutname
      var scheduleFri = item.fri.workoutname
      var scheduleSat = item.sat.workoutname

      // if the data pulled is for this week, move forward
      if((scheduleName == thisWeek)) {

        // dynamically pulling data depending on what today's date is
        var calendarShortName = item[thisDay].workoutname;
        var parsedDuration = item[thisDay].duration;

        // pull all of this week's activities in the json file
        $.each(data.activities, function(i,item){
          var activityName          = item.name;
          var activityShortName     = item.shortname
          var activityType          = item.type;
          var activityWarmup        = item.wu;
          var activityDesc          = item.desc;
          var activityInfo          = item.info;
          var activityCooldown      = item.cd;

          // rendering library information
          var libraryTemplate = "<div id='" + activityShortName + "' class='book'><h4>" + activityName + " / " + parsedDuration + " minutes</h4><h6>Warm Up</h6><p>" + activityWarmup + "</p><h6>Workout</h6><p>" + activityDesc + "</p><h6 class='activity_info'>Coach Comments</h6><p>" + activityInfo + "</p><h6>Cool Down</h6><p>" + activityCooldown + "</p></div><hr class='soften'>";

          $('#workout_library').append(libraryTemplate);

          // if the pulled shortname matches the shortname of the schedule
          if((activityShortName == calendarShortName)) {
            // setting this activity to blank
            var thisActivity = "";

            // setting values for data if there isn't any
            if(activityWarmup == ""){
              activityWarmup = "None."
            }

            if(activityCooldown == ""){
              activityCooldown = "None."
            }

            if(activityInfo == ""){
              activityInfo = "None."
            }

            // defining the template to list the activity
            /*
            var racingTemplate;
            var racingTemplateText = "No hard workouts two days prior to race day.";

            var maintenanceTemplate = "<h6 class='activity_info'>What to Focus on This Week</h6><p>If you felt weak responding to attacks, do AC work. If you felt like you had nothing left at the end, VO2 and tempo.</p>";

            // show this on thursday and friday only
            if ((thisNumDay == 7) || (thisNumDay == 8)) {
              racingTemplateText = "No hard workouts today if racing Sunday.";
            }
            // show this on friday and saturday only
            if ((thisNumDay == 8) || (thisNumDay == 9)) {
              racingTemplateText += "<br/>If racing tomorrow, do the following race prep:<br/>Ride 60 - 90 minutes mostly in your endurance zone.<br/>Complete 5 low gear accelerations with smooth cadence above 120 rpm lasting about 1 minute each with at least 2 minutes of recovery between efforts.<br/>Complete 5 big gear intervals that last no more than 1 minute each.<br/>In each interval your goal is to go fast, but back down before you start really killing yourself.<br/>Recover for at least 2 minutes between efforts.<br/>Include at least 5 out of the saddle jumps that last no longer than 12 seconds each. You can do these are part of the low gear accelerations or big gear intervals.";
            }
            // show this on saturday and sunday only
            if ((thisNumDay == 9) || (thisNumDay == 3)) {
              racingTemplateText += " If racing today, do the following warm up: spin into endurance for 10-15 mins. Big ring 18. 5-min step up to FTP. Big ring 18-17-16. Then easy for 5. Then a few 1-2 min step ups to vo2 and over. Big ring 16-15-14. 1 easy out of the saddle jump.";
            }

            if (((scheduleName >= 11) && (scheduleName <= 24)) ||
               ((scheduleName >= 25) && (scheduleName <= 27)) ||
               ((scheduleName >= 28) && (scheduleName <= 35))) {
              racingTemplate = "<h6 class='activity_info'>If Racing This Weekend</h6><p>" + racingTemplateText + "</p>"
            }
            */

            racingTemplate = "";
            maintenanceTemplate = "";

            var activityTemplate = "<div id='" + scheduleYear + "' class='activity'><span class='label label-info'>20" + scheduleYear + " season</span><h4>" + activityName + " / " + parsedDuration + " minutes</h4><h6>Warm Up</h6><p>" + activityWarmup + "</p><h6>Workout</h6><p>" + activityDesc + "</p><h6 class='activity_info'>Coach Comments</h6><p>" + activityInfo + "</p><h6>Cool Down</h6><p>" + activityCooldown + "</p>"  + racingTemplate + maintenanceTemplate + "</div>";

            $('#workout').append(activityTemplate);
          }
        }); // end activities each
      }

      // defining the color-coded of workouts being done on a particular week
      // l/e week 10
      if (scheduleName <= 10 ) {
        rowClass = "warning";
      } else
      // g/e 11, l/e 24
      if ((scheduleName >= 11) && (scheduleName <= 24)) {
        rowClass = "success";
      // g/e 25, l/e 27
      } else
      if ((scheduleName >= 25) && (scheduleName <= 27)) {
        rowClass = "danger";
      // g/e 28, l/e 35
      } else
      if ((scheduleName >= 28) && (scheduleName <= 35)) {
        rowClass = "success"
      // g/e 36, l/e 39
      } else
      if ((scheduleName >= 36) && (scheduleName <= 39)) {
        rowClass = "offseason"
      // g/e 40, l/e 53
      } else
      if ((scheduleName >= 40) && (scheduleName <= 53)) {
        rowClass = "active"
      // if doesn't fit, say off season
      } else {
        rowClass = "offseason";
      }

      // defining the template to list the schedule
      var scheduleTemplate = "<tr class='"+ rowClass + "' id='" + scheduleNameRaw + "'><!--<td>" + scheduleType + "</td>--><td id='" + thisWeek + "'>" + scheduleName + "</td><td>" + scheduleYear + "</td><td id='" + scheduleName + "_mon'><a href='#" + scheduleMon + "'>" + scheduleMon + "</a></td><td id='" + scheduleName + "_tue'><a href='#" + scheduleTue + "'>" + scheduleTue + "</td><td id='" + scheduleName + "_wed'><a href='#" + scheduleWed + "'>" + scheduleWed + "</td><td id='" + scheduleName + "_thu'><a href='#" + scheduleThu + "'>" + scheduleThu + "</td><td id='" + scheduleName + "_fri'><a href='#" + scheduleFri + "'>" + scheduleFri + "</td><td id='" + scheduleName + "_sat'><a href='#" + scheduleSat + "'>" + scheduleSat + "</td><td id='" + scheduleName + "_sun'><a href='#" + scheduleSun + "'>" + scheduleSun + "</td></tr>";

      // pushing the template to the schedules schedule
      $('#schedules').append(scheduleTemplate);

    }); // end schedules each


////FITNESS
    $.each(data.fitness[0], function(i,item){

      var fitnessTime  = i;
      var fitnessPower = item;
      var wKg = item/weightKg;

      var fitnessTemplate = "<tr id='" + i + "'><td>" + i + "</td><td>" + item + "</td><td class='wkg'>" + wKg.toFixed(2) + "</td></tr>";

      $('#profile').append(fitnessTemplate);

      // determine class for each power zone and color
      // grab data from first table
      var do_these = ["5s", "1m", "5m", "20m" ];
      var do_info = { };

      for( i = 0; i < do_these.length; i++ ) ( function(r) {
        do_info[r] = parseFloat($("#profile tr#" + r + " td:eq(2)").html());
      }) (do_these[i]);

      // apply colors to second table
      for( i = 0; i < do_these.length; i++ ) ( function(r,i) {
        $("#powerclass tr td:nth-child(" + (2+i) + ")").each( function() {
          var cell = parseFloat( $(this).html() );
          if( do_info[r] >= cell ) {
            $(this).css( { 'background-color': '#3CBBAF' } );
          }
        });
      }) (do_these[i], i);
    });


////RENDERING
    // showing just this week/year
    // FIXME: kinda sloppy, testing to see if the element exists, then showing
    if ($('#schedules tr[id^=' + thisWeek + ']').length > 0){
      $('#schedules tr[id^=' + thisWeek + ']').show();
    }

    if ($('#workout .activity:last').length > 0){
      $('#workout .activity:last').show();
    }

    // hiding schedule columns that don't apply
    $('#full_schedule').columnManager();
    $('#full_schedule').hideColumns([1,3,4,5,6,7,8,9]);
    $('#full_schedule').showColumns([thisNumDay, (thisNumDay - 1), (thisNumDay - 2)]);

    // counting the amount of workouts and displaying
    var bookCount = $('#workout_library .book').length;
    $('#library h2 small').html(bookCount + ' books')

    $('#loading').hide();
    $('.container').show();

  }); // end get json call


/////GENERATING FUTURE
/*

logic
=====

in each month, figure out what the weakest zone is on the power profile by counting distance from the top (and/or the amount of green cells)

then, depending on the month, decide which zones are "open" for training. out of those zones, pick the weakest one and set that for the next block

//FIXME: use stored values to populate placeholders in setup form


if ((thisWeek == 47) || (thisWeek == 43) || (thisWeek == 39)) {
  if (thisDay == 'sun') {
    // display the 20 min power form element, asking them to enter their most recent 20 min test result
    $('#setup').show();
    $('#setup .control-group').not('id[m20]').hide();
  }

}


weeks
01-04 - VO2 OR AC OR FTP
O5-10 - VO2 OR AC OR FTP
11-20 - VO2 OR AC
21-35 - MAINTENANCE (no logic)
36-39 - OFF (no logic)
40-41 - day 1 and day 2 testing
42-47 - TEMPO
48-52 - FTP




*/


////RENDERING
  // updating "today's workout" header to show this week
  $('h1 badge').html('WEEK ' + thisWeek);

  // making today bold
  $("[id*="+thisDay+"]").css('font-weight', 'bold');


////CLICK HANDLERS FOR RENDERING
  // showing all workouts historically associated with this week
  $("#thisyearonly").click(function() {
    $('#workout .activity').not(':last').toggle(200);
    return false;
  });

  // showing all schedules
  $("#thisweekonly").click(function() {
    $('#schedules tr').not('[id^=' + thisWeek + ']').toggle();
    $('#full_schedule').showColumns([1,3,4,5,6,7,8,9]);
    return false;
  });

  // showing full library
  $("#full_library").click(function() {
    $('#library_explanation').toggle();
    $('#workout_library').toggle();
    return false;
  });

  // when a workout is clicked, unhide the library, then jump there
  $("#full_schedule").click(function(scheduleName) {
    $('#library_explanation').hide();
    $('#workout_library').show();
  });

  $("#havepowermeter").click(function() {
    $('#powerbests').toggle();

  });


}); // end jquery function