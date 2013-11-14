(function() {
	
	function init() {
		puredom.FormHandler.addCustomType(api);
		
		puredom.addNodeSelectionPlugin('colorinput', function(enabled) {
			return this.each(enabled===false ? api.destroy : api.enhance);
		});
		
		puredom.addNodeSelectionPlugin('removecolorinput', function() {
			return this.each(api.destroy);
		});
	}
	
	var api = {
	
		id : 'color',
	
		types : ['color'],
	
		objs : [],
	
		color : (function() {
			var d, digit, dbl, hexDigit;
			d = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
			digit = function(x) {
				return d.indexOf((x+"").toUpperCase());
			};
			dbl = function(x) {
				return digit(x.charAt(0))*16 + digit(x.charAt(1));
			};
			hexDigit = function(x) {
				return d[Math.floor(x/16)] + d[Math.floor(x%16)];
			};
		
			return function(){
				var obj = {
					r : 0,
					g : 0,
					b : 0,
					darken	: function(fraction) {
						this.r -= Math.round(this.r * fraction);
						this.g -= Math.round(this.g * fraction);
						this.b -= Math.round(this.b * fraction);
						return this;
					},
					lighten	: function(fraction) {
						this.r += Math.round(this.r * fraction);
						this.g += Math.round(this.g * fraction);
						this.b += Math.round(this.b * fraction);
						return this;
					},
					hex	: function() {
						return this.toHex.apply(this,arguments);
					},
					toHex	: function() {
						return hexDigit(this.r)+hexDigit(this.g)+hexDigit(this.b);
					},
					toRGB	: function() {
						return {
							r : Math.round(this.r),
							g : Math.round(this.g),
							b : Math.round(this.b)
						};
					},
					toHSV : function() {
						return this._getInternalHSVL('hsv');
					},
					toHSL : function() {
						return this._getInternalHSVL('hsl');
					},
					_getInternalHSVL : function(type) {
						var r = {
								h : 0,
								s : 0
							},
							max = Math.max(this.r, this.g, this.b),
							min = Math.min(this.r, this.g, this.b),
							chroma = max-min,
							aHue;
					
						type = (type || 'hsv').toLowerCase();
					
						if (chroma===0) {
							aHue = 0;
						}
						else if (this.r===max) {
							aHue = ((this.g-this.b)/chroma)%6;
							if (aHue<0) {
								aHue += 6;
							}
						}
						else if (this.g===max) {
							aHue = (this.b-this.r)/chroma + 2;
						}
						else if (this.b===max) {
							aHue = (this.r-this.g)/chroma + 4;
						}
					
						r.h = 60 * aHue;
					
						if (type==='hsv') {
							r.v = Math.round(max) || 0;
							r.s = Math.round(chroma / max * 100) || 0;
						}
						else {
							r.l = (max-min)/2;
							r.s = Math.round(chroma / (1-Math.abs(2*r.l-1)) * 100) || 0;
							r.l = Math.round(r.l);
						}
					
						return r;
					},
					fromRGB : function(rgb) {
						var p = (rgb+'').replace(/[^0-9\,]/gim,'').split(',');
						this.r = parseInt(p[0],10);
						this.g = parseInt(p[1],10);
						this.b = parseInt(p[2],10);
						return this;
					},
					fromHex : function(hex) {
						hex = (hex+'').replace(/[^0-9a-f]/mgi,'');
						if (hex.length===3) {
							hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
						}
						this.r = dbl(hex.substring(0,2));
						this.g = dbl(hex.substring(2,4));
						this.b = dbl(hex.substring(4,6));
						return this;
					},
					fromHSV : function(hue, sat, val) {
						var aHue = hue / 60,							// hue
							chroma = val * sat / 100,					// chroma
							x = chroma * (1 - Math.abs(aHue%2-1)),		// intermediate
							m = val - chroma;							// lightness adjustment
						this._applyChromaKey(m, aHue, chroma, x);
						return this;
					},
					fromHSL : function(hue, sat, lit) {
						var aHue = hue / 60,							// hue
							chroma = (1-Math.abs(2*lit/100-1)) * sat,		// chroma
							x = chroma * (1 - Math.abs(aHue%2-1)),		// intermediate
							m = lit - chroma/2;							// lightness adjustment
						this._applyChromaKey(m, aHue, chroma, x);
						return this;
					},
					_applyChromaKey : function(m, hue, chroma, x) {
						this.r = this.g = this.b = m;
						if (hue<1) {
							this.r += chroma;
							this.g += x;
						}
						else if (hue<2) {
							this.r += x;
							this.g += chroma;
						}
						else if (hue<3) {
							this.g += chroma;
							this.b += x;
						}
						else if (hue<4) {
							this.g += x;
							this.b += chroma;
						}
						else if (hue<5) {
							this.r += x;
							this.b += chroma;
						}
						else if (hue<6) {
							this.r += chroma;
							this.b += x;
						}
					},
					parse : function() {
						var a, type;
						if(arguments.length===3) {
							this.fromRGB(Array.prototype.join.call(arguments,','));
						}
						else if(arguments.length===1) {
							if ((arguments[0]+'').indexOf(',')>-1) {
								a = arguments[0].replace('(',',').replace(/[^0-9a-z\.\-\,]+/gim,'').toLowerCase().split(',');
								type = 'rgb';
								if (a.length>3) {
									type = a.splice(0,1)[0];
								}
								for (var x=0; x<a.length; x++) {
									a[x] = parseFloat(a[x]);
								}
								switch (type) {
									case 'hsv':
										this.fromHSV.apply(this,a);
										break;
									default:
										this.fromRGB(arguments[0]);
								}
							}
							else {
								this.fromHex(arguments[0]);
							}
						}
						return this;
					},
					init : function() {
						obj = null;
						delete this.init;
						return this;
					}
				};
			
				obj.parse.apply(obj, arguments);
			
				return obj.init();
			};
		}()),
	
	
		colorPickerHueSatMousedown : function(e, self) {
			var body = puredom.el(document.body),
				shim,
				update, move, up;
		
			self = puredom.el(self);
		
			shim = puredom.el({
				className : 'shim',
				css : 'z-index:999;'
			}, document.body);
		
			update = function(e, tween) {
				var x = Math.round(e.pageX - self.x(true)),
					y = Math.round(e.pageY - self.y(true)),
					height = self.height(),
					width = self.width(),
					hsv = api.currentColor.toHSV();
				x = Math.min(Math.max(x, 0), width);
				y = Math.min(Math.max(y, 0), height);
				self.query('.puredom_colorinput_huesat_fg').position(x, y);
				hsv.s = Math.round((height-y)/height*100);
				hsv.h = Math.round(x/width*362);
				if (hsv.h>=360) {
					hsv.h = 0;
				}
				if (hsv.v===0) {
					hsv.v = 1;
				}
				var color = api.color().fromHSV(hsv.h, hsv.s, hsv.v);
				api.setPickerValue(color, true);
			};
			
			move = function(e) {
				update(e);
				return puredom.cancelEvent(e);
			};
			body.on('mousemove', move);
			
			up = function(e) {
				update(e);
				body.removeEvent('mousemove', move);
				body.removeEvent('mouseup', up);
				shim.destroy();
				self = body = shim = up = move = update = null;
				return puredom.cancelEvent(e);
			};
			body.on('mouseup', up);
		
			update(e, true);
			e = null;
		},
		
		colorPickerValueMousedown : function(e, self) {
			var body = puredom.el(document.body),
				shim,
				update, move, up;
		
			self = puredom.el(self);
			
			shim = puredom.el({
				className : 'shim',
				css : 'z-index:999;'
			}, document.body);
			
			update = function(e, tween) {
				var y = Math.round(e.pageY - self.y(true)) - self.query('.puredom_colorinput_value_fg').height()/4,
					height = self.height(),
					hsv = api.currentColor.toHSV();
				y = Math.min(Math.max(y, 0), height);
				hsv.v = Math.round((height-y)/height*255);
				hsv.v = Math.max(0, Math.min(255,hsv.v));
				var color = api.color().fromHSV(hsv.h, hsv.s, hsv.v),
					c = color.toRGB();
				api.setPickerValue(color, true);
			};
		
			move = function(e) {
				update(e);
				return puredom.cancelEvent(e);
			};
			body.on('mousemove', move);
		
			up = function(e) {
				update(e);
				body.removeEvent('mousemove', move);
				body.removeEvent('mouseup', up);
				shim.destroy();
				self = body = shim = up = move = update = null;
				return puredom.cancelEvent(e);
			};
			body.on('mouseup', up);
		
			update(e, true);
			e = null;
		},
		
		createPicker : function() {
			this.picker = puredom.el({
				className : 'puredom_colorinput',
				children : [
					{ className:'puredom_colorinput_huesat', children:[
						{ className:'puredom_colorinput_huesat_bg' },
						{ className:'puredom_colorinput_huesat_fg', innerHTML:'+' }
					], onmousedown:function(e) {
						return api.colorPickerHueSatMousedown(e, this);
					}},
					{ className:'puredom_colorinput_value', children:[
						{ className:'puredom_colorinput_value_bg' },
						{ className:'puredom_colorinput_value_fg', innerHTML:decodeURIComponent('%E2%97%80') }
					], onmousedown:function(e) {
						return api.colorPickerValueMousedown(e, this);
					}},
					{ className:'puredom_colorinput_bgPreview' },
					{ className:'puredom_colorinput_fgPreview', innerHTML:'Example.' }
				],
				onfocus : puredom.cancelEvent,
				onmousedown : puredom.cancelEvent,
				ontouchstart : puredom.cancelEvent
			}, document.body);
		
			this.picker.hidden = true;
		},
	
		openPicker : function(input) {
			if (this.closePickerTimer) {
				clearTimeout(this.closePickerTimer);
				this.closePickerTimer = null;
			}
			if (!this.picker) {
				this.createPicker();
			}
			this.picker.fadeIn('fast').position(
				input.x(true),
				input.y(true) - this.picker.height(),
				this.picker.hidden ? null : {tween:'fast'}
			);
			this.picker.currentInput = input;
			this.picker.hidden = false;
			this.currentColor = null;
			var color = this.color();
			if (input.attr('data-color-hsv')) {
				color.parse('hsv(' + input.attr('data-color-hsv') + ')');
			}
			else {
				color.parse(input.value());
			}
			this.setPickerValue(color);
		},
	
		closePicker : function() {
			this.picker.currentInput = null;
			this.currentColor = null;
			if (this.closePickerTimer) {
				return true;
			}
			this.closePickerTimer = setTimeout(function() {
				if (api.picker) {
					api.picker.fadeOut('fast', function(){
						if (api.picker) {
							api.picker.hidden = true;
						}
					}, false);
				}
			}, 20);
		},
	
		setPickerValue : function(color, fromUser) {
			if (this.picker && color) {
				var hex = '#' + color.toHex(),
					hsv = color.toHSV(),
					bg,
					valuePicker = this.picker.query('.puredom_colorinput_value_fg'),
					hueSatPicker = this.picker.query('.puredom_colorinput_huesat_fg');
				// determine whether to use a dark or light background based on the color value
				if (hsv.v<100) {
					bg = '0 1px 3px rgba(255,255,255,'+((hsv.v)/200+0.5)+')';
				}
				else {
					bg = '0 -1px 3px rgba(0,0,0,'+((255-hsv.v)/200+0.25)+')';
				}
				// Value picker
				valuePicker.position(null, (1-hsv.v/255)*valuePicker.parent().height());
				// Hue/Sat picker
				hueSatPicker.position(
					hsv.h/360 * hueSatPicker.parent().width(),
					(1-hsv.s/100) * hueSatPicker.parent().height()
				);
				// foreground preview
				this.picker.query('.puredom_colorinput_fgPreview').css({
					color : hex,
					'text-shadow' : bg
				});
				// background picker
				this.picker.query('.puredom_colorinput_bgPreview').css({
					'background-color' : hex
				});
			
				if (this.picker.currentInput) {
					this.picker.currentInput.value(hex).attr('data-color-hsv', hsv.h+','+hsv.s+','+hsv.v);
				}
			}
			this.currentColor = color;
		},
	
		enhance : function(input) {
			var obj;
		
			obj = {
				input : input,
				color : this.color(),
				init : function() {
					obj.input.on('focus', obj.openPicker);
					obj.input.on('blur', obj.closePicker);
					obj.input.on('keyup,paste,mouseup', obj.update);
					obj.update();
					obj.input.value('#'+obj.color.hex());
				},
				update : function() {
					var value = (obj.input.value() || '').replace(/[^0-9a-f,]/mgi,'');
					if (value.length===3 || value.length===6) {
						obj.color.parse(value);
						api.setPickerValue(obj.color);
					}
				},
				destroy : function() {
					obj.input.removeEvent('focus', obj.openPicker);
					obj.input.removeEvent('blur', obj.closePicker);
					obj.input.removeEvent('keyup,paste,mouseup', obj.update);
					for (var x=api.objs.length; x--; ) {
						if (api.objs[x]===obj) {
							api.objs.splice(x, 1);
							break;
						}
					}
					obj = null;
				},
				openPicker : function() {
					api.openPicker(obj.input);
				},
				closePicker : function() {
					api.closePicker();
				}
			};
		
			this.objs.push(obj);
		
			obj.init();
		
			input = null;
		},
	
		setValue : function(input, value) {
			var obj = this.getObjForInput(input);
			input.value(value || input.attr('data-default-color') || '#000000');
			if (obj) {
				obj.update();
			}
		},
	
		getValue : function(input) {
			return input.value();
		},
	
		destroy : function(input) {
			var obj = this.getObjForInput(input);
			if (obj) {
				obj.destroy();
			}
		},
		unenhance : function(input) { this.destroy(input); },
	
	
		getObjForInput : function(input) {
			for (var x=this.objs.length; x--; ) {
				if (this.objs[x].input===input) {
					return this.objs[x];
				}
			}
			return false;
		}
	
	};
	
	init();
}());