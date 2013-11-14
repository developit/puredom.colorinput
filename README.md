puredom.colorinput
==================
A puredom plugin that adds support for `<input type="color">` to forms wrapped in [puredom.FormHandler](http://puredom.org/docs/symbols/puredom.FormHandler.html).  
It enhances color input fields with a graphical color picker in browsers that don't natively support color input.  


---

Selection Methods
=================

`.colorinput( {Boolean} enabled )`  
*Enable or disable color input for a field*  

`.removecolorinput()`  
*The same as calling `.colorinput(false)`*  

Selection Example
-----------------
```html
<!-- standard input field -->
<input id="myColor" value="#5599CC" />

<script>
	// To enable the color picker for that field:
	puredom('#myColor').colorinput();
	
	// To disable it:
	puredom('#myColor').colorinput(false);
</script>
```


---

Using With FormHandler
======================
If you're using [puredom.FormHandler](http://puredom.org/docs/symbols/puredom.FormHandler.html), all color inputs will be automatically enhanced once you include the plugin.  

FormHandler Example
-------------------
```html
<form id="myForm">
	<input type="color" value="#5599CC" />
</form>

<script>
	var form = new puredom.FormHandler('#myForm', {
		enhance : true
	});
</script>
```


---

License
=======
This plugin is available under the BSD-3-Clause License:

>	Copyright (c) Jason Miller. All rights reserved.
>	
>	Redistribution and use in source and binary forms, with or without modification, 
>	are permitted provided that the following conditions are met:
>	
>	*	Redistributions of source code must retain the above copyright notice, 
>		this list of conditions and the following disclaimer.
>	
>	*	Redistributions in binary form must reproduce the above copyright notice, 
>		this list of conditions and the following disclaimer in the documentation 
>		and/or other materials provided with the distribution.
>	
>	*	Neither the name of Jason Miller, nor the names of its contributors may be used to endorse 
>		or promote products derived from this software without specific prior written permission.
>	
>	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS 
>	OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
>	AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER 
>	OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
>	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
>	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER 
>	IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY 
>	OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
