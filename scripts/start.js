/*
window.Bringer = {
	lang: {
		ru: {
			integration: 'Интеграция',
			marketplace: 'Маркетплейс',
			apikey: 'API ключ',
			savemsg: 'Успешно сохранено'
		},
		en: {
			integration: 'Integration',
			marketplace: 'Marketplace',
			apikey: 'API key',
			savemsg: 'Saved successfully'
		}
	},
	currentLang: null,
	token: null,
	prefix: null,
	opacity: true,
	last: null,
	construct: function() {
	    this.currentLang = this.tools.matchUri('retailcrm.ru') ? 'ru' : 'en';
	    this.prefix = window.location.host;
	    if (this.last != window.location.href) {
            this.last = window.location.href;
	    } else {
	    	return false;
	    }

	    chrome.storage.local.get(
			window.Bringer.prefix + '_br',
			function(result){
				if (result[window.Bringer.prefix + '_br']){
					window.Bringer.token = result[window.Bringer.prefix + '_br'];
				}
			}
		);

		if (this.tools.matchUri('analytics')) {
		} else if (this.tools.matchUri('admin')) {
			$('html').css({'opacity': 0});
			this.admin.construct();
		} else if (this.tools.matchUri('edit') || this.tools.matchUri('orders')) {
		}

		var open = false;
		setInterval(function() {
			if (open && $(document).find('#available-deliveries .modern-table tr:visible').length > 0) {
				$(document).find('#available-deliveries .modern-table tr:eq(1) > td:first').click();
				$(document).find('#intaro_crmbundle_ordertype_customFields_avt').prop("checked", false);
				open = false;
				$(document).find('#opnone').remove();//console.log("OUT");
				$(document).find('.deliveries-popup-open.add-input-link').parent('.input-group').removeClass('double_widget').removeClass('loading');
				$(document).find('.deliveries-popup-open.add-input-link').parent('.input-group').find('.double_widget_btn.border-box').remove();
			}

			if (
				!open &&
				$(document).find('#intaro_crmbundle_ordertype_customFields_avt:checked').length > 0 &&
				parseInt($(document).find('#intaro_crmbundle_ordertype_deliveryType >option:selected').val()) == 3 &&
						$("#intaro-crm-deliveries a.deliveries-popup-open").get(0)
			) {
				if ($(document).find('#intaro_crmbundle_ordertype_weight').length > 0 && parseInt($(document).find('#intaro_crmbundle_ordertype_weight').val()) > 0) {
					if ($(document).find('#intaro_crmbundle_ordertype_deliveryAddress_index').length > 0 && $(document).find('#intaro_crmbundle_ordertype_deliveryAddress_index').val() != "") {
						$(document).find('.deliveries-popup-open.add-input-link').parent('.input-group').addClass('double_widget').addClass('loading');
						$(document).find('.deliveries-popup-open.add-input-link').after('<a href="javascript:void(0);" style="margin-left: 10px;" class="double_widget_btn border-box"><span> </span></a>');

						var script = document.createElement('script');
		                script.textContent = 'setTimeout(function() { $(document).find("#intaro-crm-deliveries .deliveries-popup-open.add-input-link").click(); }, 1000);';
		                (document.head||document.documentElement).appendChild(script);

		                var stile = document.createElement('style');
		                stile.id = "opnone";//console.log("IN");
		                stile.textContent = '.stat-box-wrapper.stat-box-wrapper-abs, .stat-box-popup-bg {opacity: 0;} html {overflow-y: auto !important;}';
		                stile.textContent = '';
		                (document.head||document.documentElement).appendChild(stile);
						open = true;
					} else {
						$(document).find('#intaro_crmbundle_ordertype_customFields_avt').prop("checked", false);
                        alert("Не удалось автоматически выбрать тариф. Не указан Индекс доставки. Автоматический выбор отключен!");
					}
				} else {
                    $(document).find('#intaro_crmbundle_ordertype_customFields_avt').prop("checked", false);
                    alert("Не удалось автоматически выбрать тариф. Не указан Вес заказа. Автоматический выбор отключен!");
				}
			}
		}, 100);

	},
	initJs: function(type) {
		chrome.storage.local.get(
			window.Bringer.prefix + '_br',
			function(result) {
				if (result[window.Bringer.prefix + '_br']){
					chrome.runtime.sendMessage({
		                   action: 'bringer',
		                   url: 'https://bringer.pro/plus/plugin/' + type + '/js/' + result[window.Bringer.prefix + '_br'],
		                   method: 'GET'
		            }, function(data) {
		                if (data.success && data.js) {
		                	eval(data.js);
		                }
		            });
				}
			}
		);
	},
	admin: {
		construct: function() {
			$(document).ready(function() {
				var link = $('.private-main-menu-integration > span > a');
				link.attr('href', link.attr('href') + '?btab=bringer');
			});

			if (window.Bringer.tools.matchPath('admin/integration/') || window.Bringer.tools.matchPath('admin/api-keys')) {
				window.Bringer.opacity = false;
				window.Bringer.admin.integration.list.construct();
			} else if (window.Bringer.tools.matchUri('users') && window.Bringer.tools.matchUri('new')) {
			    window.Bringer.initJs('usersnew');
			} else if (window.Bringer.tools.matchUri('users') && window.Bringer.tools.matchUri('edit')) {
			    window.Bringer.initJs('usersedit');
			} else if (window.Bringer.tools.matchUri('users')) {
			    window.Bringer.initJs('users');
			} else if (window.Bringer.tools.matchUri('groups') && window.Bringer.tools.matchUri('new')) {
			    window.Bringer.initJs('groupsnew');
			} else if (window.Bringer.tools.matchUri('groups') && window.Bringer.tools.matchUri('edit')) {
			    window.Bringer.initJs('groupsedit');
			} else if (window.Bringer.tools.matchUri('groups')) {
			    window.Bringer.initJs('groups');
			} else if (window.Bringer.tools.matchUri('sites') && window.Bringer.tools.matchUri('new')) {
			    window.Bringer.initJs('sitesnew');
			} else if (window.Bringer.tools.matchUri('sites') && window.Bringer.tools.matchUri('edit')) {
			    window.Bringer.initJs('sitesedit');
			} else if (window.Bringer.tools.matchUri('sites')) {
			    window.Bringer.initJs('sites');
			} else if (window.Bringer.tools.matchUri('legal-entity') && window.Bringer.tools.matchUri('new')) {
			    window.Bringer.initJs('legalentitynew');
			} else if (window.Bringer.tools.matchUri('legal-entity') && window.Bringer.tools.matchUri('edit')) {
			    window.Bringer.initJs('legalentityedit');
			} else if (window.Bringer.tools.matchUri('legal-entity')) {
			    window.Bringer.initJs('legalentity');
			} else if (window.Bringer.tools.matchUri('stores') && window.Bringer.tools.matchUri('new')) {
			    window.Bringer.initJs('storesnew');
			} else if (window.Bringer.tools.matchUri('stores') && window.Bringer.tools.matchUri('edit')) {
			    window.Bringer.initJs('storesedit');
			} else if (window.Bringer.tools.matchUri('stores')) {
			    window.Bringer.initJs('stores');
			}
		},
		integration: {
			list: {
				initForm: function(button) {
					$('.m-box.form form').append(button);
					$('.m-box.form form .cl').remove();
					$('.save-box.save-box_with-btns .wrapper').append(
					    '<div class="ft-lt"></div><div class="save-box__msg" style="display: none;"><i class="icon"></i><span class="text">' + window.Bringer.lang[window.Bringer.currentLang].savemsg + '</span><button type="button" class="save-box__close">×</button></div><div class="cl"></div>'
					);

					$('.m-box.form form .back').attr('href', '/admin/integration/bringer');

					$('.m-box.form form .btn__block button').on('click', function() {
						if ($('.m-box.form form .btn__block button[clicked=true][name=saveAndBackBtn]').length < 1) {
							$('.m-box.form form .btn__block button').removeAttr('clicked');
						    $(this).attr('clicked', true);
						}
					});

					$('.m-box.form form').on('submit', function(e){
			            e.preventDefault();

			            var form = $(this).serializeArray();
			            var objectSave = {};
			            form.forEach(function(value) {
			            	if (value.name.indexOf('_br') >= 0) {
			            		objectSave[window.Bringer.prefix + value.name] = value.value;
			            	}
			            });

			            chrome.storage.local.set(objectSave, function() {
						  	  if ($('.m-box.form form .btn__block button[clicked=true][name=saveAndBackBtn]').length > 0) {
						  	    window.location = '/admin/integration/bringer';
						  	  }

						      $('.save-box.save-box_with-btns').addClass('saved');
						      $('.save-box.save-box_with-btns .save-box__msg').show();
						      $('.m-box.form form .btn__block button').removeAttr('clicked');

						      setTimeout(function () {
						      	$('.save-box.save-box_with-btns').removeClass('saved');
						      	$('.save-box.save-box_with-btns .save-box__msg').hide();
						      }, 5000);
						  })

			            return false;
			        });
				},
				construct: function() {
					if (window.Bringer.tools.matchPath('/bringer/bringer-')) {
						window.location = '/admin/integration/calltracking/call_touch?btab=bringer&bsub=bringer-' + window.Bringer.tools.getSubByPath();
					} else if (window.Bringer.tools.matchPath('/bringer')) {
			            window.location = '/admin/integration/list?btab=bringer';
			        } else if (window.Bringer.tools.issetQueryByName('btab')) {
			            window.history.replaceState(null, 'Bringer+ / ' + $('title').html(), '/admin/integration/bringer' + (window.Bringer.tools.issetQueryByName('bsub') ? '/' + window.Bringer.tools.getQueryByName('bsub') : ''));
			        }

			        $(document).ready(function() {
			        	$('.sub-nav-top > .container > .m-tabs').prepend(
							'<li id="bringer-tab"><a id="tab-collector" href="/admin/integration/list?btab=bringer"><span>Bringer+</span></a></li>'
				    	);

			        	if (window.Bringer.tools.issetQueryByName('btab') || window.Bringer.tools.matchPath('/bringer')) {
			        		$('#bringer-tab').addClass('active').siblings().removeClass('active');
			        		$('title').html($('title').html().replace(window.Bringer.lang[window.Bringer.currentLang].marketplace, 'Bringer+'));

			        		if (window.Bringer.tools.matchPath('/bringer/bringer-')) {
			        			$('.bread-crumb a').each(function(){
			        				if ($(this).html().trim() == window.Bringer.lang[window.Bringer.currentLang].marketplace) {
			        					$(this).html('Bringer+');
			        					$(this).attr('href', '/admin/integration/bringer');
			        				}
			        			});

			        			var button = $('.m-box.form .save-box')[0];
			        			$('form').remove();

			        			switch(window.Bringer.tools.getSubByPath()) {
								  case 'plus':
								  	  $('h1').html('Bringer+');
								  	  $('.m-box.form').append(
								  	  	  '<form action="/admin/integration/bringer/bringer-plus" method="post" id="bringer-plus" class="crud form-horizontal safe-trans"><fieldset id="section-main"><div class="control-group"><label class="control-label required" for="bringerplus_apikey"><span>' + window.Bringer.lang[window.Bringer.currentLang].apikey + '</span></label><div class="controls"><input type="text" id="bringerplus_apikey" name="_br" required="required" value="' + (window.Bringer.token == null ? '' : window.Bringer.token) + '"></div></div></fieldset></form>'
								  	  );
								  	  window.Bringer.admin.integration.list.initForm(button);
								  	  window.Bringer.opacity = true;
						              $('html').css({'opacity': 1});
								      break;
								  default:
								      if (window.Bringer.token != null) {
					        	    	chrome.runtime.sendMessage({
							                   action: 'bringer',
							                   url: 'https://bringer.pro/plus/plugin/integration/form/' + window.Bringer.tools.getSubByPath() + '/' + window.Bringer.token,
							                   method: 'GET'
							            }, function(data) {
							                if (data.success) {
							                	if (data.title) {
							                		$('h1').html(data.title);
							                	}

							                	if (data.form) {
							                		$('.m-box.form').append(data.form);
							                	}

							                	if (data.variables) {
							                		data.variables.forEach(function(value) {
													  chrome.storage.local.get(
															window.Bringer.prefix + value,
															function(result){
																if (result[window.Bringer.prefix + value]){
																	$('input[name=' + value + ']').val(result[window.Bringer.prefix + value]);
																}
															}
														);
													});
							                	}

							                	window.Bringer.admin.integration.list.initForm(button);
							                }
							                window.Bringer.opacity = true;
							                $('html').css({'opacity': 1});
							            });
					        	    }
								  	break;
								}
			        		} else {
			        			$('h1').html('Bringer+');

			        			$('.integration__list > li').remove();
				        		$('.integration__list').append(
				        			'<li id="bringer-plus" class="integration__item"><label class="integration__label">' + window.Bringer.lang[window.Bringer.currentLang].integration + '</label><ul class="integration__checks checks_logos"><li class="checks_logos__item"><a href="/admin/integration/bringer/bringer-plus" title="Bringer+" class="checks_logos__label' + (window.Bringer.token == null ? '' : ' checks_logos__label_active') + '"><img alt="Bringer+" class="checks_logos__img" src="https://bringer.pro/svg/logo.svg"><span class="checks_logos__title">Bringer+<i class="checks_logos__icon"></i></span></a></li></ul></li>'
				        	    );

				        	    if (window.Bringer.token != null) {
				        	    	chrome.runtime.sendMessage({
						                   action: 'bringer',
						                   url: 'https://bringer.pro/plus/plugin/integration/list/' + window.Bringer.token,
						                   method: 'GET'
						            }, function(data) {
						                if (data.success) {
						                	if (data.content) {
						                		$('.integration__list').append(data.content);
						                	}
						                	if (data.variables) {
						                		$.each(data.variables, function(code, value) {
												    chrome.storage.local.get(
														window.Bringer.prefix + value,
														function(result){
															if (result[window.Bringer.prefix + value]){
																$('#bringer-' + code + ' .checks_logos__label').addClass('checks_logos__label_active');
															}
														}
													);
												});
						                	}
						                }
						                window.Bringer.opacity = true;
						                $('html').css({'opacity': 1});
						            });
				        	    } else {
				        	    	window.Bringer.opacity = true;
						            $('html').css({'opacity': 1});
				        	    }
			        		}
			        	} else {
			        		window.Bringer.opacity = true;
				        	$('html').css({'opacity': 1});
				        }
					});
				}
			}
		}
	},
	tools: {
		matchUri: function(path) {
			return window.location.href.indexOf(path) >= 0;
		},
		matchPath: function(path) {
			return window.location.pathname.indexOf(path) >= 0;
		},
		matchQuery: function(path) {
			return window.location.search.indexOf(path) >= 0;
		},
		replaceState: function(url) {
            window.history.replaceState(null, window.Jivo.title, url);
		},
		issetQuery: function(query) {
			var querys = decodeURIComponent(window.location.search).replace(/^[\?]/g, '');
			if (querys.length > 0) {
                querys = querys.split('&');
            }

            return querys.indexOf(query) != -1
		},
		issetQueryByName: function(name) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            results = regex.exec(decodeURIComponent(window.location.search));

            return !results ? false : true;
		},
		getSubByPath()
		{
			var regex = new RegExp("/bringer/bringer-(.*)");
			results = regex.exec(decodeURIComponent(window.location.pathname));

			return !results[1] ? '' : decodeURIComponent(results[1]);
		},
		getQueryByName: function(name) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            results = regex.exec(decodeURIComponent(window.location.search));

            return !results[2] ? '' : decodeURIComponent(results[2].replace(/\+/g, " "));
		},
		addQuery: function(query) {
            return this.addQueryByString(query, window.location.search);
		},
		addQueryByString: function (query, string) {
			var new_querys = [];
			var querys = string.replace(/^[\?]/g, '');
            if (querys.length > 0) {
                new_querys = querys.split('&');
            }

            if (new_querys.indexOf(query) == -1) {
                new_querys.push(query);
            }

            return '?' + new_querys.join('&');
		},
		removeQuery: function(query) {
			return this.removeQueryByString(query, window.location.search);
		},
		removeQueryByString: function (query, string) {
            var querys = string.replace(/^[\?]/g, '');
			if (querys.length == 0) {
				return '';
		    }

		    querys = querys.split('&');
		    var pos = 0;
		    if ((pos = querys.indexOf(query)) != -1) {
                querys.splice(pos, 1);
		    }

		    if (querys.length > 0) {
                return '?' + querys.join('&');
		    }

		    return '';
		},
		getQueryByUri: function (uri) {
			uri = uri.split('?');
			if (uri.length == 1) {
                return '';
			}

			uri.splice(0, 1);

			return '?' + uri.join('&');
		}
	}
}

jQuery.fn.simulateClick = function() {
    return this.each(function() {
        if('createEvent' in document) {
            var doc = this.ownerDocument,
                evt = doc.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(evt);
        } else {
            this.click(); // IE Boss!
        }
    });
}

window.Bringer.construct();
*/

function calculate_dimensions(){
	var oder_size={length:0,width:0,height:0};
	var pack_addition=30;
	var items=[];

	$("div.order-products-table-box td.product-position.properties-td span.additional.edit").each(function(){
		var _prop=$.trim($(this).find('>span').html());
		if(_prop=="габариты (ДxШxВ)"){
			var _tmp=$.trim($(this).html().split("</span>")[1]);
			_tmp=_tmp.split("x");
			var qtt=parseInt($("#intaro_crmbundle_ordertype_orderProducts_"+$(this).parent().parent().attr("data-order-product-index")+"_quantity").val());
			for(var i=0;i<qtt;i++){
				items[items.length]={length:parseInt(_tmp[0]),width:parseInt(_tmp[1]),height:parseInt(_tmp[2])};
			}
		}
	});


	for(var i=0;i<items.length;i++){
		oder_size.height+=items[i].height;

		if(items[i].width>oder_size.width){
			oder_size.width=items[i].width;
		}
		if(items[i].length>oder_size.length){
			oder_size.length=items[i].length;
		}
	}

	oder_size.length+=pack_addition;
	oder_size.width+=pack_addition;
	oder_size.height+=pack_addition;

	$("#intaro_crmbundle_ordertype_length").val(oder_size.length);
	$("#intaro_crmbundle_ordertype_width").val(oder_size.width);
	$("#intaro_crmbundle_ordertype_height").val(oder_size.height);
}

function calculate_dimensions_from_box(_elem){

	var str = $(_elem).html();

	var dem = str.match(/№[0-9]+ \(([0-9]+)×([0-9]+)×([0-9]+)\)/);

	if(dem && dem.length==4){

		$("#intaro_crmbundle_ordertype_length").val(dem[1]);
		$("#intaro_crmbundle_ordertype_width").val(dem[2]);
		$("#intaro_crmbundle_ordertype_height").val(dem[3]);
	}


}

function calculate_extra_shipping_price(){
	if($('div.order-compos').length) {
		var cod_coeff = 0.20;

		if(!$('#extra_cost_container').length && $('label[for="intaro_crmbundle_ordertype_deliveryNetCost"]').length){
			$('label[for="intaro_crmbundle_ordertype_deliveryNetCost"]').parent().append('<span id="extra_cost_container" style="float: left"><div class="fs13 static" style="float: left;line-height: 30px;padding: 0 6px">+'+(cod_coeff*100)+'% за НП =</div><div class="gray-bg fs13 static"><span id="extra_cost_value">0</span>&nbsp;<span class="currency-symbol rub">Р</span> </div></span>');
		}


		if ($('label[for="intaro_crmbundle_ordertype_deliveryNetCost"]+div.order-delivery-cost__value-static').length) {
			var shipping_price = parseFloat($('label[for="intaro_crmbundle_ordertype_deliveryNetCost"]+div.order-delivery-cost__value-static').html().split("&nbsp;<")[0].replace(/&nbsp;/g, ""));
			var goods_price = parseFloat($('#patch-total-info>div.pb5:first-child span.value').html().split("&nbsp;<")[0].replace(/&nbsp;/g, ""));
			var extra_shipping_price = shipping_price + Math.round(cod_coeff * goods_price);
		} else {
			extra_shipping_price = 0;
		}

		$('#extra_cost_value').html(extra_shipping_price);
	}
}

function cod_is_active(){
	return $('div.payment[data-type-id="6"]').length;
}



//controls dropdown no-set add-payment-type up active


$(document).ready(function() {
/*
	if (window.Bringer.opacity) {
		$('html').css({'opacity': 1});
	}
*/
	$(document).delegate('#calculate-weight-btn', 'click', function() {
		calculate_dimensions();

	});

/*	$(document).delegate('#intaro_crmbundle_ordertype_customFields_usual_package', 'click', function() {
		calculate_dimensions_from_box();
	});*/

	$(document).delegate('#intaro_crmbundle_ordertype_customFields_usual_package_chosen li.active-result', 'click', function() {
		calculate_dimensions_from_box(this);
	});

	$('body').append( '<style>#calculate-weight-btn:after{content:" и габариты"}</style>' );

	setInterval(calculate_extra_shipping_price, 2000);


});