# frmlnd-current
**Easy currency conversions on the fly.**

## Dependencies
**jQuery**  
I'm using the following, but Current has been tested with jQuery 1.x as well, specifically 1.11.2.
bower install jquery#3.2.1 --save,  
or [jQuery 3.x latest](http://jquery.com/download/)

**Open Exchange Rates API**  
Current leverages the <a href="https://openexchangerates.org" target="_blank">Open Exchange Rates API</a> to create an ultra-lightweight, simple currency conversion display tool that's easy to use with your web application. The Open Exchange Rates API requires an API key, which you can procure <a href="https://openexchangerates.org/signup" target="_blank">here</a>.

## Usage
Include CSS and JS files:
```
<header>
<link rel="stylesheet" type="text/css" href="css/frmlnd-current.min.css">
<body>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/frmlnd-current.min.js"></script>
```
Add a currency that need to be converted.
```
<span class="crrnt-currency">$100.63</span>
```
Call the plugin with your API URL:
```
<script type="text/javascript">
$(document).ready(function() {
	$('.crrnt-currency').current({
		api: 'http://openexchangerates.org/api/latest.json?app_id=[YOUR_API_KEY]'
	});
});	
</script>
```
  		
### Options

* **api** (string): The URI of the Open Exchange Rates API, with your API key. There is intentionally no default for this, because technically the plugin will work with other APIs as long as they return the correct JSON structure. For a free, keyless, but less all-encapsulating option - try [http://fixer.io/](http://fixer.io/).
* **base** (string): The base currency the the plugin will use to calculate all other currency amounts. Default: "USD".
* **currencies** (Array): An array of currencies that Current should return to the UI. Default: ["EUR","JPY","CNY"].
* **accuracy** (number): The decimal accuracy of the returned currency values.

### Examples
The following code will use the U.S. Dollar as a base and return Euros, Japanese Yen, and Chinese Yuan to the UI as a hover element.
```
<span class="crrnt-currency" data-crrnt-base="USD" data-crrnt-currencies="EUR,JPY,CNY">$100.63</span>
```

The following code will use the Iranian Rial as a base and return Euros to the UI onClick.
```
<span class="crrnt-currency click" data-crrnt-base="IRR" data-crrnt-currencies="EUR">﷼283,000</span>
```

The following code will use US Dollars as a base and return Euros and Brazilian Real, inline with the base amount.
```
<span class="crrnt-currency inline" data-crrnt-base="USD" data-crrnt-currencies="EUR,BRL">$37.50</span>
```
