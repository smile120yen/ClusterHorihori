$.onStart(() => {
	$.state.time = 3;
});

$.onUpdate((deltaTime) => {
	if ($.state.time > 0) $.state.time -= deltaTime;

	if ($.state.time <= 0) {
		$.destroy();
	}
});
