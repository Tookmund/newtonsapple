// https://www.wired.com/story/iphone-accelerometer-physics/
var totalvel;
var numvels;
var times;

function resetMotion() {
	totalvel = 0;
	numvels = 1;
	times = [0];
}


function getMotion(event) {
	var accel = [event.acceleration.x, event.acceleration.y, event.acceleration.z];
	var zacc = event.acceleration.z;
	if (Math.abs(zacc) <= 10) {
		numvels++;
		times.push(event.interval);
		totalvel += totalvel+zacc*event.interval;
	}

	document.getElementById("zacc").innerHTML = zacc;
	document.getElementById("interval").innerHTML = event.interval;
}

// Device Motion request must come from a user-generated event
function requestMotion() {
	resetMotion();
	try {
		DeviceMotionEvent.requestPermission().then(response => {
		  if (response == 'granted') {
			  window.addEventListener("devicemotion", getMotion);
		  } else {
			  document.getElementById("something").style.visibility = "visible";
			  document.getElementById("result").innerHTML = "Need Device Motion!";
		  }
		});
	}
	// Fallback to just trying to get device motion events without permission
	catch(error) {
		try {
			window.addEventListener("devicemotion", getMotion);
		}
		// Fallback to old API
		catch (err) {
			try {
				window.ondevicemotion = getMotion;
			}
			// Give up
			catch (e) {
				document.getElementById("something").style.visibility = "visible";
				document.getElementById("result").innerHTML = "No Access to device motion!";
				return;
			}
		}
	}
	document.getElementById("something").style.visibility = "hidden";
	let req =  document.getElementById("buttstyled");
	req.classList.remove("start");
	req.innerHTML = "End";
	req.onclick = endMotion;
}

function endMotion() {
	document.getElementById("buttstyled").classList.add("start");
	try {
		window.removeEventListener("devicemotion", getMotion);
	} catch(e) {
		window.ondevicemotion = null;
	}
	var avgvel = totalvel/numvels;
	var dist = 0;
	for (let t in times) {
		// x_i = x_i-1+average velocity*change in time
		dist += avgvel*times[t];
	}
	document.getElementById("something").style.visibility = "visible";
	document.getElementById("result").innerHTML = ""+dist;
	let req = document.getElementById("buttstyled");
	req.onclick = requestMotion;
	req.innerHTML = "Start";
}

// Requires defer
window.onload = function() {
	document.getElementById("buttstyled").onclick = requestMotion;
	document.getElementById("something").style.visibility = "hidden";
	console.log("TEST");
}
