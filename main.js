$(function() {

	var action;
	var h = $('#h');
	var m = $('#m');


	m.on('blur', function() {
		var self = $(this);
		var cv = parseInt(self.val());
		if(cv < 0){
			cv = 0;
		}
		if(cv>60){
			cv = 60;
		}
		self.val(cv);
	});

	h.on('blur', function() {
		var self = $(this);
		var cv = parseInt(self.val());
		if(cv < 0){
			cv = 0;
		}
		self.val(cv);
	});


	$(".number-spinner button").mousedown(function (e) {
		var btn = $(this);
		var input = btn.closest('.number-spinner').find('input');
		var cv = parseInt(input.val());

		btn.closest('.number-spinner').find('button').prop("disabled", false);

		if (btn.attr('data-dir') == 'up') {
			action = setInterval(function(){
				cv++;
				if(input.attr('id') == 'm' && cv > 59){
					h.val(parseInt(h.val())+1);
					cv=0;
				}
				input.val(cv);
			}, 50);
		} else {
			action = setInterval(function(){
				var hv = parseInt(h.val());
				cv--;

				if(cv<1){

					if(input.attr('id') == 'm' && hv >0){
						h.val(hv-1);
						cv=59;
					}else{
						cv=0;
						btn.prop("disabled", true);
						clearInterval(action);
					}

				}
				input.val(cv);
			}, 50);
		}
	}).mouseup(function(){
		clearInterval(action);
	}).click(function(e){
		e.preventDefault();
	});
});

