Vue.prototype.$http = axios;

var app = new Vue({
	el: '#mhwMonsterApp',
	data() {
		return {
			autor: "Neftalí Michelet",
			loading: true,
			errored: false,
			monsters: [],
			monstersFiltered: [],
			ecologies: [],
			physicologies: [],
			drops: [],
			types: [],
			searchBox: '',
			typeBox: '',
			monsterSelected: null,
			ecologySelected: null,
			physicologySelected: null,
			dropSelected: null,
			dropIndex: 0,
			showGL: false,
			tabActived: 3,
			elements: ["fire", "water", "thunder", "ice", "dragon"],
			ailments: ["poison", "sleep", "paralysis", "blast", "stun"]
		};
	},
	mounted() {
		var vm = this;
		vm.loading = true;
		this.$http
			.get('json/monsters.json')
			.then(response => {
				vm.monsters = response.data;
				vm.monstersFiltered = response.data;
				vm.types = [...new Set(vm.monsters.map(monster => monster.Type))];
			})
			.catch(error => {
				console.log(error);
				vm.errored = true;
				vm.monsters = monsters;
				vm.monstersFiltered = JSON.parse(JSON.stringify(monsters));
				vm.types = [...new Set(vm.monsters.map(monster => monster.Type))];
			})
			.finally(() => vm.loading = false);
		this.$http
			.get('json/monstersEcology.json')
			.then(response => {
				vm.ecologies = response.data;
			})
			.catch(error => {
				console.log(error);
				vm.errored = true;
				vm.ecologies = ecologies;
			})
			.finally(() => vm.loading = false);
		this.$http
			.get('json/monstersPhysicology.json')
			.then(response => {
				vm.physicologies = response.data;
			})
			.catch(error => {
				console.log(error);
				vm.errored = true;
				vm.physicologies = physicologies;
			})
			.finally(() => vm.loading = false);
		this.$http
			.get('json/monstersDrops.json')
			.then(response => {
				vm.drops = response.data;
			})
			.catch(error => {
				console.log(error);
				vm.errored = true;
				vm.drops = drops;
			})
			.finally(() => vm.loading = false);
	},
	methods: {
		SelectMonster: function (monster) {
			this.monsterSelected = monster;
			this.ecologySelected = this.ecologies.find(x => x.Id === monster.Id);
			this.physicologySelected = this.physicologies.find(x => x.Id === monster.Id);
			this.dropSelected = this.drops.find(x => x.Id === monster.Id);
			if (this.dropSelected) {
				this.dropIndex = this.dropSelected.Drops.length - 1;
			} else {
				this.dropIndex = 0;
			}
			console.log(this.ecologySelected, this.physicologySelected, this.dropSelected);
		},
		FilterMonsters: function () {
			const valueSearched = this.searchBox.toLowerCase();
			const typeSearched = this.typeBox.toLowerCase();
			this.monstersFiltered = JSON.parse(JSON.stringify(
				this.monsters.filter(m =>
					m.Name.toLowerCase().includes(valueSearched) && m.Type.toLowerCase().includes(typeSearched))
			));
		},
		OrderHitDataBy: function (property) {
			this.physicologySelected.HitData.sort((a, b) => {
				if (a[property] < b[property]) {
					return 1;
				} else if (a[property] > b[property]) {
					return -1;
				} else {
					return 0;
				}
			});
		},
		RestoreMonsterData: function (monsterId) {
			this.monsterSelected = JSON.parse(JSON.stringify(this.monsters.find(m => m.Id === monsterId)));
		},
		SelectDropIndex: function (index) {
			this.dropIndex = index;
			this.showGL = false;
		}
	}
});