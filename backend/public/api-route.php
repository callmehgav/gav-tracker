<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

$stops = [
    // name, location, type (national park, snow resort, other ), Status (visited, planned, skipped)
    // Start
    ["name" => "Anniston Alabama", "lat" => 33.6598, "lng" => -85.8316, "type" => "start", "status" => "visited"],
    ["name" => "Strokin Diesel", "lat" => 33.9749, "lng" => -86.4481, "type" => "shop", "status" => "visited"],

    // Southwest
    ["name" => "Palo Duro Canyon", "lat" => 34.9370, "lng" => -101.6460, "type" => "national_park", "status" => "planned"],
    ["name" => "Santa Fe", "lat" => 35.6870, "lng" => -105.9378, "type" => "city", "status" => "planned"],
    ["name" => "Petrified Forest National Park", "lat" => 35.0650, "lng" => -109.7763, "type" => "national_park", "status" => "planned"],
    ["name" => "Grand Canyon National Park", "lat" => 36.1069, "lng" => -112.1129, "type" => "national_park", "status" => "planned"],
    ["name" => "Zion National Park", "lat" => 37.2982, "lng" => -113.0263, "type" => "national_park", "status" => "planned"],
    ["name" => "Bryce Canyon National Park", "lat" => 37.5930, "lng" => -112.1871, "type" => "national_park", "status" => "planned"],
    //["name" => "Capitol Reef National Park", "lat" => 38.3670, "lng" => -111.2615, "type" => "national_park", "status" => "planned"],
    
    // Nevada / Eastern California
    ["name" => "Great Basin National Park", "lat" => 38.9832, "lng" => -114.2190, "type" => "national_park", "status" => "planned"],
    ["name" => "Death Valley National Park", "lat" => 36.5054, "lng" => -117.0794, "type" => "national_park", "status" => "planned"],

    // Sierra Nevada
    ["name" => "Sequoia National Park", "lat" => 36.4864, "lng" => -118.5658, "type" => "national_park", "status" => "planned"],
    ["name" => "Kings Canyon National Park", "lat" => 36.8879, "lng" => -118.5551, "type" => "national_park", "status" => "planned"],
    ["name" => "Yosemite National Park", "lat" => 37.8651, "lng" => -119.5383, "type" => "national_park", "status" => "planned"],
    ["name" => "Half Dome Viewpoint", "lat" => 37.7459, "lng" => -119.5332, "type" => "viewpoint", "status" => "planned"],

    // Lake Tahoe + Epic Pass ski resorts
    ["name" => "Kirkwood Mountain Resort", "lat" => 38.6848, "lng" => -120.0658, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Heavenly Ski Resort", "lat" => 38.9358, "lng" => -119.9390, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Northstar California Resort", "lat" => 39.2747, "lng" => -120.1218, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Lake Tahoe Scenic Camp", "lat" => 39.0968, "lng" => -120.0324, "type" => "camp", "status" => "planned"],

    // Northern California and Oregon
    ["name" => "Lassen Volcanic National Park", "lat" => 40.4977, "lng" => -121.4207, "type" => "national_park", "status" => "planned"],
    ["name" => "Redwood National Park", "lat" => 41.2132, "lng" => -124.0046, "type" => "national_park", "status" => "planned"],
    ["name" => "Crescent City", "lat" => 41.7558, "lng" => -124.2017, "type" => "city", "status" => "planned"],
    ["name" => "Cannon Beach", "lat" => 45.8918, "lng" => -123.9615, "type" => "camp", "status" => "planned"],

    // Washington
    ["name" => "Mount Rainier National Park", "lat" => 46.8523, "lng" => -121.7603, "type" => "national_park", "status" => "planned"],
    ["name" => "Olympic National Park", "lat" => 47.9690, "lng" => -123.4980, "type" => "national_park", "status" => "planned"],
    //["name" => "Seattle", "lat" => 47.6062, "lng" => -122.3321, "type" => "city", "status" => "planned"],
    ["name" => "Stevens Pass (Epic)", "lat" => 47.7442, "lng" => -121.0889, "type" => "snow_resort", "status" => "planned"],
    ["name" => "North Cascades National Park", "lat" => 48.7718, "lng" => -121.2985, "type" => "national_park", "status" => "planned"],

    // Canada
    ["name" => "Whistler Blackcomb", "lat" => 50.1138, "lng" => -122.9486, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Glacier National Park of Canada", "lat" => 51.3000, "lng" => -117.5300, "type" => "national_park", "status" => "planned"],
    ["name" => "Yoho National Park", "lat" => 51.4980, "lng" => -116.5119, "type" => "national_park", "status" => "planned"],
    ["name" => "Kootenay National Park", "lat" => 50.9708, "lng" => -116.0365, "type" => "national_park", "status" => "planned"],

    // Montana
    ["name" => "Glacier National Park", "lat" => 48.7596, "lng" => -113.7870, "type" => "national_park", "status" => "planned"],

    // Wyoming
    ["name" => "Yellowstone National Park", "lat" => 44.4280, "lng" => -110.5885, "type" => "national_park", "status" => "planned"],
    ["name" => "Grand Teton National Park", "lat" => 43.7904, "lng" => -110.6818, "type" => "national_park", "status" => "planned"],

    // Idaho
    ["name" => "Craters of the Moon", "lat" => 43.4169, "lng" => -113.5170, "type" => "national_park", "status" => "planned"],

    
    // Utah snowboarding
    ["name" => "Park City Mountain (Epic Pass)", "lat" => 40.6514, "lng" => -111.5070, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Arches National Park", "lat" => 38.7331, "lng" => -109.5925, "type" => "national_park", "status" => "planned"],
    ["name" => "Canyonlands National Park", "lat" => 38.2135, "lng" => -109.9020, "type" => "national_park", "status" => "planned"],

    // Colorado Epic Pass + parks
    ["name" => "Vail Resort", "lat" => 39.6403, "lng" => -106.3742, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Beaver Creek Resort", "lat" => 39.6042, "lng" => -106.5160, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Breckenridge Ski Resort", "lat" => 39.4817, "lng" => -106.0384, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Keystone Resort", "lat" => 39.6061, "lng" => -105.9516, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Crested Butte", "lat" => 38.8991, "lng" => -106.9650, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Rocky Mountain National Park", "lat" => 40.3428, "lng" => -105.6836, "type" => "national_park", "status" => "planned"],
    ["name" => "Black Canyon of the Gunnison", "lat" => 38.5754, "lng" => -107.7416, "type" => "national_park", "status" => "planned"],
    ["name" => "Great Sand Dunes National Park", "lat" => 37.7926, "lng" => -105.5918, "type" => "national_park", "status" => "planned"],

    // Dakotas
    ["name" => "Badlands National Park", "lat" => 43.8554, "lng" => -102.3397, "type" => "national_park", "status" => "planned"],
    ["name" => "Wind Cave National Park", "lat" => 43.5567, "lng" => -103.4790, "type" => "national_park", "status" => "planned"],

    // End
    ["name" => "Sidney Ohio", "lat" => 40.2842, "lng" => -84.1555, "type" => "end", "status" => "planned"]
];

$response = [
    "name" => "Gav West Coast Master Route",
    "points" => $stops
];

echo json_encode($response);
