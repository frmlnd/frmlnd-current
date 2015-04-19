(function ($) {
 
    var exchangeRatesUrl = 'http://api.fixer.io/latest';
	var current;
	
    $.getJSON(exchangeRatesUrl)
        .done(function(json) {
            current = json;
            current.rates[current.base] = 1;
        })
        .fail(function(jqxhr, textStatus, error) {
            console.log('ERROR: ' + error);
        });

        $.fn.current = function(options) {
            
            // Plugin default settings
            var settings = $.extend({
                base: "USD",
                currencies: [
                    'EUR',
                    'AUD',
                    'JPY'
                ]
            }, options);
            
            return $(this).each(function() {

                $(this).addClass('frmlnd-current-base');
                
                // Set hover behaviors for our currency elements
                $(this).hover(

                    // Hover over
                    function() {

                        var html = $('<span />', { 
                            class: 'frmlnd-current-tooltip'
                        }).insertAfter($(this));
                        
                        // Parse the currency into a decimal
                        var amount = Number($(this).text().replace(/[^0-9\.]+/g,""));
                        
                        // Make sure we don't have a parse error 
                        if (amount != 'NaN' && amount != 'undefined') {
                            
                            var currencyCodes = ($(this).data('currencies') !== undefined) ? $(this).data('currencies').split(',') : settings.currencies;

                            // Loop through selected currency codes and grab the rates 
                            for (var i=0; i<currencyCodes.length; i++) {

                                var base = ($(this).data('base') !== undefined) ? $(this).data('base') : settings.base;

                                var code = currencyCodes[i];
                                var rate = getRate(base, code);

                                var newAmount = ((amount * rate) * 10) / 10;
                                var temp = parseFloat(newAmount).toFixed(4);
                                var partArray = temp.toString().split("."); 
                                partArray[0] = partArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
                                
                                var line = $('<span />', {
                                    class: 'frmlnd-current-line'
                                }).html(getCurrencySymbol(code) + partArray.join(".") + ' ' + code + '<br>').appendTo(html);
                            }
                            
                            $(this).after(html);
                            
                        } else {
                            $('.frmlnd-current-tooltip').hide();
                        }
                    },
                    
                    // Hover out
                    function() {
                        $('.frmlnd-current-tooltip').remove();
                    }
                );
            });
        };

    function getRate(base, code) {
    	
        console.log(base + ': ' + code);
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
    		YER: "rial",
    		ZAR: "R",
    		ZMK: "ZK",
    		ZMW: "ZMK",
    		ZWL: "&#36;"
    	};

    	return characterCodes[code];
    }

}(jQuery));
