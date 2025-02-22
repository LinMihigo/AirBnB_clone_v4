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
});
