
var getRandomLetter = function () {
	return String.fromCharCode(Math.floor((Math.random() * 0xFFFF)));
}

var similarString = function (x, y) {
	var count = 0;
	var length = Math.min(x.length, y.length);
	for (var i = 0; i < length; i++) {
		count -= Math.abs(x.charCodeAt(i)-y.charCodeAt(i));
		if (x.substring(i, i+1) == y.substring(i, i+1)) {
			count += 100;
		}
	}
	return count/length;
}

class MyGeneticAlgorithm{
	private top1: string;
	private top2: string;
	private top1score: number;
	private top2score: number;
	private population: Array<string>;
	private searchWord: string;
	private speed: number;

	constructor(searchWord: string, populationSize: number, speed: number){
		this.speed = speed;
		this.searchWord = searchWord;
		this.population = [];

		this.initializePopulation(populationSize);
	}

	// define fitness function
	private fitness(input){
		return similarString(input, this.searchWord);
	}

	private initializePopulation(size: number){
		// initialize population with random candidates
		for (var i = 0; i < size; i++) {
			var str = '';
			for (var j = 0; j < this.searchWord.length; j++) {
				str += getRandomLetter();
			}
			this.population[i] = str;
		}
	}

	// find best candidates
	private findBestCandidates(){
		this.top1 = this.population[0];
		this.top2 = this.population[1];
		this.top1score = this.top2score = -10000;

		// Find top 2
		for (var i = 0; i < this.population.length; i++) {
			var score = this.fitness(this.population[i]);
			if (score > this.top1score) {
				this.top1 = this.population[i];
				this.top1score = score;
			} else if (score > this.top2score) {
				this.top2 = this.population[i];
				this.top2score = score;
			}
		}
	}

	private generateNextGeneration(){
		// Generate new strings
		for (var i = 0; i < this.population.length; i++) {
			var splitAt = Math.floor(Math.random() * this.searchWord.length);
			this.population[i] = this.top1.substring(0, splitAt) + this.top2.substring(splitAt, this.searchWord.length);

			// mutation propability is 0.25
			if (Math.random() < 0.25) {
				var mutateAt = Math.floor(Math.random() * this.searchWord.length) + 1;
				this.population[i] = this.population[i].substring(0, mutateAt-1) + getRandomLetter() + this.population[i].substring(mutateAt, this.searchWord.length);
			}
		}
	}

	public run() {
		this.findBestCandidates();
		this.generateNextGeneration();

		// chekc if we already have a perfect candidate
		if (this.fitness(this.top1) !== 100) {
			setTimeout(this.run.bind(this), this.speed);
		}
		
		console.log(this.top1);
	}

};

var genAlgorithm = new MyGeneticAlgorithm("Blubber", 2000, 0);
genAlgorithm.run();