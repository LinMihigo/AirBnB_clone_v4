$(document).ready(function () {
	let obj = {};

	$(document).on('change', 'input[type="checkbox"]', function () {
		let amenityId = $(this).data('id');
		let amenityName = $(this).data('name')

		if (this.checked) {
			obj[amenityId] = amenityName;
		} else {
			delete obj[amenityId];
		}

		if (obj.length === 0) {
			$('.amenities h4').html('&nbsp');
		} else {
			$('.amenities h4').text(Object.values(obj).join(', '));
		}
	});
});
