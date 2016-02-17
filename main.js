$(function() {

	function pad(num, size) {
		var str = num + "";
		while (str.length < size) str = "0" + str;
		return str;
	}

	function toHHMMSS(n) {
		var sep = ':',
			n 	= parseFloat(n),
			sss = parseInt((n % 1)*1000),
			hh 	= parseInt(n / 3600);
			n 	%= 3600,
			mm = parseInt(n / 60),
			ss = parseInt(n % 60);
		return pad(hh,2)+sep+pad(mm,2)+sep+pad(ss,2)+'.'+pad(sss,3);
	}

	function shortBytes(bytes) {
		var div = 1024;
		var sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
		if (bytes == 0) return 'n/a';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(div)));
		return (bytes / Math.pow(div, i)).toFixed(1) + '' + sizes[i];
	}

	function thousand(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	var fps_ops = [24000/1001,30000/1001,48000/1001,60000/1001,80,90,120000/1001,240000/1001];
	var times 	= [0.5,1,2,5,10,30,60]
	var jpeg 	= 2097152;

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
		calc();
	});

	h.on('blur', function() {
		var self = $(this);
		var cv = parseInt(self.val());
		if(cv < 0){
			cv = 0;
		}
		self.val(cv);
		calc();
	});

	$('select').on('change', function() {
		calc();
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
		calc();
		clearInterval(action);
	}).click(function(e){
		e.preventDefault();
	});


	function calc(){
		var frames, playback_secs, memory, video_secs;
		var ht 		= parseInt(h.val());
		var mt 		= parseInt(m.val());
		var format 	= parseInt($('#format').val());
		var fps 	= fps_ops[$('#fps').val()];
		var recording_secs = ((ht*60)+mt)*60;

		$('tbody tr').remove();

		for (var i = 0; i < times.length; i++) {
			frames = recording_secs / times[i];
			playback_secs = frames / fps;
			video_secs = frames / fps_ops[1];

			if(format==1){
				memory = (60*125000)*video_secs;
			}else if(format==2){
				memory = (45*125000)*video_secs;
			}else{
				memory = frames*jpeg;
			}
			$('tbody').append('<tr><td>'+times[i]+'</td><td>'+thousand(frames)+'</td><td>'+toHHMMSS(playback_secs)+'</td><td>'+shortBytes(memory)+'</td></tr>');
		}
	}

	calc();
});

