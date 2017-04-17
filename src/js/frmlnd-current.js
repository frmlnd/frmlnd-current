(function ($) {
 
    //var exchangeRatesUrl = 'http://api.fixer.io/latest';
	var current;
    var settings;

    $.fn.current = function(options) {
        
        // Plugin default settings
        settings = $.extend({
            api: null,
            base: 'USD',
            currencies: [
                'EUR',
                'JPY',
                'CNY'
            ],
			accuracy: 2
        }, options);

        if (!current) {
            $.getJSON(settings.api)
                .done(function(json) {
                    current = json;
                    current.rates[current.base] = 1;
                })
                .fail(function(jqxhr, textStatus, error) {
                    console.log('ERROR: ' + error);
                });
        }
        
        return $(this).each(function() {

            var element = this;

            $(element).addClass('crrnt-base');
            
            if ($(element).hasClass('click')) {

                $(element).css('cursor','pointer');
                $(element).click(function() {
                    showTooltip(element).then(function() {
                        setTimeout(function() {
                            $('body').click(function(e) {
                                hideTooltip();
                                $(this).unbind('click');
                            });
                        }, 500);
                    });
                });

			} else if ($(element).hasClass('inline')) {

				var side = document.createElement('span'),
					html = '';
				
				setTimeout(function() {				
					getConversions(element).then(function(data) {
						for (var i=0; i<data.length; i++) {
							html = $("<span></span>").html(data[i]);
							html.addClass('crrnt-currency');
							$(element).after(html);
						}
					});
				}, 500);

            } else {

                // Set hover behaviors for our currency elements
                $(element).hover(

                    // Hover over
                    function() {
                        hideTooltip();
                        $(element).css('cursor','help');
                        showTooltip(element);
                    },
                    
                    // Hover out
                    function() {
                        hideTooltip();
                    }
                );
            }
        });
    };

    function showTooltip(target) {
        var deferred = new $.Deferred(),
			html = '',
			conversions = getConversions(target),
			numConversions = 0,
			line = '';

		conversions.then(function(data) {
			$(target).css('position', 'relative');

			html = $('<span />', { 
				class: 'crrnt-tooltip'
			}).insertAfter($(target));

			numConversions = data.length;
			if (data && numConversions > 0) {
				for (var i=0; i<numConversions; i++) {

					line = $('<span />', {
						class: 'crrnt-line'
					}).html(data[i] + '<br>').appendTo(html);
				}

				$(target).append(html);
				$('.crrnt-tooltip').css('top', -(parseInt($('.crrnt-tooltip').css('top')) + $('.crrnt-tooltip').height()));        

				deferred.resolve();
			
			} else {
				$('.crrnt-tooltip').hide();
			}
		});

        return deferred.promise();
    }

    function hideTooltip() { 
        $('.crrnt-tooltip').remove();
    }

	function getConversions(target) {
		var deferred = new $.Deferred(),
			amount = null,
			currencyCodes,
			base = '',
			code = '',
			rate = 0,
			newAmount = 0,
			temp = 0,
			partArray = null, 
			conversions = [];

        // Parse the currency into a decimal
        amount = Number($(target).text().replace(/[^0-9\.]+/g,""));
		console.log($(target));

		// Make sure we don't have a parse error 
        if (amount != 'NaN' && amount != 'undefined') {
            
            currencyCodes = ($(target).data('crrnt-currencies') !== undefined) ? 
				$(target).data('crrnt-currencies').split(',') : settings.currencies;

            // Loop through selected currency codes and grab the rates 
            for (var i=0; i<currencyCodes.length; i++) {

                base = ($(target).data('crrnt-base') !== undefined) ? $(target).data('crrnt-base') : settings.base;

                code = currencyCodes[i];
                rate = getRate(base, code);

                newAmount = ((amount * rate) * 10) / 10;
                temp = parseFloat(newAmount).toFixed(settings.accuracy);
                partArray = temp.toString().split("."); 
                partArray[0] = partArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 

				conversions.push(getCurrencySymbol(code) + partArray.join(".") + ' ' + code);

            }

	        deferred.resolve(conversions);        

        } else {
            deferred.reject('Could not parse base amount.');
        }

        return deferred.promise();
	}

    function getRate(base, code) {
    	
    	if (current.rates[base] == 1) {
    		return current.rates[code];
    	} else {
    		var rateConversion = 1/current.rates[base];
    		return current.rates[code] * rateConversion;
    		
    	}
    }

    function commaSeparateNumber(val){
    	while (/(\d+)(\d{3})/.test(val.toString())){
    		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }

    function getCurrencySymbol(code) {
    	
    	var characterCodes = {
    		AED: "&#1601;&#1604;&#1587;", 
    		AFN: "Af",
    		ALL: "Lek",
    		AMD: "dram",
    		ANG: "NA&#402;",
    		AOA: "Kz",
    		ARS: "&#36;",
    		AUD: "&#36;",
    		AWG: "Afl.",
    		AZN: "m",
    		BAM: "KM",
    		BBD: "&#36;",
    		BDT: "&#2547;",
    		BGN: "&#1083;&#1074;",
    		BHD: ".&#1583;.&#1576;",
    		BIF: "FBu",
    		BMD: "&#36;",
    		BND: "&#36;",
    		BOB: "Bs",
    		BRL: "R&#36;",
    		BSD: "&#36;",
    		BTC: "BTC",
    		BTN: "Nu",
    		BWP: "P",
    		BYR: "Br",
    		BZD: "&#36;",
    		CAD: "&#36;",
    		CDF: "FC",
    		CHF: "CHF",
    		CLF: "UF",
    		CLP: "&#36;",
    		CNY: "&#165;",
    		COP: "&#36;",
    		CRC: "&#8353;",
    		CUP: "&#36;",
    		CVE: "&#36;",
    		CZK: "K&#269;",
    		DJF: "Fdj",
    		DKK: "kr",
    		DOP: "&#36;",
    		DZD: "&#1583;&#1580;",
    		EEK: "kr",
    		EGP: "&#1580;.&#1605;",
    		ERN: "Nfk",
    		ETB: "Br",
    		EUR: "&#8364;",
    		FJD: "&#36;",
    		FKP: "&#163;",
    		GBP: "&#163;",
    		GEL: "&#160;&#4314;&#4304;&#4320;&#4312;",
    		GHS: "GH&#8373;",
    		GIP: "&#163;",
    		GMD: "D",
    		GNF: "FG",
    		GTQ: "Q",
    		GYD: "&#36;",
    		HKD: "&#36;",
    		HNL: "L",
    		HRK: "kn",
    		HTG: "G",
    		HUF: "Ft",
    		IDR: "Rp",
    		ILS: "&#8362;",
    		INR: "&#8377;",
    		IQD: "&#1593;.&#1583;",
    		IRR: "&#65020;",
    		ISK: "kr",
    		JEP: "&#163;",
    		JMD: "&#36;",
    		JOD: "&#1610;&#1606;&#1575;&#1585;",
    		JPY: "&#160;&#165;",
    		KES: "KSh",
    		KGS: "som",
    		KHR: "CR",
    		KMF: "CF",
    		KPW: "&#8361;",
    		KRW: "&#8361;",
    		KWD: "K.D.",
    		KYD: "&#36;",
    		KZT: "&#8376;",
    		LAK: "&#8365;",
    		LBP: "&#1604;.&#1604;",
    		LKR: "&#8360;",
    		LRD: "&#36;",
    		LSL: "L",
    		LTL: "Lt",
    		LVL: "Ls",
    		LYD: "LD",
    		MAD: "&#1583;.&#1605;.",
    		MDL: "MDL",
    		MGA: "Ar",
    		MKD: "&#1076;&#1077;&#1085;",
    		MMK: "K",
    		MNT: "&#8366;",
    		MOP: "MOP&#36;",
    		MRO: "UM",
    		MTL: "&#8356;",
    		MUR: "&#8360;",
    		MVR: "Rf",
    		MWK: "MK",
    		MXN: "&#36;",
    		MYR: "RM",
    		MZN: "MT",
    		NAD: "&#36;",
    		NGN: "&#8358;",
    		NIO: "C&#36;",
    		NOK: "kr",
    		NPR: "&#160;&#8360;&#160;",
    		NZD: "&#36;",
    		OMR: "&#1585;.&#1593;.",
    		PAB: "B/.",
    		PEN: "S/.",
    		PGK: "K",
    		PHP: "&#160;&#8369;",
    		PKR: "Rs",
    		PLN: "z&#322;",
    		PYG: "&#8370;",
    		QAR: "&#1585;.&#1602;",
    		RON: "leu",
    		RSD: "&#1056;&#1057;&#1044;",
    		RUB: "&#1088;&#1091;&#1073;.",
    		RWF: "FRw",
    		SAR: "&#1585;.&#1587;",
    		SBD: "&#36;",
    		SCR: "SR",
    		SDG: "&#163;",
    		SEK: "kr",
    		SGD: "&#36;",
    		SHP: "&#163;",
    		SLL: "Le",
    		SOS: "Sh.So.",
    		SRD: "&#36;",
    		STD: "Db",
    		SVC: "&#8353;",
    		SYP: "&#160;&#163;S",
    		SZL: "L",
    		THB: "&#3647;",
    		TJS: "TJS",
    		TMT: "m",
    		TND: "DT",
    		TOP: "T&#36;",
    		TRY: "TL",
    		TTD: "&#36;",
    		TWD: "&#36;",
    		TZS: "TSh",
    		UAH: "&#8372;",
    		UGX: "USh",
    		USD: "&#36;",
    		UYU: "UYU",
    		UZS: "som",
    		VEF: "Bs.F",
    		VND: "&#8363;",
    		VUV: "VT",
    		WST: "&#36;",
    		XAF: "FCFA",
    		XAG: "ozt",
    		XAU: "ozt",
    		XCD: "&#36;",
    		XDR: "SDRs",
    		XOF: "&#36;",
    		XPF: "F",
    		YER: "&#65020;",
    		ZAR: "R",
    		ZMK: "ZK",
    		ZMW: "ZMK",
    		ZWL: "&#36;"
    	};

    	return characterCodes[code];
    }

}(jQuery));
