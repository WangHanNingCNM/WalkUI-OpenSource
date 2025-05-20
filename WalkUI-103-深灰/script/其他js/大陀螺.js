const id = getLocalPlayerUniqueID()
var yRot = -180

function onTickEvent() {
	yRot = yRot + 60
	if (yRot >= 180) {
		yRot = -180 
	}
	const derp = {
		pos: getEntityPos(id),
		inputMode: 2,
		playMode: 0,
		rot: {
			pitch: 0,
			yaw: yRot
		},
		motion: getEntityMotion(id)
	}
	sendPlayerAuthInput(derp)
}

function onSendChatMessageEvent(message) {
	if (message == "tc") {
		exit()
		return true
	}
}