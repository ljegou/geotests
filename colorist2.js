/*
 *
 * Colorist, a JavaScript library for color conversions
 *
 */

pow = Math.pow;

//White point at D65 and observer 2° (1931)
var Xw =   95.047;
var Yw =  100.0;
var Zw =  108.883;

var d = 6 / 29;

f = function(t) {
  if (t > d * d * d) {
    return pow(t, 1 / 3);
  } else {
    return t / 3 / d / d + 4 / 29;
  }
};

g = function(t) {
  if (t > d) {
    return t * t * t;
  } else {
    return 3 * d * d * (t - 4 / 29);
  }
};

function crgb(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function cxyz(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

function chsv(h,s,v) {
	this.h = h;
	this.s = s;
	this.v = v;
}

function cyuv(y,u,v) {
	this.y = y;
	this.u = u;
	this.v = v;
}

function ccielab(l,a,b) {
	this.l = l;
	this.a = a;
	this.b = b;
}

function ccieluv(l,u,v) {
	this.l = l;
	this.u = u;
	this.v = v;
}

var argb2hsv = function (c) {
	var r, g, b;
	r = c.r / 255;
	g = c.g / 255;
	b = c.b / 255;
	var hue, sat, val,
	min   = Math.min(r, g, b),
	max   = Math.max(r, g, b),
	delta = max - min,
	val   = max;

	// This is gray (red==green==blue)
	if (delta === 0) {
		hue = sat = 0;
	} else {
		sat = delta / max;
		if (max === r) {
			hue = (g -  b) / delta;
		} else if (max === g) {
			hue = (b  -   r) / delta + 2;
		} else if (max ===  b) {
			hue = (r   - g) / delta + 4;
		}
		hue /= 6;
		if (hue < 0) {
			hue += 1;
		}
	}

	var s = new chsv(Math.round(hue*255), Math.round(sat*255), Math.round(val*255));
	return s;
};

var chsv2rgb = function (c) {
	var red, grn, blu, i, f, p, q, t, h, s, v;
	h = c.h %= 360.0;
	if(c.v==0) {return("#000000");}
	s = c.s/100.0;
	v = c.v/100.0;
	h = c.h/60.0;
	i = Math.floor(h);
	f = h-i;
	p = v*(1.0-s);
	q = v*(1.0-(s*f));
	t = v*(1.0-(s*(1-f)));
	if (i==0) {red=v; grn=t; blu=p;}
	else if (i==1) {red=q; grn=v; blu=p;}
	else if (i==2) {red=p; grn=v; blu=t;}
	else if (i==3) {red=p; grn=q; blu=v;}
	else if (i==4) {red=t; grn=p; blu=v;}
	else if (i==5) {red=v; grn=p; blu=q;}
	red = Math.floor(red*255.0);
	grn = Math.floor(grn*255.0);
	blu = Math.floor(blu*255.0);

	return new crgb(red,grn,blu);
}

var ahsv2rgb = function (c) {
	var hue, sat, val;
	var red, grn, blu, i, f, p, q, t;
	hue = c.h;
	sat = c.s;
	val = c.v;
	hue%=255.0;
	if(sat==0) {return(new crgb(Math.round(c.v), Math.round(c.v), Math.round(c.v)))};
	if(val==0) {return(new crgb(0,0,0));}
	sat/=255.0;
	val/=255.0;
	hue/=255.0;
	if (hue >= 1.0) {hue = 0.0} else {hue *= 6.0};
	i = Math.floor(hue);
	f = hue-i;
	p = val*(1-sat);
	q = val*(1-(sat*f));
	t = val*(1-(sat*(1-f)));
	if (i==0) {red=val; grn=t; blu=p;}
	else if (i==1) {red=q; grn=val; blu=p;}
	else if (i==2) {red=p; grn=val; blu=t;}
	else if (i==3) {red=p; grn=q; blu=val;}
	else if (i==4) {red=t; grn=p; blu=val;}
	else {red=val; grn=p; blu=q;}
	red = Math.floor(red*255.0);
	grn = Math.floor(grn*255.0);
	blu = Math.floor(blu*255.0);

	return new crgb(red,grn,blu);
}

function rgb2hsv(red, green, blue) {
	red /= 255.0;
	green /= 255.0;
	blue /= 255.0;
	var hue, sat, val,
	min   = Math.min(red, green, blue),
	max   = Math.max(red, green, blue),
	delta = max - min,
	val   = max;

	// This is gray (red==green==blue)
	if (delta === 0) {
		hue = sat = 0;
	} else {
		sat = delta / max;
		if (max === red) {
			hue = (green -  blue) / delta;
		} else if (max === green) {
			hue = (blue  -   red) / delta + 2;
		} else if (max ===  blue) {
			hue = (red   - green) / delta + 4;
		}
		hue /= 6;
		if (hue < 0) {
			hue += 1;
		}
	}

	return [Math.round(hue*255), Math.round(sat*255), Math.round(val*255)];
};

function hsv2rgb(hue, sat, val) {
	var red, grn, blu, i, f, p, q, t, h, s, v;
	h = hue %= 360.0;
	if(val==0) {return("#000000");}
	s = sat/100.0;
	v = val/100.0;
	h = hue/60.0;
	i = Math.floor(h);
	f = h-i;
	p = v*(1.0-s);
	q = v*(1.0-(s*f));
	t = v*(1.0-(s*(1-f)));
	if (i==0) {red=v; grn=t; blu=p;}
	else if (i==1) {red=q; grn=v; blu=p;}
	else if (i==2) {red=p; grn=v; blu=t;}
	else if (i==3) {red=p; grn=q; blu=v;}
	else if (i==4) {red=t; grn=p; blu=v;}
	else if (i==5) {red=v; grn=p; blu=q;}
	red = Math.floor(red*255.0);
	grn = Math.floor(grn*255.0);
	blu = Math.floor(blu*255.0);

	return "#" + ((1 << 24) + (red << 16) + (grn << 8) + blu).toString(16).slice(1);
}

function cutHex(h) {
	return (h.charAt(0)=="#") ? h.substring(1,7):h;
}

function hex2r(h) {
	return parseInt((cutHex(h)).substring(0,2),16);
}

function hex2g(h) {
	return parseInt((cutHex(h)).substring(2,4),16);
}

function hex2b(h) {
	return parseInt((cutHex(h)).substring(4,6),16);
}

function hex2rgb(h) {
	var r = hex2r(h);
	var g = hex2g(h);
	var b = hex2b(h);
	
	return new crgb(r,g,b);
}

function rgb2hex(r){
	return "#" + ((1 << 24) + (r.r << 16) + (r.g << 8) + r.b).toString(16).slice(1);
}

function rgb2cielab(s) {
	var xyz = rgb2xyz(s);
	var c = xyz2cielab(xyz);
	return c;
}

function rgb2cieluv(s) {
	var xyz = rgb2xyz(s);
	var c = xyz2cieluv(xyz);
	return c;
}

function cielab2rgb(s) {
	var xyz = cielab2xyz(s);
	var c = xyz2rgb(xyz);
	return c;
}

function cieluv2rgb(s) {
	var xyz = cieluv2xyz(s);
	var c = xyz2rgb(xyz);
	return c;
}

function yuv2rgb(s) {
	var r = s.y + 1.4075 * (s.v - 128);
	var g = s.y - 0.3455 * (s.u - 128) - (0.7169 * (s.v - 128));
	var b = s.y + 1.7790 * (s.u - 128);

	var c = new crgb(r,g,b);

	c.r=Math.floor(c.r);
	c.g=Math.floor(c.g);
	c.b=Math.floor(c.b);

	if (c.r<0) c.r=0;
	  else
	if (c.r>255) c.r=255;

	if (c.g<0) c.g=0;
	  else
	if (c.g>255) c.g=255;

	if (c.b<0) c.b=0;
	  else
	if (c.b>255) c.b=255;

	return c;
}

function rgb2yuv(s) {
	y = Math.round(s.r *  .299000 + s.g *  .587000 + s.b *  .114000);
	u = Math.round(s.r * -.168736 + s.g * -.331264 + s.b *  .500000 + 128);
	v = Math.round(s.r *  .500000 + s.g * -.418688 + s.b * -.081312 + 128);
	var c = new cyuv(y,u,v);
	return c;
}

function RGBDifference(c1, c2) {
	var d = 256;
	d = (Math.abs(c2.r - c1.r) + Math.abs(c2.g - c1.g) + Math.abs(c2.b - c1.b)) / 3;
	return d;
}

function colorDifference(c1, c2) {
	switch (cs) {
		case "YUV" :
			return YUVColorDifference(c1, c2);
			break;
		case "HSL" :
			return HSLColorDifference(c1, c2);
			break;
		case "CIELAB" :
			return CIELABColorDifference(c1, c2);
			break;
		case "CIELUV" :
			return CIELUVColorDifference(c1, c2);
			break;
	}
}

function HSLColorDifference(c1, c2) {
	var d = 0;
	d = Math.sqrt(Math.pow((c1.h-c2.h),2)+Math.pow((c1.s-c2.s),2)+Math.pow((c1.v-c2.v),2));
	return d;
}

function YUVColorDifference(c1, c2) {
	var d = 0;
	d = Math.sqrt(Math.pow((c1.y-c2.y),2)+Math.pow((c1.u-c2.u),2)+Math.pow((c1.v-c2.v),2));
	return d;
}

function CIELABColorDifference(c1, c2) {
	var d = 0;
	d = Math.sqrt(Math.pow((c1.l-c2.l),2)+Math.pow((c1.a-c2.a),2)+Math.pow((c1.b-c2.b),2));
	return d;
}

function CIELUVColorDifference(c1, c2) {
	var d = 0;
	d = Math.sqrt(Math.pow((c1.l-c2.l),2)+Math.pow((c1.u-c2.u),2)+Math.pow((c1.v-c2.v),2));
	return d;
}

function xyz2rgb(c) {
	var r,g,b;
	var x, y, z;

	x = c.x / 100.0;
	y = c.y / 100.0;
	z = c.z / 100.0;

	r = x * 3.2404542 + y * -1.5371385 + z *  -0.4985314;
	g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
	b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

	if (r > 0.0031308) {r = 1.055 * (pow(r, (1/ 2.4))) - 0.055;} else {r = 12.92 * r;}
	if (g > 0.0031308) {g = 1.055 * (pow(g, (1/ 2.4))) - 0.055;} else {g = 12.92 * g;}
	if (b > 0.0031308) {b = 1.055 * (pow(b, (1/ 2.4))) - 0.055;} else {b = 12.92 * b;}

	r = (r * 255.0);
	g = (g * 255.0);
	b = (b * 255.0);
	if (r > 255) {r = 255;}
	if (r < 0) {r = 0;}
	if (g > 255) {g = 255;}
	if (g < 0) {g = 0;}
	if (b > 255) {b = 255;}
	if (b < 0) {b = 0;}

	var a = new crgb(Math.floor(r), Math.floor(g), Math.floor(b));
	return a;
}

function rgb2xyz(c) {
	var x, y, z;
	var r, g, b;

	r = c.r / 255.0;
	g = c.g / 255.0;
	b = c.b / 255.0;
	
	if (r > 0.04045) {r = pow((r + 0.055) / 1.055, 2.4)} else {r = r / 12.92};
	if (g > 0.04045) {g = pow((g + 0.055) / 1.055, 2.4)} else {g = g / 12.92};
	if (b > 0.04045) {b = pow((b + 0.055) / 1.055, 2.4)} else {b = b / 12.92};

	r = r * 100.0;
	g = g * 100.0;
	b = b * 100.0;

	x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
	y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
	z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;

	var a = new cxyz(x, y, z);
	return a;
}

function cielab2xyz(c) {
    var L_star, X, Y, Z, a_star, b_star, temp;
    L_star = c.l, a_star = c.a, b_star = c.b;
    temp = (L_star + 16) / 116;
    X = Xw * g(temp + a_star / 500);
    Y = Yw * g(temp);
    Z = Zw * g(temp - b_star / 200);

	var a = new cxyz(X, Y, Z);
    return a;
}

function xyz2cielab(c) {
	var L_star, X, Y, Z, a_star, b_star, fY;
    X = c.x, Y = c.y, Z = c.z;
    fY = f(Y / Yw);
    L_star = 116 * fY - 16;
    a_star = 500 * (f(X / Xw) - fY);
    b_star = 200 * (fY - f(Z / Zw));

	var a = new ccielab(L_star, a_star, b_star);
    return a;
}

function cieluv2xyz(c) {
	var L_star, X, Y, Z, u_star, v_star, u_w, v_w, u_prime, v_prime;
	L_star = c.l;
	u_star = c.u;
	v_star = c.v;
	
	Y = (L_star + 16.0) / 116.0;

    if (pow(Y, 3.0) > 0.00885645167903563082) {
        Y = pow(Y, 3.0);
    } else {
        Y = (Y - (16.0/116.0))/7.787;
    }

    u_w = (4.0 * Xw) / (Xw + (15.0 * Yw) + (3.0 * Zw));
    v_w = (9.0 * Yw) / (Xw + (15.0 * Yw) + (3.0 * Zw));
    u_prime = u_star / (13.0 * L_star) + u_w;
    v_prime = v_star / (13.0 * L_star) + v_w;

    Y = Y * 100.0;
    X = -(9.0 * Y * u_prime) / ((u_prime - 4.0) * v_prime - u_prime * v_prime);
    Z = (9.0 * Y - (15.0 * v_prime * Y) - (v_prime * X)) / (3.0 * v_prime);

	var a = new cxyz(X, Y, Z);
    return a;
}

function xyz2cieluv(c) {
	var L_star, X, Y, Z, u_star, v_star, up, vp, u0p, v0p, Yd;
    X = c.x, Y = c.y, Z = c.z;

	Yd = Y / Yw;
	if (Yd >= 0.00885645167903563082) {
		Yd = pow(Yd, 1.0 / 3.0);
	} else {
		Yd = (7.787 * Yd) + (16.0 / 116.0);
	}

	up = (4.0 * X) / (X + (15.0 * Y) + (3.0 * Z));
    vp = (9.0 * Y) / (X + (15.0 * Y) + (3.0 * Z));
    u0p = (4.0 * Xw) / (Xw + (15.0 * Yw) + (3.0 * Zw));
    v0p = (9.0 * Yw) / (Xw + (15.0 * Yw) + (3.0 * Zw));
    L_star = (116.0 * Yd) - 16.0;
    u_star = 13.0 * L_star * (up - u0p);
    v_star = 13.0 * L_star * (vp - v0p);
    
	var a = new ccieluv(L_star, u_star, v_star);
    return a;
}