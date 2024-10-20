export class Hello {
	constructor(name) {
		this.name = name;
	}

	log(tag) {
		$.log(`${tag} ${this.name}!`);
	}
}
