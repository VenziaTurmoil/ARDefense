export class RoundManager {
    constructor(bloonMngr) {
        this.rounds = new Array();
        this.bloonMngr = bloonMngr;
        this.active_round = 0;
        this.init();
    }

    init() {
        this.rounds.push(new Round(this.bloonMngr, 0, 0, 0, 5, 10000))
    }

    send_round() {
        if (this.active_round < this.rounds.length) {
            this.rounds[this.active_round].send();
            this.active_round++;
            return true;
        } else {
            return false;
        }
    }

}

class Round {
    constructor(bloonMngr, nbr_of_reds, nbr_of_blues, nbr_of_greens, nbr_of_yellows, length) {
        this.bloonMngr = bloonMngr;
        this.nbr_of_reds = nbr_of_reds;
        this.nbr_of_blues = nbr_of_blues;
        this.nbr_of_greens = nbr_of_greens;
        this.nbr_of_yellows = nbr_of_yellows;
        this.nbr_of_bloons = nbr_of_reds + nbr_of_blues + nbr_of_greens + nbr_of_yellows;
        this.remaining_bloons = this.nbr_of_bloons;
        this.length = length;
    }

    send() {
        if (this.remaining_bloons > 0) {
            setTimeout(() => {
                let rdm = Math.random() * this.remaining_bloons;
                if (rdm < this.nbr_of_reds) {
                    this.bloonMngr.addBloon(0);
                    this.nbr_of_reds--;
                } else if (rdm < this.nbr_of_reds + this.nbr_of_blues) {
                    this.bloonMngr.addBloon(1);
                    this.nbr_of_blues--;
                } else if (rdm < this.nbr_of_reds + this.nbr_of_blues + this.nbr_of_greens) {
                    this.bloonMngr.addBloon(2);
                    this.nbr_of_greens--;
                } else {
                    this.bloonMngr.addBloon(3);
                    this.nbr_of_yellows--;
                }
                this.remaining_bloons--;
                this.send();
            }, this.length / this.nbr_of_bloons);
        }
    }
}