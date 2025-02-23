$(document).ready(function () {
    let obj = {};

    $(document).on('change', 'input[type="checkbox"]', function () {
        let amenityId = $(this).data('id');
        let amenityName = $(this).data('name');

        if (this.checked) {
            obj[amenityId] = amenityName;
        } else {
            delete obj[amenityId];
        }

        if (Object.keys(obj).length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            $('.amenities h4').text(Object.values(obj).join(', '));
        }
    });

    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    }).fail(function () {
        $('#api_status').removeClass('available');
    });

    // Handle search button click
    $('button').click(function () {
        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: JSON.stringify({ amenities: Object.keys(obj) }),
            success: function (places) {
                $('.places').empty();
                for (let place of places) {
                    $('.places').append(`
                        <article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest(s)</div>
                                <div class="number_rooms">${place.number_rooms} Room(s)</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>
                            </div>
                            <div class="description">${place.description}</div>
                        </article>
                    `);
                }
            }
        });
    });
});
