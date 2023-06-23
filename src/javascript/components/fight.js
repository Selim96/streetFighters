import controls from '../../constants/controls';

export function getHitPowerr(fighter) {
    // return hit power
    const { attack } = fighter;
    const criticalHitChance = Math.random() + 1;
    const power = attack * criticalHitChance;
    return power;
}

export function getBlockPowerr(fighter) {
    // return block power
    const { defense } = fighter;
    const dodgeChance = Math.random() + 1;
    const power = defense * dodgeChance;
    return power;
}

export function getDamage(attacker, defender) {
    // return damage
    const damage = getHitPowerr(attacker) - getBlockPowerr(defender);
    return damage < 0 ? 0 : damage;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const healthBarOne = document.getElementById('left-fighter-indicator');
        const healthBarTwo = document.getElementById('right-fighter-indicator');
        const fighterOneImage = document.querySelector('.arena___left-fighter').children[0];
        const fighterTwoImage = document.querySelector('.arena___right-fighter').children[0];

        const { attack: attackOne, health: healthOne } = firstFighter;
        const { attack: attackTwo, health: healthTwo } = secondFighter;

        const playerOne = {
            attack: attackOne,
            health: healthOne,
            isBlockedAttack: false,
            isAttackDone: false,
            comboKeys: [],
            isComboUsed: false,
            setHealth(health) {
                this.health = health;
            },
            setComboUsed(boole) {
                this.isComboUsed = boole;
            }
        };
        const playerTwo = {
            attack: attackTwo,
            health: healthTwo,
            isBlockedAttack: false,
            isAttackDone: false,
            comboKeys: [],
            isComboUsed: false,
            setHealth(value) {
                this.health = value;
            },
            setComboUsed(boole) {
                this.isComboUsed = boole;
            }
        };

        function useCombo(fighter1, fighter2) {
            // const { attack, setComboUsed } = fighter1;
            // const { health, setHealth } = fighter2;
            // const newHealth = health - 2 * attack;
            // setHealth(newHealth).bind(fighter2)();
            // setComboUsed(true);
            fighter2.health -= 2 * fighter1.attack;
            fighter1.isComboUsed = true;
            setTimeout(() => {
                fighter1.isComboUsed = false;
            }, 10000);
        }

        function cleanListeners(event, func) {
            document.removeEventListener(event, func);
        }

        function playerOneResolve() {
            healthBarTwo.style.width = playerTwo.health < 0 ? '0%' : `${(playerTwo.health / healthTwo) * 100}%`;
            fighterTwoImage.classList.add('hitted');
            setTimeout(() => {
                fighterTwoImage.classList.remove('hitted');
            }, 300);
            if (playerTwo.health <= 0) {
                cleanListeners('keydown', keydown);
                cleanListeners('keyup', keyup);
                resolve(firstFighter);
            }
        }

        function playerTwoResolve() {
            healthBarOne.style.width = playerOne.health < 0 ? '0%' : `${(playerOne.health / healthOne) * 100}%`;
            fighterOneImage.classList.add('hitted');
            setTimeout(() => {
                fighterOneImage.classList.remove('hitted');
            }, 300);
            if (playerOne.health <= 0) {
                cleanListeners('keydown', keydown);
                cleanListeners('keyup', keyup);
                resolve(secondFighter);
            }
        }

        function keydown(e) {
            // 1 игрок - включаем блок ударов
            if (e.code === controls.PlayerOneBlock) {
                playerOne.isBlockedAttack = true;
            }
            // 2 игрок - включаем блок ударов
            if (e.code === controls.PlayerTwoBlock) {
                playerTwo.isBlockedAttack = true;
            }

            // 1 игрок - наносим удары если не включен блок
            if (e.code === controls.PlayerOneAttack && !playerOne.isBlockedAttack && !playerOne.isAttackDone) {
                if (playerTwo.isBlockedAttack) {
                    playerTwo.health -= getDamage(firstFighter, secondFighter);
                } else {
                    playerTwo.health -= getHitPowerr(firstFighter);
                }
                playerOne.isAttackDone = true;
                playerOneResolve();
            }
            // 2 игрок - наносим удары если не включен блок
            if (e.code === controls.PlayerTwoAttack && !playerTwo.isBlockedAttack && !playerTwo.isAttackDone) {
                if (playerOne.isBlockedAttack) {
                    playerOne.health -= getDamage(secondFighter, firstFighter);
                } else {
                    playerOne.health -= getHitPowerr(secondFighter);
                }
                playerTwo.isAttackDone = true;
                playerTwoResolve();
            }
            // 1 игрок - комбо удар
            if (controls.PlayerOneCriticalHitCombination.includes(e.code) && !playerOne.comboKeys.includes(e.code)) {
                playerOne.comboKeys.push(e.code);
                if (playerOne.comboKeys.length === 3 && !playerOne.isComboUsed) useCombo(playerOne, playerTwo);
                playerOneResolve();
            }
            // 2 игрок - комбо удар
            if (controls.PlayerTwoCriticalHitCombination.includes(e.code) && !playerTwo.comboKeys.includes(e.code)) {
                playerTwo.comboKeys.push(e.code);
                if (playerTwo.comboKeys.length === 3 && !playerTwo.isComboUsed) useCombo(playerTwo, playerOne);
                playerTwoResolve();
            }
        }

        function keyup(e) {
            // 1 игрок - отключаем блок ударов
            if (e.code === controls.PlayerOneBlock) {
                playerOne.isBlockedAttack = false;
            }
            // 2 игрок - отключаем блок ударов
            if (e.code === controls.PlayerTwoBlock) {
                playerTwo.isBlockedAttack = false;
            }

            // 1 игрок - включить атаку
            if (e.code === controls.PlayerOneAttack) {
                playerOne.isAttackDone = false;
            }
            // 2 игрок - включить атаку
            if (e.code === controls.PlayerTwoAttack) {
                playerTwo.isAttackDone = false;
            }

            // 1 игрок - чистим от комбо клавиш
            if (controls.PlayerOneCriticalHitCombination.includes(e.code) && playerOne.comboKeys.length !== 0) {
                playerOne.comboKeys = [];
            }
            // 2 игрок - чистим от комбо клавиш
            if (controls.PlayerTwoCriticalHitCombination.includes(e.code) && playerTwo.comboKeys.length !== 0) {
                playerTwo.comboKeys = [];
            }
        }

        document.addEventListener('keydown', keydown);
        document.addEventListener('keyup', keyup);
    });
}
