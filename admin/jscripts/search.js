var SettingSearch = {

	error_unknown : "",
	
	init: function(settings_search, error_unknown)
	{
		this.error_unknown = error_unknown;
		
		$('#settings_search').bind("submit", this.onSubmit);
		$('#search_results').css('display', 'none');
		
		$('#search').focusin(function() {
			if($('#search').val() == settings_search)
			{
				$('#search').removeClass('search_default');
				$('#search').val('');
			}
		});
		
		$('#search').focusout(function() {
			if($('#search').val() == "")
			{
				$('#search').addClass('search_default');
				$('#search').val(settings_search);
				$("#search_results").css('display', "none");
				$("#group_list").css('display', "");
			}
		});
	},

	onSubmit: function(e)
	{
		e.preventDefault();
		if($('#search').val() != "")
		{
			$.jGrowl('Searching...');
			pars = "module=config-settings&action=change&ajax_search=1&search="+encodeURIComponent($('#search').val());
			$.ajax({
				type: 'get',
				url: "index.php",
				data: pars,
				complete: function (request, status)
				{
					try
					{
						var json = $.parseJSON(request.responseText);
						if(typeof json == 'object')
						{
							if(json.hasOwnProperty("errors"))
							{
								$("div.jGrowl").jGrowl("close");

								$.each(json.errors, function(i, message)
								{
									$.jGrowl('There was an error posting your reply: '+message);
								});
								return false;
							}
						}
					}
					catch(error)
					{
						$('#search_results').css('display', '');
						$('#group_list').css('display', 'none');
						$('#search_results').html(request.responseText);
						loadPeekers();
						$.jGrowl('Done!');
						return false;
					}
				}
			});
		}
	},
};