export type CharacterClassBis = {
  choosen_index: string;
  choosen_proficiencies: string;
}

export type CharacterRaceBis = {
  choosen_index: string;
  choosen_language: string;
}

export class UserCharacter {
  constructor(
    public index: number,
    public name: string,
    public user_index: string,
    public character_class: CharacterClassBis,
    public characterAlignment: string,
    public choosenRace: CharacterRaceBis,
  ) {}

  toJSON(): object {
    return {
      index: this.index,
      name: this.name,
      user_index: this.user_index,
      character_class: {
        choosen_index: this.character_class.choosen_index,
        choosen_proficiencies: this.character_class.choosen_proficiencies,
      },
      character_alignment: this.characterAlignment,
      choosen_race: {
        choosen_index: this.choosenRace.choosen_index,
        choosen_language: this.choosenRace.choosen_language,
      },
    };
  }
}
