<?php

  // instantiate the query filter
  $filter = "";

  if($routes[2] == "athlete") {

    if ($_GET['key']) {
      $filter = "WHERE api_key='" . $_GET['key'] . "'";
    }

    // generating array for user's name and weight
    $result = db_query("SELECT `name`,`weight` FROM `athletes` " . $filter . ";");
    if($result === false) {
        echo 'There was a problem retrieving your profile information.';
    } else {

      // prepare the json workout output
      $athlete = array();

      while($athlete = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $athletes[] = $athlete;
      }
    }

    // generating array for user's fitness profile
    $result = db_query("SELECT `1s`,`5s`,`30s`,`1m`,`5m`,`10m`,`20m`,`60m` FROM `athletes` " . $filter . ";");
    if($result === false) {
        echo 'There was a problem retrieving your power profile.';
    } else {

      // prepare the json workout output
      $fit = array();


      while($fit = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $fitness[] = $fit;
      }
    }

    // combining arrays for json output
    $output = json_encode(array("athletes" => $athletes, "fitness" => $fitness));

    echo $output;
  }


  if($routes[2] == "activities") {
    $filter = "";

    if ($_GET['activity']) {
      $filter = "WHERE shortname='" . $_GET['activity'] . "'";
    }

    $result = db_query("SELECT * FROM `activities` " . $filter . " ORDER BY `shortname` DESC;");
    if($result === false) {
        echo 'There was an error retrieving workouts.';
    } else {
      // prepare the json workout output
      $activity = array();

      while($activity = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $activities[] = $activity;
      }

      $output = json_encode(array('activities' => $activities));

      echo $output;
    }
  }

  if($routes[2] == "schedules") {
    if ($_GET['week']) {
      $filter = "WHERE week='" . $_GET['week'] . "'";
    }

    $result = db_query("SELECT * FROM `schedules` " . $filter . " ORDER BY `year` DESC;");
    if($result === false) {
        echo 'There was an error retrieving your schedule.';
    } else {
      // prepare the json workout output
      $schedule = array();

      while($schedule = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $schedules[] = $schedule;
      }

      $output = json_encode(array('schedules' => $schedules));

      echo $output;
    }
  }

?>

