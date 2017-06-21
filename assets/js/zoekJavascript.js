let Search = {
	init: function() {
		this._setEventHandler();
	},

	search: function() {
		let qry = this.Gui.getQueryString();

		$.ajax({
			method: 'GET',
			url: '/zoek_resultaten.html?query=' + qry,
			complete: function(xhr) {
				let eDiv = document.getElementById('search_results');

				eDiv.innerHTML = xhr.responseText;
			}
		})
	},

	_setEventHandler: function() {
		let fSearch = document.getElementById('form-search');

		fSearch.addEventListener('submit', function(e) {
			e.preventDefault();

			Search.search();
		});
	},

	Gui: {
		getQueryString: function() {
			let iSearch = document.getElementById('querystring');

			return iSearch.value;
		}
	}
};

Core.logoutbutton();