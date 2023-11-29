// Javascript file
// in case of errors if the script is broken contact me: aliumer1080@gmail.com

document.getElementById("dropdown").onmouseover = function () {
    document.getElementById("dropdown").style.borderBottomLeftRadius = "0px"
    document.getElementById("dropdown").style.borderBottomRightRadius = "0px"
}
document.getElementById("dropdown").onmouseleave = function () {
    document.getElementById("dropdown").style.borderBottomLeftRadius = "15px"
    document.getElementById("dropdown").style.borderBottomRightRadius = "15px"
}
document.getElementById("search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getParams(document.getElementById('search-input').value, true)
    }
});
function getCurrentLocationAndGeocode() {
    document.getElementById("dropdown-selected").innerText = "Select Location"
    document.getElementById("search-input").value = ""
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getData(latitude, longitude)
            },
            error => {
                showErrorMessage('Geolocation Error: Please allow location to this website.');
            }
        );
    } else {
        showErrorMessage('Geolocation is not supported by this browser.');
    }
}
function dropdownClicked(type) {
    document.getElementById("search-input").value = ""
    if (type == 0) {
        document.getElementById("dropdown-selected").innerText = "Select Location"
        getCurrentLocationAndGeocode()
    }
    else if (type == 1) {
        document.getElementById("dropdown-selected").innerText = "PK - Lahore"
        getParams("Lahore, Pakistan")
    }
    else if (type == 2) {
        document.getElementById("dropdown-selected").innerText = "PK - Karachi"
        getParams("Lahore, Karachi")
    }
    else if (type == 3) {
        document.getElementById("dropdown-selected").innerText = "PK - Islamabad"
        getParams("Lahore, Islamabad")
    }
    else if (type == 4) {
        document.getElementById("dropdown-selected").innerText = "PK - Kala Shah Kaku"
        getParams("KSK, Pakistan")
    }
    else if (type == 5) {
        document.getElementById("dropdown-selected").innerText = "PK - Faisalabad"
        getParams("Faisalabad, Pakistan")
    }
}
function getParams(address, status) {
    if (status == true)
        document.getElementById("dropdown-selected").innerText = "Select Location"
    if (address.trim().length != 0) {
        $.ajax({
            url: `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`,
            method: 'GET',
            success: function (data) {
                data = data[0]
                getData(parseFloat(data.lat), parseFloat(data.lon))
            },
            error: function () {
                showErrorMessage("Address Error: Can't get lat and lon for this address")
            },
        });
    }
}
function getData(lat, lon) {
    $.ajax({
        url: `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&formatted=0&date=${new Date().toLocaleDateString()}`,
        method: 'GET',
        success: function (data) {
            if (data.status == "OK") {
                if (document.getElementById("cards-container").style.display === "none" || document.getElementById("cards-container").style.display === "") {
                    document.getElementById("cards-container").style.display = "flex";
                }
                document.getElementById("td-rise").innerText = data.results.sunrise
                document.getElementById("td-set").innerText = data.results.sunset
                document.getElementById("td-dawn").innerText = data.results.dawn
                document.getElementById("td-dusk").innerText = data.results.dusk
                document.getElementById("td-dl").innerText = data.results.day_length
                document.getElementById("td-sn").innerText = data.results.solar_noon
                document.getElementById("td-tz").innerText = data.results.timezone
                document.getElementById("location").innerText = data.results.timezone
                closeErrorMessage()
            }
            else {
                showErrorMessage("Error: " + data.body)
            }

        },
        error: function () {
            showErrorMessage("Error: Can't get details for this lat and lon.")
        },
    });

    $.ajax({
        url: `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&formatted=0&date=${new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()}`,
        method: 'GET',
        success: function (data) {
            if (data.status == "OK") {
                document.getElementById("tm-rise").innerText = data.results.sunrise
                document.getElementById("tm-set").innerText = data.results.sunset
                document.getElementById("tm-dawn").innerText = data.results.dawn
                document.getElementById("tm-dusk").innerText = data.results.dusk
                document.getElementById("tm-dl").innerText = data.results.day_length
                document.getElementById("tm-sn").innerText = data.results.solar_noon
                document.getElementById("tm-tz").innerText = data.results.timezone
            }
            else {
                showErrorMessage("Error: " + data.body)
            }
        },
        error: function () {
            showErrorMessage("Error: Can't get details for this lat and lon.")
        },
    });
}
function closeErrorMessage() {
    document.getElementById("error-message-container").style.display = "none"
}
function showErrorMessage(message) {
    document.getElementById("message").innerHTML = message
    document.getElementById("error-message-container").style.display = "block"
    if (document.getElementById("cards-container").style.display === "flex") {
        document.getElementById("cards-container").style.display = "none";
    }
}
getCurrentLocationAndGeocode()

