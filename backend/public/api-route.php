<?php
require_once __DIR__ . '/cors.php';

$stopsFile = __DIR__ . '/../data/stops.json';

$stops = file_exists($stopsFile)
    ? json_decode(file_get_contents($stopsFile), true)
    : [];

$response = [
    "name" => "Gav West Coast Master Route",
    "points" => $stops
];

echo json_encode($response);


/*
untouched default list
$stops = [
    ["name" => "Anniston Alabama", "lat" => 33.6598, "lng" => -85.8316, "type" => "start", "status" => "visited"],
    ["name" => "Strokin Diesel", "lat" => 33.9749, "lng" => -86.4481, "type" => "shop", "status" => "visited"],
    // Texas / New Mexico / Arizona
    ["name" => "Palo Duro Canyon", "lat" => 34.9370, "lng" => -101.6460, "type" => "national_park", "status" => "planned"],
    ["name" => "Santa Fe", "lat" => 35.6870, "lng" => -105.9378, "type" => "city", "status" => "planned"],
    // Added monument
    ["name" => "Chaco Culture National Historical Park", "lat" => 36.0580, "lng" => -107.9557, "type" => "monument", "status" => "skipped"],
    ["name" => "Petrified Forest National Park", "lat" => 35.0650, "lng" => -109.7763, "type" => "national_park", "status" => "planned"],
    // Flagstaff monuments
    ["name" => "Walnut Canyon National Monument", "lat" => 35.1708, "lng" => -111.5021, "type" => "monument", "status" => "planned"],
    ["name" => "Sunset Crater Volcano National Monument", "lat" => 35.3710, "lng" => -111.5082, "type" => "monument", "status" => "skipped"],
    ["name" => "Wupatki National Monument", "lat" => 35.5753, "lng" => -111.3755, "type" => "monument", "status" => "skipped"],
    ["name" => "Grand Canyon National Park", "lat" => 36.1069, "lng" => -112.1129, "type" => "national_park", "status" => "planned"],
    // Utah cluster
    ["name" => "Zion National Park", "lat" => 37.2982, "lng" => -113.0263, "type" => "national_park", "status" => "planned"],
    ["name" => "Bryce Canyon National Park", "lat" => 37.5930, "lng" => -112.1871, "type" => "national_park", "status" => "planned"],
    // Mojave (recreation area)
    ["name" => "Mojave National Preserve", "lat" => 35.0120, "lng" => -115.4730, "type" => "recreation_area", "status" => "skipped"],
    // Nevada → Eastern California
    ["name" => "Great Basin National Park", "lat" => 38.9832, "lng" => -114.2190, "type" => "national_park", "status" => "planned"],
    ["name" => "Death Valley National Park", "lat" => 36.5054, "lng" => -117.0794, "type" => "national_park", "status" => "planned"],
    // Sierra Nevada block
    ["name" => "Sequoia National Park", "lat" => 36.4864, "lng" => -118.5658, "type" => "national_park", "status" => "planned"],
    ["name" => "Kings Canyon National Park", "lat" => 36.8879, "lng" => -118.5551, "type" => "national_park", "status" => "planned"],
    ["name" => "Yosemite National Park", "lat" => 37.8651, "lng" => -119.5383, "type" => "national_park", "status" => "planned"],
    ["name" => "Half Dome Viewpoint", "lat" => 37.7459, "lng" => -119.5332, "type" => "viewpoint", "status" => "planned"],
    // Tahoe block
    ["name" => "Kirkwood Mountain Resort", "lat" => 38.6848, "lng" => -120.0658, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Heavenly Ski Resort", "lat" => 38.9358, "lng" => -119.9390, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Northstar California Resort", "lat" => 39.2747, "lng" => -120.1218, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Lake Tahoe Scenic Camp", "lat" => 39.0968, "lng" => -120.0324, "type" => "camp", "status" => "planned"],
    // Northern California → Oregon
    ["name" => "Lassen Volcanic National Park", "lat" => 40.4977, "lng" => -121.4207, "type" => "national_park", "status" => "planned"],
    // Recreation area
    ["name" => "Whiskeytown-Shasta-Trinity NRA", "lat" => 40.6460, "lng" => -122.6070, "type" => "recreation_area", "status" => "planned"],
    ["name" => "Redwood National Park", "lat" => 41.2132, "lng" => -124.0046, "type" => "national_park", "status" => "planned"],
    ["name" => "Crescent City", "lat" => 41.7558, "lng" => -124.2017, "type" => "city", "status" => "planned"],
    ["name" => "Oregon Dunes National Recreation Area", "lat" => 43.8240, "lng" => -124.1370, "type" => "recreation_area", "status" => "planned"],
    ["name" => "Cannon Beach", "lat" => 45.8918, "lng" => -123.9615, "type" => "camp", "status" => "planned"],
    // Washington
    ["name" => "Olympic National Park", "lat" => 47.9690, "lng" => -123.4980, "type" => "national_park", "status" => "planned"],
    ["name" => "Mount Rainier National Park", "lat" => 46.8523, "lng" => -121.7603, "type" => "national_park", "status" => "planned"],
    ["name" => "Stevens Pass (Epic)", "lat" => 47.7442, "lng" => -121.0889, "type" => "snow_resort", "status" => "planned"],
    // WA monument/recreation
    ["name" => "Mount Baker–Snoqualmie National Forest", "lat" => 48.7766, "lng" => -121.8143, "type" => "recreation_area", "status" => "skipped"],
    ["name" => "North Cascades National Park", "lat" => 48.7718, "lng" => -121.2985, "type" => "national_park", "status" => "planned"],
    // Canada loop
    ["name" => "Whistler Blackcomb", "lat" => 50.1138, "lng" => -122.9486, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Glacier National Park of Canada", "lat" => 51.3000, "lng" => -117.5300, "type" => "national_park", "status" => "planned"],
    ["name" => "Yoho National Park", "lat" => 51.4980, "lng" => -116.5119, "type" => "national_park", "status" => "planned"],
    ["name" => "Kootenay National Park", "lat" => 50.9708, "lng" => -116.0365, "type" => "national_park", "status" => "planned"],
    // USA Montana / Wyoming / Idaho
    ["name" => "Glacier National Park", "lat" => 48.7596, "lng" => -113.7870, "type" => "national_park", "status" => "planned"],
    // Montana monument
    ["name" => "Little Bighorn Battlefield National Monument", "lat" => 45.5652, "lng" => -107.4309, "type" => "monument", "status" => "skipped"],
    ["name" => "Yellowstone National Park", "lat" => 44.4280, "lng" => -110.5885, "type" => "national_park", "status" => "planned"],
    // Parkway (monument type)
    ["name" => "John D Rockefeller Memorial Parkway", "lat" => 44.1224, "lng" => -110.6743, "type" => "monument", "status" => "skipped"],
    ["name" => "Grand Teton National Park", "lat" => 43.7904, "lng" => -110.6818, "type" => "national_park", "status" => "planned"],
    ["name" => "Craters of the Moon", "lat" => 43.4169, "lng" => -113.5170, "type" => "national_park", "status" => "skipped"],
    // Park City BEFORE Colorado
    ["name" => "Park City Mountain (Epic Pass)", "lat" => 40.6514, "lng" => -111.5070, "type" => "snow_resort", "status" => "planned"],
    // Southern Utah monuments
    ["name" => "Hovenweep National Monument", "lat" => 37.3833, "lng" => -109.0703, "type" => "monument", "status" => "skipped"],
    ["name" => "Arches National Park", "lat" => 38.7331, "lng" => -109.5925, "type" => "national_park", "status" => "planned"],
    ["name" => "Canyonlands National Park", "lat" => 38.2135, "lng" => -109.9020, "type" => "national_park", "status" => "planned"],
    // Colorado (north to south)
    ["name" => "Black Canyon of the Gunnison", "lat" => 38.5754, "lng" => -107.7416, "type" => "national_park", "status" => "planned"],
    ["name" => "Crested Butte", "lat" => 38.8991, "lng" => -106.9650, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Beaver Creek Resort", "lat" => 39.6042, "lng" => -106.5160, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Vail Resort", "lat" => 39.6403, "lng" => -106.3742, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Breckenridge Ski Resort", "lat" => 39.4817, "lng" => -106.0384, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Keystone Resort", "lat" => 39.6061, "lng" => -105.9516, "type" => "snow_resort", "status" => "planned"],
    ["name" => "Great Sand Dunes National Park", "lat" => 37.7926, "lng" => -105.5918, "type" => "national_park", "status" => "planned"],
    // If Alabama return
    ["name" => "Anniston Alabama", "lat" => 33.650051, "lng" => -85.775558, "type" => "end", "status" => "planned"],
    // If Ohio return
    ["name" => "Rocky Mountain National Park", "lat" => 40.3428, "lng" => -105.6836, "type" => "national_park", "status" => "skipped"],
    ["name" => "Wind Cave National Park", "lat" => 43.5567, "lng" => -103.4790, "type" => "national_park", "status" => "skipped"],
    ["name" => "Badlands National Park", "lat" => 43.8554, "lng" => -102.3397, "type" => "national_park", "status" => "skipped"],
    ["name" => "Sidney Ohio", "lat" => 40.2842, "lng" => -84.1555, "type" => "end", "status" => "skipped"]
];
*/