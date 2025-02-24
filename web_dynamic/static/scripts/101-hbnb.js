$(document).ready(function () {
  let statesObj = {};
  let citiesObj = {};
  let amenitiesObj = {};

  $(document).on('change', 'input[type="checkbox"]', function (e) {
    let id = $(this).data('id');
    let name = $(this).data('name');
    let targetId = '.' + $(this).data('target');

    if (targetId === '.locations') {
      if (e.target.id === 'state_filter' && this.checked) {
        statesObj[id] = name;
      } else {
        delete statesObj[id];
      }

      if (e.target.id === 'city_filter' && this.checked) {
        citiesObj[id] = name;
      } else {
        delete citiesObj[id];
      }

      if (Object.keys(statesObj).length === 0 && Object.keys(citiesObj).length === 0) {
        $(targetId).find('h4').html('&nbsp;');
      } else {
        $(targetId).find('h4').text(Object.values(statesObj).concat(Object.values(citiesObj)).join(', '));
      }
    } else {
      if (this.checked) {
        amenitiesObj[id] = name;
      } else {
        delete amenitiesObj[id];
      }

      if (Object.keys(amenitiesObj).length === 0) {
        $(targetId).find('h4').html('&nbsp;');
      } else {
        $(targetId).find('h4').text(Object.values(amenitiesObj).join(', '));
      }
    }
  });

  // API status check
  $.get('http://localhost:5001/api/v1/status/', function (data) {
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
      url: 'http://localhost:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(amenitiesObj), states: Object.keys(statesObj), cities: Object.keys(citiesObj) }),
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
              <div class="reviews">
                <h2>Reviews <span id="toggle_reviews">show</span></h2>
                <ul class="review-list"></ul>
              </div>
            </article>
          `);
        }
      }
    });
  });

  // Review toggle feature
  $(document).on('click', '#toggle_reviews', function () {
    const reviewList = $('.review-list');
    if ($(this).text() === 'show') {
      $.get('http://localhost:5001/api/v1/reviews/', function (reviews) {
        reviewList.empty();
        for (let review of reviews) {
          reviewList.append(`
            <li>
              <h3>From ${review.user.first_name} ${review.user.last_name} the ${new Date(review.created_at).toLocaleDateString()}</h3>
              <p>${review.text}</p>
            </li>
          `);
        }
        $('#toggle_reviews').text('hide');
      });
    } else {
      reviewList.empty();
      $('#toggle_reviews').text('show');
    }
  });
});
