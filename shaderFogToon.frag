#version 400

//toon shading unifroms
uniform vec3 lightDir;

//fog variables
uniform float minDist;
uniform float maxDist;
uniform vec3 fogColour;

in vec3 normal;
in vec4 v_pos;

//Rim Varibles
uniform vec3 IVD;

//out vec4 FragColor;

//bools
uniform bool toonActive;
uniform bool fogActive;
uniform bool rimActive;

vec4 fog();
vec4 toon();
vec4 rim();


void main()
{
	if(toonActive && fogActive && rimActive)
	{
		gl_FragColor = fog() * toon() * rim();
	}
	else if(toonActive && !fogActive && !rimActive)
	{
		gl_FragColor = toon();
	}
	else if(fogActive && !toonActive && !rimActive)
	{
		gl_FragColor = fog();
	}
	else if(rimActive && !fogActive && !toonActive)
	{
		gl_FragColor = rim();
	}
	else if(fogActive && toonActive && !rimActive)
	{
		gl_FragColor = fog() * toon();
	}
	else if(rimActive && fogActive && !toonActive)
	{
		gl_FragColor = rim() * fog();
	}
	else if(toonActive && rimActive && !fogActive)
	{
		gl_FragColor = toon() * rim();
	}
	else
	{
		gl_FragColor = toon() * rim() * fog();
	}
}

vec4 fog()
{
	// fog code
	float dist = abs(v_pos.z);
	float f = (maxDist - dist)/(maxDist - minDist);
	f = clamp(f, 0.0, 1.0);
	vec3 lightColour = vec3(0.0, 0.0, 0.5);
	vec3 fCol = mix(fogColour, lightColour, f);

	return vec4(fCol, 1.0);
}

vec4 toon()
{
	//toon code
	float intensity;
	vec3 colour;

	intensity = dot(lightDir, normal);
	if(intensity > 0.9)
	{
		colour = vec3(0, 0, 1);
	}
	else if (intensity > 0.7)
	{
		colour = vec3(0, 0, 0.7);
	}
	else if (intensity > 0.5)
	{
		colour = vec3(0, 0, 0.5);
	}
	else
	{
		colour = vec3(0, 0, 0.3);
	}

	return vec4(colour, 1.0);
}

vec4 rim()
{
	//rim code
	float rimShade = 1 - max(dot(normal, IVD), 0.0);
	vec3 col = vec3(smoothstep(0.0, 1.0, rimShade));

	return vec4(col, 1.0);
}