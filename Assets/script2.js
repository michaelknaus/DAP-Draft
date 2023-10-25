function initMap() {
    google.charts.load('current', {
        'packages': ['table', 'map'],
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
        'callback': draw  // Specify the callback function here
    });
}

// google.charts.setOnLoadCallback(draw);

function draw() {
    // Assume this data is similar to the data you had in your spreadsheet
    var geoData = google.visualization.arrayToDataTable([
        ['Lat', 'Lon', 'Name'],
        [46.994019, 15.439837, 'Flughafen Graz']
    ]);

    var geoView = new google.visualization.DataView(geoData);
    geoView.setColumns([0, 1]);

    var table = new google.visualization.Table(document.getElementById('table2'));
    table.draw(geoData, {showRowNumber: false, width: '100%', height: '100%'});

    var map = new google.visualization.Map(document.getElementById('map2'));
    map.draw(geoView, {showTip: true});

    google.visualization.events.addListener(table, 'select', function() {
        map.setSelection(table.getSelection());
    });

    google.visualization.events.addListener(map, 'select', function() {
        table.setSelection(map.getSelection());
    });
}

